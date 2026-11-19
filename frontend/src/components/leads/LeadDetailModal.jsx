import React, { useState } from 'react';
import { patchLeadApi, formatISTDateTime } from '../../services/leadApi';

const ALLOWED_STATUSES = ['New', 'Contacted', 'Qualified', 'Closed'];
const ALLOWED_PRIORITIES = ['High', 'Medium', 'Low'];

export default function LeadDetailModal({ lead, onClose, onLeadUpdated }) {
  const [currentLead, setCurrentLead] = useState(lead);
  const [statusVal, setStatusVal] = useState(lead?.status || 'New');
  const [overrideVal, setOverrideVal] = useState(lead?.override_priority || '');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingOverride, setIsUpdatingOverride] = useState(false);
  const [isClearingOverride, setIsClearingOverride] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!currentLead) return null;

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

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return (
          <span className="inline-block rounded px-2 py-0.5 text-[11px] font-semibold border border-text/40 bg-surface-raised text-text">
            New
          </span>
        );
      case 'Contacted':
        return (
          <span className="inline-block rounded px-2 py-0.5 text-[11px] font-medium border border-border text-text-secondary bg-surface">
            Contacted
          </span>
        );
      case 'Qualified':
        return (
          <span className="inline-block rounded px-2 py-0.5 text-[11px] font-semibold border border-text text-text bg-surface-hover">
            Qualified
          </span>
        );
      case 'Closed':
        return (
          <span className="inline-block rounded px-2 py-0.5 text-[11px] font-medium border border-border-subtle text-text-muted bg-surface">
            Closed
          </span>
        );
      default:
        return (
          <span className="inline-block rounded px-2 py-0.5 text-[11px] font-medium border border-border text-text-muted bg-surface">
            {status}
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

  // 1. Lifecycle Status Update
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!ALLOWED_STATUSES.includes(statusVal)) {
      setErrorMsg(`Invalid status. Must be one of: ${ALLOWED_STATUSES.join(', ')}`);
      return;
    }

    setIsUpdatingStatus(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const updated = await patchLeadApi(currentLead.id, { status: statusVal });
      setCurrentLead(updated);
      setSuccessMsg(`Lifecycle status updated to "${updated.status}" successfully.`);
      if (onLeadUpdated) onLeadUpdated(updated);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // 2. Manual Priority Override Update
  const handleUpdateOverride = async (e) => {
    e.preventDefault();
    if (!overrideVal || !ALLOWED_PRIORITIES.includes(overrideVal)) {
      setErrorMsg(`Please select a valid override priority: ${ALLOWED_PRIORITIES.join(', ')}`);
      return;
    }

    setIsUpdatingOverride(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const updated = await patchLeadApi(currentLead.id, { override_priority: overrideVal });
      setCurrentLead(updated);
      setSuccessMsg(
        `Manual priority override set to "${updated.override_priority}". Effective priority is now "${updated.effective_priority}".`
      );
      if (onLeadUpdated) onLeadUpdated(updated);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to apply priority override.');
    } finally {
      setIsUpdatingOverride(false);
    }
  };

  // 3. Clear Priority Override
  const handleClearOverride = async () => {
    setIsClearingOverride(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const updated = await patchLeadApi(currentLead.id, { override_priority: null });
      setCurrentLead(updated);
      setOverrideVal('');
      setSuccessMsg(
        `Priority override cleared. Effective priority restored to recommendation: "${updated.effective_priority}".`
      );
      if (onLeadUpdated) onLeadUpdated(updated);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to clear priority override.');
    } finally {
      setIsClearingOverride(false);
    }
  };

  const isSubmitting = isUpdatingStatus || isUpdatingOverride || isClearingOverride;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 overflow-y-auto backdrop-blur-sm transition-colors"
      onClick={onClose}
    >
      <div
        className="relative my-6 w-full max-w-2xl rounded-lg bg-surface border border-border shadow-2xl overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-border bg-surface-raised px-5 py-3 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-surface text-text font-mono font-bold text-xs shadow-xs">
              #{currentLead.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-text font-mono">
                  {currentLead.lead_id}
                </h3>
                {renderStatusBadge(currentLead.status)}
              </div>
              <p className="text-[11px] text-text-secondary mt-0.5 font-medium">
                Channel: <span className="font-semibold text-text">{currentLead.source}</span> • Added: {formatISTDateTime(currentLead.created_at)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-text-muted hover:bg-surface-hover hover:text-text transition-colors"
            aria-label="Close dialog"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[75vh] overflow-y-auto p-5 space-y-4">
          {/* Notification Alerts */}
          {successMsg && (
            <div className="rounded-md border border-border-strong bg-surface-raised p-3 text-xs text-text flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">✓</span>
                <span className="font-medium">{successMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMsg(null)}
                className="text-text hover:text-text-secondary font-bold ml-2 text-sm"
              >
                ×
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="rounded-md border border-border-strong bg-surface-raised p-3 text-xs text-text flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">✕</span>
                <span className="font-medium">{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="text-text hover:text-text-secondary font-bold ml-2 text-sm"
              >
                ×
              </button>
            </div>
          )}

          {/* Section 1: Customer & Order Details */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
              Lead Specifications
            </h4>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5 rounded-md border border-border bg-surface-raised p-3 text-xs">
              <div>
                <span className="text-text-muted block text-[10px] uppercase font-mono">Customer Type</span>
                <span className="font-semibold text-text">{currentLead.customer_type}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] uppercase font-mono">Target Vehicle</span>
                <span className="font-semibold text-text">{currentLead.vehicle}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] uppercase font-mono">Part Needed</span>
                <span className="font-semibold text-text">{currentLead.part_needed}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] uppercase font-mono">Order Value</span>
                <span className="font-mono font-bold text-text">{formatCurrency(currentLead.estimated_order_value_inr)}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] uppercase font-mono">Added On (IST)</span>
                <span className="font-mono font-medium text-text">{formatISTDateTime(currentLead.created_at)}</span>
              </div>
            </div>

            {/* Customer Message */}
            <div className="mt-2.5 rounded-md border border-border bg-surface p-3 text-xs">
              <span className="text-[10px] font-bold text-text-muted block uppercase tracking-wider mb-1">
                Customer Inquiry Statement
              </span>
              <p className="text-text whitespace-pre-wrap leading-relaxed bg-surface-raised p-2.5 rounded-md border border-border font-sans text-xs">
                {currentLead.message}
              </p>
            </div>
          </div>

          {/* Section 2: Priority & Status Overview */}
          <div className="rounded-md border border-border bg-surface-raised p-3.5 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-text"></span>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-text">
                  Priority &amp; Status
                </h4>
              </div>
              {currentLead.override_priority ? (
                <span className="rounded border border-border-strong bg-surface px-1.5 py-0.5 text-[10px] text-text font-mono font-bold">
                  Manual Override Active
                </span>
              ) : (
                <span className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-text-muted font-medium">
                  System Scored
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="rounded-md bg-surface p-2.5 border border-border">
                <span className="text-text-muted block text-[10px] uppercase font-mono">Priority</span>
                <div className="mt-1">
                  {renderPriorityBadge(currentLead.effective_priority)}
                </div>
                {currentLead.override_priority && (
                  <span className="block mt-1 text-[10px] text-text-secondary font-mono">
                    (Manual Override: {currentLead.override_priority})
                  </span>
                )}
              </div>

              <div className="rounded-md bg-surface p-2.5 border border-border">
                <span className="text-text-muted block text-[10px] uppercase font-mono">Current Status</span>
                <div className="mt-1">
                  {renderStatusBadge(currentLead.status)}
                </div>
              </div>
            </div>

            <p className="text-[10px] text-text-muted leading-tight">
              * Priority reflects current dispatch triage. Sales representatives can apply or clear manual overrides below.
            </p>
          </div>

          {/* Section 3: Sales Rep Actions (Status Update & Priority Override) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Action Card A: Lifecycle Status Update */}
            <div className="rounded-md border border-border bg-surface p-3 space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-text">
                Update Lead Status
              </h4>
              <p className="text-[11px] text-text-muted">
                Advance qualification lifecycle:
              </p>
              <form onSubmit={handleUpdateStatus} className="space-y-2">
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                  disabled={isSubmitting}
                  className="block w-full rounded-md border border-input-border py-1.5 px-2.5 text-xs text-text bg-input-bg focus:border-input-focus focus:outline-none focus:ring-1 focus:ring-input-focus disabled:opacity-50"
                >
                  {ALLOWED_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st} {st === currentLead.status ? '(Current)' : ''}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  disabled={isSubmitting || statusVal === currentLead.status}
                  className="w-full rounded-md bg-accent text-accent-contrast hover:bg-accent-hover py-1.5 px-3 text-xs font-bold focus-ring shadow-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUpdatingStatus ? 'Updating Status...' : 'Apply Status Update'}
                </button>
              </form>
            </div>

            {/* Action Card B: Manual Priority Override */}
            <div className="rounded-md border border-border bg-surface p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-text">
                  Manual Priority Override
                </h4>
                {currentLead.override_priority && (
                  <span className="rounded border border-border-strong bg-surface-raised px-1.5 py-0.5 text-[10px] font-bold text-text font-mono">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-text-muted">
                Override priority or revert to recommendation:
              </p>

              <form onSubmit={handleUpdateOverride} className="space-y-2">
                <select
                  value={overrideVal}
                  onChange={(e) => setOverrideVal(e.target.value)}
                  disabled={isSubmitting}
                  className="block w-full rounded-md border border-input-border py-1.5 px-2.5 text-xs text-text bg-input-bg focus:border-input-focus focus:outline-none focus:ring-1 focus:ring-input-focus disabled:opacity-50 transition-colors"
                >
                  <option value="">Select Override Priority...</option>
                  {ALLOWED_PRIORITIES.map((pr) => (
                    <option key={pr} value={pr}>
                      {pr} {pr === currentLead.override_priority ? '(Current Override)' : ''}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !overrideVal || overrideVal === currentLead.override_priority}
                    className="flex-1 rounded-md bg-accent text-accent-contrast hover:bg-accent-hover py-1.5 px-3 text-xs font-bold transition-colors shadow-xs focus-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isUpdatingOverride ? 'Applying...' : 'Apply Override'}
                  </button>

                  {currentLead.override_priority && (
                    <button
                      type="button"
                      onClick={handleClearOverride}
                      disabled={isSubmitting}
                      className="rounded-md border border-border bg-surface hover:bg-surface-hover py-1.5 px-2.5 text-xs font-semibold text-text transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                      title="Clear override and restore recommended priority"
                    >
                      {isClearingOverride ? 'Clearing...' : 'Clear'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-border bg-surface-raised px-5 py-2.5 text-xs text-text-secondary transition-colors">
          <span className="font-mono text-[11px]">
            Added: {formatISTDateTime(currentLead.created_at)} • Updated: {formatISTDateTime(currentLead.updated_at)}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border bg-surface px-3 py-1 text-xs font-semibold text-text hover:bg-surface-hover transition-colors shadow-xs focus-ring"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}