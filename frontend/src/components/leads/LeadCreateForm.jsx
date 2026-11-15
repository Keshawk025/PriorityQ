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

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-[#DC2626] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 border-[#FCA5A5] dark:border-[#DC2626]/50 font-bold';
      case 'Medium':
        return 'text-[#D97706] dark:text-[#FBBF24] bg-[#FFFBEB] dark:bg-[#78350F]/30 border-[#FCD34D] dark:border-[#D97706]/50 font-bold';
      case 'Low':
        return 'text-[#059669] dark:text-[#34D399] bg-[#ECFDF5] dark:bg-[#064E3B]/30 border-[#6EE7B7] dark:border-[#059669]/50 font-bold';
      default:
        return 'text-[#172438] dark:text-[#F8FAFC] bg-[#F3F6FA] dark:bg-[#162032] border-[#DCE4EE] dark:border-[#26354D] font-bold';
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
    <div className="rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-4 sm:p-5 shadow-card dark:shadow-card-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-150">
      {/* Header */}
      <div className="border-b border-[#DCE4EE] dark:border-[#26354D] pb-3">
        <h2 className="text-sm font-bold text-[#173B67] dark:text-[#F8FAFC]">Create New Lead</h2>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
          Submit customer inquiry for automated priority classification
        </p>
      </div>

      {/* Success AI Prediction Banner */}
      {successLead && (
        <div className="mt-4 rounded border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/30 p-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-600 text-white">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <div>
                <h4 className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">Lead Created Successfully</h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Priority scored and saved to pipeline</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-medium text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 underline"
            >
              Create Another
            </button>
          </div>

          {/* Result Card */}
          <div className="mt-2.5 grid grid-cols-2 gap-2.5 rounded border border-emerald-200 dark:border-emerald-800/40 bg-white dark:bg-[#0F172A] p-2.5 text-xs sm:grid-cols-5">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-mono">Lead ID</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{successLead.lead_id}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-mono">Priority</span>
              <span
                className={`inline-block mt-0.5 rounded px-2 py-0.5 font-semibold text-[11px] border ${getPriorityBadgeClass(
                  successLead.effective_priority
                )}`}
              >
                {successLead.effective_priority}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-mono">Status</span>
              <span className="inline-block mt-0.5 font-medium text-slate-800 dark:text-slate-200">
                {successLead.status}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-mono">Order Value</span>
              <span className="font-mono font-medium text-slate-900 dark:text-slate-100">
                {formatCurrency(successLead.estimated_order_value_inr)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-mono">Added On</span>
              <span className="font-mono font-medium text-slate-900 dark:text-slate-100 text-[11px]">
                {formatISTDateTime(successLead.created_at)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Global API Error Alert */}
      {apiError && (
        <div
          className={`mt-4 rounded border p-3 text-xs ${
            apiError.type === 'duplicate'
              ? 'border-[#FCD34D] dark:border-amber-800 bg-[#FFFBEB] dark:bg-amber-950/40 text-[#D97706] dark:text-amber-400'
              : 'border-[#FCA5A5] dark:border-red-800 bg-[#FEF2F2] dark:bg-red-950/40 text-[#DC2626] dark:text-red-400'
          }`}
          role="alert"
        >
          <div className="flex items-start gap-2">
            <svg className="h-4 w-4 shrink-0 text-[#DC2626] dark:text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
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
            <label htmlFor="lead_id" className="block text-[11px] font-bold text-[#172438] dark:text-[#F8FAFC]">
              Lead ID <span className="text-[#DC2626] dark:text-[#F87171]">*</span>
            </label>
            <input
              type="text"
              id="lead_id"
              name="lead_id"
              value={formData.lead_id}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g., LEAD-2026-001"
              className={`mt-1 block w-full rounded border px-2.5 py-1.5 text-xs text-[#172438] dark:text-[#F8FAFC] bg-white dark:bg-[#0F172A] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 ${
                fieldErrors.lead_id
                  ? 'border-[#FCA5A5] dark:border-red-800 focus:border-[#DC2626] dark:focus:border-red-500 focus:ring-[#DC2626] dark:focus:ring-red-500'
                  : 'border-[#DCE4EE] dark:border-[#26354D] focus:border-[#3678D4] dark:focus:border-[#60A5FA] focus:ring-[#3678D4] dark:focus:ring-[#60A5FA]'
              } disabled:bg-[#F3F6FA] dark:disabled:bg-[#1E293B] disabled:text-slate-400`}
            />
            {fieldErrors.lead_id && (
              <p className="mt-1 text-[11px] font-medium text-[#DC2626] dark:text-[#F87171]">{fieldErrors.lead_id}</p>
            )}
          </div>

          <div>
            <label htmlFor="source" className="block text-[11px] font-bold text-[#172438] dark:text-[#F8FAFC]">
              Source Channel <span className="text-[#DC2626] dark:text-[#F87171]">*</span>
            </label>
            <input
              type="text"
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g., Website, Phone, Referral"
              className={`mt-1 block w-full rounded border px-2.5 py-1.5 text-xs text-[#172438] dark:text-[#F8FAFC] bg-white dark:bg-[#0F172A] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 ${
                fieldErrors.source
                  ? 'border-[#FCA5A5] dark:border-red-800 focus:border-[#DC2626] dark:focus:border-red-500 focus:ring-[#DC2626] dark:focus:ring-red-500'
                  : 'border-[#DCE4EE] dark:border-[#26354D] focus:border-[#3678D4] dark:focus:border-[#60A5FA] focus:ring-[#3678D4] dark:focus:ring-[#60A5FA]'
              } disabled:bg-[#F3F6FA] dark:disabled:bg-[#1E293B] disabled:text-slate-400`}
            />
            {fieldErrors.source && (
              <p className="mt-1 text-[11px] font-medium text-[#DC2626] dark:text-[#F87171]">{fieldErrors.source}</p>
            )}
          </div>
        </div>

        {/* Row 2: customer_type & vehicle */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="customer_type" className="block text-[11px] font-bold text-[#172438] dark:text-[#F8FAFC]">
              Customer Type <span className="text-[#DC2626] dark:text-[#F87171]">*</span>
            </label>
            <input
              type="text"
              id="customer_type"
              name="customer_type"
              value={formData.customer_type}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g., Fleet Owner, Garage, Retail"
              className={`mt-1 block w-full rounded border px-2.5 py-1.5 text-xs text-[#172438] dark:text-[#F8FAFC] bg-white dark:bg-[#0F172A] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 ${
                fieldErrors.customer_type
                  ? 'border-[#FCA5A5] dark:border-red-800 focus:border-[#DC2626] dark:focus:border-red-500 focus:ring-[#DC2626] dark:focus:ring-red-500'
                  : 'border-[#DCE4EE] dark:border-[#26354D] focus:border-[#3678D4] dark:focus:border-[#60A5FA] focus:ring-[#3678D4] dark:focus:ring-[#60A5FA]'
              } disabled:bg-[#F3F6FA] dark:disabled:bg-[#1E293B] disabled:text-slate-400`}
            />
            {fieldErrors.customer_type && (
              <p className="mt-1 text-[11px] font-medium text-[#DC2626] dark:text-[#F87171]">{fieldErrors.customer_type}</p>
            )}
          </div>

          <div>
            <label htmlFor="vehicle" className="block text-[11px] font-bold text-[#172438] dark:text-[#F8FAFC]">
              Vehicle Model <span className="text-[#DC2626] dark:text-[#F87171]">*</span>
            </label>
            <input
              type="text"
              id="vehicle"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g., Tata Prima 4028.S, Ashok Leyland"
              className={`mt-1 block w-full rounded border px-2.5 py-1.5 text-xs text-[#172438] dark:text-[#F8FAFC] bg-white dark:bg-[#0F172A] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 ${
                fieldErrors.vehicle
                  ? 'border-[#FCA5A5] dark:border-red-800 focus:border-[#DC2626] dark:focus:border-red-500 focus:ring-[#DC2626] dark:focus:ring-red-500'
                  : 'border-[#DCE4EE] dark:border-[#26354D] focus:border-[#3678D4] dark:focus:border-[#60A5FA] focus:ring-[#3678D4] dark:focus:ring-[#60A5FA]'
              } disabled:bg-[#F3F6FA] dark:disabled:bg-[#1E293B] disabled:text-slate-400`}
            />
            {fieldErrors.vehicle && (
              <p className="mt-1 text-[11px] font-medium text-[#DC2626] dark:text-[#F87171]">{fieldErrors.vehicle}</p>
            )}
          </div>
        </div>

        {/* Row 3: part_needed & estimated_order_value_inr */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="part_needed" className="block text-[11px] font-bold text-[#172438] dark:text-[#F8FAFC]">
              Part Needed <span className="text-[#DC2626] dark:text-[#F87171]">*</span>
            </label>
            <input
              type="text"
              id="part_needed"
              name="part_needed"
              value={formData.part_needed}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g., Brake Shoe Set, Turbocharger"
              className={`mt-1 block w-full rounded border px-2.5 py-1.5 text-xs text-[#172438] dark:text-[#F8FAFC] bg-white dark:bg-[#0F172A] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 ${
                fieldErrors.part_needed
                  ? 'border-[#FCA5A5] dark:border-red-800 focus:border-[#DC2626] dark:focus:border-red-500 focus:ring-[#DC2626] dark:focus:ring-red-500'
                  : 'border-[#DCE4EE] dark:border-[#26354D] focus:border-[#3678D4] dark:focus:border-[#60A5FA] focus:ring-[#3678D4] dark:focus:ring-[#60A5FA]'
              } disabled:bg-[#F3F6FA] dark:disabled:bg-[#1E293B] disabled:text-slate-400`}
            />
            {fieldErrors.part_needed && (
              <p className="mt-1 text-[11px] font-medium text-[#DC2626] dark:text-[#F87171]">{fieldErrors.part_needed}</p>
            )}
          </div>

          <div>
            <label htmlFor="estimated_order_value_inr" className="block text-[11px] font-bold text-[#172438] dark:text-[#F8FAFC]">
              Estimated Order Value (INR) <span className="text-[#DC2626] dark:text-[#F87171]">*</span>
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
              className={`mt-1 block w-full rounded border px-2.5 py-1.5 text-xs text-[#172438] dark:text-[#F8FAFC] bg-white dark:bg-[#0F172A] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 ${
                fieldErrors.estimated_order_value_inr
                  ? 'border-[#FCA5A5] dark:border-red-800 focus:border-[#DC2626] dark:focus:border-red-500 focus:ring-[#DC2626] dark:focus:ring-red-500'
                  : 'border-[#DCE4EE] dark:border-[#26354D] focus:border-[#3678D4] dark:focus:border-[#60A5FA] focus:ring-[#3678D4] dark:focus:ring-[#60A5FA]'
              } disabled:bg-[#F3F6FA] dark:disabled:bg-[#1E293B] disabled:text-slate-400`}
            />
            {fieldErrors.estimated_order_value_inr && (
              <p className="mt-1 text-[11px] font-medium text-[#DC2626] dark:text-[#F87171]">
                {fieldErrors.estimated_order_value_inr}
              </p>
            )}
          </div>
        </div>

        {/* Row 4: message (Textarea) */}
        <div>
          <label htmlFor="message" className="block text-[11px] font-bold text-[#172438] dark:text-[#F8FAFC]">
            Customer Message / Problem Statement <span className="text-[#DC2626] dark:text-[#F87171]">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Describe customer urgency, vehicle downtime, breakdown location, or fleet replacement urgency..."
            className={`mt-1 block w-full rounded border px-2.5 py-1.5 text-xs text-[#172438] dark:text-[#F8FAFC] bg-white dark:bg-[#0F172A] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 ${
              fieldErrors.message
                ? 'border-[#FCA5A5] dark:border-red-800 focus:border-[#DC2626] dark:focus:border-red-500 focus:ring-[#DC2626] dark:focus:ring-red-500'
                : 'border-[#DCE4EE] dark:border-[#26354D] focus:border-[#3678D4] dark:focus:border-[#60A5FA] focus:ring-[#3678D4] dark:focus:ring-[#60A5FA]'
            } disabled:bg-[#F3F6FA] dark:disabled:bg-[#1E293B] disabled:text-slate-400`}
          />
          {fieldErrors.message && (
            <p className="mt-1 text-[11px] font-medium text-[#DC2626] dark:text-[#F87171]">{fieldErrors.message}</p>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-1.5 rounded bg-[#3678D4] hover:bg-[#2A62B6] text-white px-3.5 py-2 text-xs font-bold shadow-btn btn-interactive focus-ring disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
          >
            {isSubmitting ? (
              <>
                <svg className="h-3.5 w-3.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
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
