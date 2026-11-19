import React, { useState } from 'react';
import { createLeadApi, formatISTDateTime } from '../../services/leadApi';

const INITIAL_FORM = {
  lead_id: '',
  source: '',
  customer_type: '',
  vehicle: '',
  part_needed: '',
  estimated_order_value_inr: '',
  message: '',
};

export default function LeadCreateForm({ onLeadCreated }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successLead, setSuccessLead] = useState(null);

  // Validate form inputs client-side
  const validateForm = () => {
    const errors = {};

    // 1. lead_id
    if (!formData.lead_id || !formData.lead_id.trim()) {
      errors.lead_id = 'Lead ID is required.';
    }

    // 2. source
    if (!formData.source || !formData.source.trim()) {
      errors.source = 'Source is required.';
    }

    // 3. customer_type
    if (!formData.customer_type || !formData.customer_type.trim()) {
      errors.customer_type = 'Customer type is required.';
    }

    // 4. vehicle
    if (!formData.vehicle || !formData.vehicle.trim()) {
      errors.vehicle = 'Vehicle is required.';
    }

    // 5. part_needed
    if (!formData.part_needed || !formData.part_needed.trim()) {
      errors.part_needed = 'Part needed is required.';
    }

    // 6. estimated_order_value_inr
    if (
      formData.estimated_order_value_inr === '' ||
      formData.estimated_order_value_inr === null ||
      formData.estimated_order_value_inr === undefined
    ) {
      errors.estimated_order_value_inr = 'Estimated order value is required.';
    } else {
      const numVal = Number(formData.estimated_order_value_inr);
      if (isNaN(numVal) || !Number.isInteger(numVal) || numVal < 0) {
        errors.estimated_order_value_inr =
          'Must be a non-negative integer (e.g. 25000).';
      }
    }

    // 7. message
    if (!formData.message || !formData.message.trim()) {
      errors.message = 'Customer message is required.';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error as user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    if (apiError) setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setApiError(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const createdLead = await createLeadApi(formData);
      setSuccessLead(createdLead);
      setFormData(INITIAL_FORM);
      setFieldErrors({});

      if (onLeadCreated) {
        onLeadCreated(createdLead);
      }
    } catch (err) {
      let friendlyMessage = err.message || 'An unexpected error occurred.';
      let errorType = 'general';

      if (err.status === 409) {
        errorType = 'duplicate';
        friendlyMessage = `Duplicate Lead ID: ${err.message}`;
      } else if (err.status === 422) {
        errorType = 'validation';
        friendlyMessage = `Validation Error: ${err.message}`;
      } else if (err.status === 503) {
        errorType = 'model_unavailable';
        friendlyMessage = `Scoring Service Unavailable: ${err.message}`;
      } else if (err.isNetworkError || err.status === 0) {
        errorType = 'network';
        friendlyMessage = err.message;
      }

      setApiError({
        type: errorType,
        status: err.status,
        message: friendlyMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessLead(null);
    setApiError(null);
    setFormData(INITIAL_FORM);
    setFieldErrors({});
  };

  // Priority indicators: Red (High), Yellow/Amber (Medium), Green (Low)
  const renderPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-500" aria-hidden="true"></span>
            <span>High</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>
            <span>Medium</span>
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true"></span>
            <span>Low</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium border border-border text-text-muted bg-surface-raised">
            <span>{priority || '—'}</span>
          </span>
        );
    }
  };

  const formatCurrency = (val) => {
    if (typeof val !== 'number') return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-4 sm:p-5 shadow-card hover:border-border-strong transition-all duration-150">
      {/* Header */}
      <div className="border-b border-border pb-3">
        <h2 className="text-sm font-bold text-text tracking-tight">Create New Lead</h2>
        <p className="text-xs text-text-muted">
          Submit customer inquiry for automated priority classification
        </p>
      </div>

      {/* Success AI Prediction Banner - Pure monochrome with check icon */}
      {successLead && (
        <div className="mt-4 rounded-md border border-border-strong bg-surface-raised p-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-accent text-accent-contrast font-bold text-xs">
                ✓
              </span>
              <div>
                <h4 className="text-xs font-semibold text-text">Lead Created Successfully</h4>
                <p className="text-[11px] text-text-secondary">Priority scored and saved to pipeline</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-medium text-text underline hover:text-text-secondary"
            >
              Create Another
            </button>
          </div>

          {/* Result Card */}
          <div className="mt-2.5 grid grid-cols-2 gap-2.5 rounded-md border border-border bg-surface p-2.5 text-xs sm:grid-cols-5">
            <div>
              <span className="text-text-muted block text-[10px] uppercase font-mono">Lead ID</span>
              <span className="font-mono font-semibold text-text">{successLead.lead_id}</span>
            </div>
            <div>
              <span className="text-text-muted block text-[10px] uppercase font-mono">Priority</span>
              <div className="mt-0.5">
                {renderPriorityBadge(successLead.effective_priority)}
              </div>
            </div>
            <div>
              <span className="text-text-muted block text-[10px] uppercase font-mono">Status</span>
              <span className="inline-block mt-0.5 font-medium text-text">
                {successLead.status}
              </span>
            </div>
            <div>
              <span className="text-text-muted block text-[10px] uppercase font-mono">Order Value</span>
              <span className="font-mono font-medium text-text">
                {formatCurrency(successLead.estimated_order_value_inr)}
              </span>
            </div>
            <div>
              <span className="text-text-muted block text-[10px] uppercase font-mono">Added On</span>
              <span className="font-mono font-medium text-text text-[11px]">
                {formatISTDateTime(successLead.created_at)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Global API Error Alert - Monochrome with icon */}
      {apiError && (
        <div
          className="mt-4 rounded-md border border-border-strong bg-surface-raised p-3 text-xs text-text"
          role="alert"
        >
          <div className="flex items-start gap-2">
            <span className="font-bold text-sm shrink-0 mt-0.5">✕</span>
            <div>
              <p className="font-bold">{apiError.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-3">
        {/* Row 1: lead_id & source */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="lead_id" className="block text-[11px] font-bold text-text">
              Lead ID <span className="text-text-muted">*</span>
            </label>
            <input
              type="text"
              id="lead_id"
              name="lead_id"
              value={formData.lead_id}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g., LEAD-2026-001"
              className={`mt-1 block w-full rounded-md border px-2.5 py-1.5 text-xs text-text bg-input-bg placeholder-text-muted focus:outline-none focus:ring-1 ${
                fieldErrors.lead_id
                  ? 'border-border-strong focus:border-text focus:ring-text'
                  : 'border-input-border focus:border-input-focus focus:ring-input-focus'
              } disabled:opacity-50`}
            />
            {fieldErrors.lead_id && (
              <p className="mt-1 text-[11px] font-medium text-text flex items-center gap-1">
                <span>!</span> {fieldErrors.lead_id}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="source" className="block text-[11px] font-bold text-text">
              Source Channel <span className="text-text-muted">*</span>
            </label>
            <input
              type="text"
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g., Website, Phone, Referral"
              className={`mt-1 block w-full rounded-md border px-2.5 py-1.5 text-xs text-text bg-input-bg placeholder-text-muted focus:outline-none focus:ring-1 ${
                fieldErrors.source
                  ? 'border-border-strong focus:border-text focus:ring-text'
                  : 'border-input-border focus:border-input-focus focus:ring-input-focus'
              } disabled:opacity-50`}
            />
            {fieldErrors.source && (
              <p className="mt-1 text-[11px] font-medium text-text flex items-center gap-1">
                <span>!</span> {fieldErrors.source}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: customer_type & vehicle */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="customer_type" className="block text-[11px] font-bold text-text">
              Customer Type <span className="text-text-muted">*</span>
            </label>
            <input
              type="text"
              id="customer_type"
              name="customer_type"
              value={formData.customer_type}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g., Fleet Owner, Garage, Retail"
              className={`mt-1 block w-full rounded-md border px-2.5 py-1.5 text-xs text-text bg-input-bg placeholder-text-muted focus:outline-none focus:ring-1 ${
                fieldErrors.customer_type
                  ? 'border-border-strong focus:border-text focus:ring-text'
                  : 'border-input-border focus:border-input-focus focus:ring-input-focus'
              } disabled:opacity-50`}
            />
            {fieldErrors.customer_type && (
              <p className="mt-1 text-[11px] font-medium text-text flex items-center gap-1">
                <span>!</span> {fieldErrors.customer_type}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="vehicle" className="block text-[11px] font-bold text-text">
              Vehicle Model <span className="text-text-muted">*</span>
            </label>
            <input
              type="text"
              id="vehicle"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g., Tata Prima 4028.S, Ashok Leyland"
              className={`mt-1 block w-full rounded-md border px-2.5 py-1.5 text-xs text-text bg-input-bg placeholder-text-muted focus:outline-none focus:ring-1 ${
                fieldErrors.vehicle
                  ? 'border-border-strong focus:border-text focus:ring-text'
                  : 'border-input-border focus:border-input-focus focus:ring-input-focus'
              } disabled:opacity-50`}
            />
            {fieldErrors.vehicle && (
              <p className="mt-1 text-[11px] font-medium text-text flex items-center gap-1">
                <span>!</span> {fieldErrors.vehicle}
              </p>
            )}
          </div>
        </div>

        {/* Row 3: part_needed & estimated_order_value_inr */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="part_needed" className="block text-[11px] font-bold text-text">
              Part Needed <span className="text-text-muted">*</span>
            </label>
            <input
              type="text"
              id="part_needed"
              name="part_needed"
              value={formData.part_needed}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g., Brake Shoe Set, Turbocharger"
              className={`mt-1 block w-full rounded-md border px-2.5 py-1.5 text-xs text-text bg-input-bg placeholder-text-muted focus:outline-none focus:ring-1 ${
                fieldErrors.part_needed
                  ? 'border-border-strong focus:border-text focus:ring-text'
                  : 'border-input-border focus:border-input-focus focus:ring-input-focus'
              } disabled:opacity-50`}
            />
            {fieldErrors.part_needed && (
              <p className="mt-1 text-[11px] font-medium text-text flex items-center gap-1">
                <span>!</span> {fieldErrors.part_needed}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="estimated_order_value_inr" className="block text-[11px] font-bold text-text">
              Estimated Order Value (INR) <span className="text-text-muted">*</span>
            </label>
            <input
              type="number"
              id="estimated_order_value_inr"
              name="estimated_order_value_inr"
              value={formData.estimated_order_value_inr}
              onChange={handleChange}
              disabled={isSubmitting}
              min="0"
              step="1"
              placeholder="e.g., 25000"
              className={`mt-1 block w-full rounded-md border px-2.5 py-1.5 text-xs text-text bg-input-bg placeholder-text-muted focus:outline-none focus:ring-1 ${
                fieldErrors.estimated_order_value_inr
                  ? 'border-border-strong focus:border-text focus:ring-text'
                  : 'border-input-border focus:border-input-focus focus:ring-input-focus'
              } disabled:opacity-50`}
            />
            {fieldErrors.estimated_order_value_inr && (
              <p className="mt-1 text-[11px] font-medium text-text flex items-center gap-1">
                <span>!</span> {fieldErrors.estimated_order_value_inr}
              </p>
            )}
          </div>
        </div>

        {/* Row 4: message (Textarea) */}
        <div>
          <label htmlFor="message" className="block text-[11px] font-bold text-text">
            Customer Message / Problem Statement <span className="text-text-muted">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Describe customer urgency, vehicle downtime, breakdown location, or fleet replacement urgency..."
            className={`mt-1 block w-full rounded-md border px-2.5 py-1.5 text-xs text-text bg-input-bg placeholder-text-muted focus:outline-none focus:ring-1 ${
              fieldErrors.message
                ? 'border-border-strong focus:border-text focus:ring-text'
                : 'border-input-border focus:border-input-focus focus:ring-input-focus'
            } disabled:opacity-50`}
          />
          {fieldErrors.message && (
            <p className="mt-1 text-[11px] font-medium text-text flex items-center gap-1">
              <span>!</span> {fieldErrors.message}
            </p>
          )}
        </div>

        {/* Action Button: Primary button (Solid white with black text in dark, solid black in light) */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-1.5 rounded-md bg-accent text-accent-contrast hover:bg-accent-hover px-3.5 py-2 text-xs font-bold shadow-xs focus-ring transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="h-3.5 w-3.5 animate-spin text-accent-contrast" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Scoring &amp; Creating Lead...</span>
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Lead &amp; Score Priority</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}