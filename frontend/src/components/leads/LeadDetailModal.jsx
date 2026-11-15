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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New':
        return 'text-[#173B67] dark:text-[#93C5FD] bg-[#E9EFF8] dark:bg-[#1E3A8A]/30 border-[#DCE4EE] dark:border-[#3B82F6]/40';
      case 'Contacted':
        return 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/50';
      case 'Qualified':
        return 'text-[#059669] dark:text-[#34D399] bg-[#ECFDF5] dark:bg-[#064E3B]/30 border-[#6EE7B7] dark:border-[#059669]/50';
      case 'Closed':
        return 'text-[#64748B] dark:text-[#94A3B8] bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700';
      default:
        return 'text-[#172438] dark:text-[#F8FAFC] bg-[#F3F6FA] dark:bg-[#162032] border-[#DCE4EE] dark:border-[#26354D]';
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

  const formatDate = (isoStr) => {
    return formatISTDateTime(isoStr);
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 overflow-y-auto backdrop-blur-xs transition-colors"
      onClick={onClose}
    >
      <div
        className="relative my-6 w-full max-w-2xl rounded-md bg-white dark:bg-[#162032] border border-[#DCE4EE] dark:border-[#26354D] shadow-xl overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-[#DCE4EE] dark:border-[#26354D] bg-[#F3F6FA] dark:bg-[#0F172A] px-5 py-3 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#173B67] dark:bg-[#3678D4] text-white font-mono font-bold text-xs shadow-xs">
              #{currentLead.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#173B67] dark:text-[#F8FAFC] font-mono">
                  {currentLead.lead_id}
                </h3>
                <span
                  className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold border ${getStatusBadgeClass(
                    currentLead.status
                  )}`}
                >
                  {currentLead.status}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5 font-medium">
                Channel: <span className="font-semibold text-[#172438] dark:text-[#F8FAFC]">{currentLead.source}</span> • Added: {formatISTDateTime(currentLead.created_at)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E9EFF8] dark:hover:bg-[#1E293B] hover:text-[#172438] dark:hover:text-[#F8FAFC] transition-colors"
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
            <div className="rounded border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/30 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">{successMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMsg(null)}
                className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-200 font-bold ml-2 text-sm"
              >
                ×
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="rounded border border-red-300 dark:border-red-800/60 bg-red-50 dark:bg-red-950/30 p-3 text-xs text-red-800 dark:text-red-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="text-red-700 dark:text-red-400 hover:text-red-950 dark:hover:text-red-200 font-bold ml-2 text-sm"
              >
                ×
              </button>
            </div>
          )}

          {/* Section 1: Customer & Order Details */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-2">
              Lead Specifications
            </h4>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5 rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-[#F3F6FA] dark:bg-[#0F172A] p-3 text-xs">
              <div>
                <span className="text-[#64748B] dark:text-[#94A3B8] block text-[10px] uppercase font-mono">Customer Type</span>
                <span className="font-semibold text-[#172438] dark:text-[#F8FAFC]">{currentLead.customer_type}</span>
              </div>
              <div>
                <span className="text-[#64748B] dark:text-[#94A3B8] block text-[10px] uppercase font-mono">Target Vehicle</span>
                <span className="font-semibold text-[#172438] dark:text-[#F8FAFC]">{currentLead.vehicle}</span>
              </div>
              <div>
                <span className="text-[#64748B] dark:text-[#94A3B8] block text-[10px] uppercase font-mono">Part Needed</span>
                <span className="font-semibold text-[#172438] dark:text-[#F8FAFC]">{currentLead.part_needed}</span>
              </div>
              <div>
                <span className="text-[#64748B] dark:text-[#94A3B8] block text-[10px] uppercase font-mono">Order Value</span>
                <span className="font-mono font-bold text-[#173B67] dark:text-[#38BDF8]">{formatCurrency(currentLead.estimated_order_value_inr)}</span>
              </div>
              <div>
                <span className="text-[#64748B] dark:text-[#94A3B8] block text-[10px] uppercase font-mono">Added On (IST)</span>
                <span className="font-mono font-medium text-[#172438] dark:text-[#F8FAFC]">{formatISTDateTime(currentLead.created_at)}</span>
              </div>
            </div>

            {/* Customer Message */}
            <div className="mt-2.5 rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-3 text-xs">
              <span className="text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] block uppercase tracking-wider mb-1">
                Customer Inquiry Statement
              </span>
              <p className="text-[#172438] dark:text-[#F8FAFC] whitespace-pre-wrap leading-relaxed bg-[#F3F6FA] dark:bg-[#0F172A] p-2.5 rounded border border-[#DCE4EE] dark:border-[#26354D] font-sans text-xs">
                {currentLead.message}
              </p>
            </div>
          </div>

          {/* Section 2: Priority & Status Overview */}
          <div className="rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-[#F3F6FA] dark:bg-[#0F172A] p-3.5 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#DCE4EE] dark:border-[#26354D]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#3678D4]"></span>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#173B67] dark:text-[#F8FAFC]">
                  Priority &amp; Status
                </h4>
              </div>
              {currentLead.override_priority ? (
                <span className="rounded border border-[#FCD34D] dark:border-[#D97706]/50 bg-[#FFFBEB] dark:bg-[#78350F]/40 px-1.5 py-0.5 text-[10px] text-[#D97706] dark:text-[#FBBF24] font-bold">
                  Manual Override Active
                </span>
              ) : (
                <span className="rounded border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] px-1.5 py-0.5 text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium">
                  System Scored
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="rounded bg-white dark:bg-[#162032] p-2.5 border border-[#DCE4EE] dark:border-[#26354D]">
                <span className="text-[#64748B] dark:text-[#94A3B8] block text-[10px] uppercase font-mono">Priority</span>
                <span
                  className={`inline-block mt-1 rounded px-2.5 py-0.5 font-bold text-xs border ${getPriorityBadgeClass(
                    currentLead.effective_priority
                  )}`}
                >
                  {currentLead.effective_priority}
                </span>
                {currentLead.override_priority && (
                  <span className="block mt-0.5 text-[10px] text-[#D97706] dark:text-[#FBBF24] font-bold">
                    (Manual Override: {currentLead.override_priority})
                  </span>
                )}
              </div>

              <div className="rounded bg-white dark:bg-[#162032] p-2.5 border border-[#DCE4EE] dark:border-[#26354D]">
                <span className="text-[#64748B] dark:text-[#94A3B8] block text-[10px] uppercase font-mono">Current Status</span>
                <span
                  className={`inline-block mt-1 rounded px-2 py-0.5 font-semibold text-xs border ${getStatusBadgeClass(
                    currentLead.status
                  )}`}
                >
                  {currentLead.status}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] leading-tight">
              * Priority reflects current dispatch triage. Sales representatives can apply or clear manual overrides below.
            </p>
          </div>

          {/* Section 3: Sales Rep Actions (Status Update & Priority Override) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Action Card A: Lifecycle Status Update */}
            <div className="rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-3 space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#173B67] dark:text-[#F8FAFC]">
                Update Lead Status
              </h4>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                Advance qualification lifecycle:
              </p>
              <form onSubmit={handleUpdateStatus} className="space-y-2">
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                  disabled={isSubmitting}
                  className="block w-full rounded border border-[#DCE4EE] dark:border-[#26354D] py-1.5 px-2.5 text-xs text-[#172438] dark:text-[#F8FAFC] bg-white dark:bg-[#0F172A] focus:border-[#3678D4] dark:focus:border-[#60A5FA] focus:outline-none focus:ring-1 focus:ring-[#3678D4] dark:focus:ring-[#60A5FA] disabled:bg-[#F3F6FA] dark:disabled:bg-[#1E293B]"
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
                  className="w-full rounded bg-[#3678D4] py-1.5 px-3 text-xs font-bold text-white hover:bg-[#2A62B6] focus-ring shadow-btn btn-interactive disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700 transition-colors"
                >
                  {isUpdatingStatus ? 'Updating Status...' : 'Apply Status Update'}
                </button>
              </form>
            </div>

            {/* Action Card B: Manual Priority Override */}
            <div className="rounded border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#173B67] dark:text-[#F8FAFC]">
                  Manual Priority Override
                </h4>
                {currentLead.override_priority && (
                  <span className="rounded border border-[#FCD34D] dark:border-[#D97706]/50 bg-[#FFFBEB] dark:bg-[#78350F]/40 px-1.5 py-0.2 text-[10px] font-bold text-[#D97706] dark:text-[#FBBF24]">
                    Active Override
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                Override priority or revert to recommendation:
              </p>

              <form onSubmit={handleUpdateOverride} className="space-y-2">
                <select
                  value={overrideVal}
                  onChange={(e) => setOverrideVal(e.target.value)}
                  disabled={isSubmitting}
                  className="block w-full rounded border border-[#DCE4EE] dark:border-[#26354D] py-1.5 px-2.5 text-xs text-[#172438] dark:text-[#F8FAFC] bg-white dark:bg-[#0F172A] focus:border-[#3678D4] dark:focus:border-[#60A5FA] focus:outline-none focus:ring-1 focus:ring-[#3678D4] dark:focus:ring-[#60A5FA] disabled:bg-slate-50 dark:disabled:bg-[#1E293B] transition-colors"
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
                    className="flex-1 rounded border border-[#173B67] dark:border-[#3678D4] bg-[#173B67] dark:bg-[#3678D4] hover:bg-[#0F2847] dark:hover:bg-[#2A62B6] text-white py-1.5 px-3 text-xs font-bold transition-colors shadow-sm btn-interactive disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:border-slate-300 dark:disabled:border-slate-700"
                  >
                    {isUpdatingOverride ? 'Applying...' : 'Apply Override'}
                  </button>

                  {currentLead.override_priority && (
                    <button
                      type="button"
                      onClick={handleClearOverride}
                      disabled={isSubmitting}
                      className="rounded border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#0F172A] py-1.5 px-2.5 text-xs font-semibold text-[#172438] dark:text-[#F8FAFC] hover:bg-[#E9EFF8] dark:hover:bg-[#1E293B] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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
        <div className="flex items-center justify-between border-t border-[#DCE4EE] dark:border-[#26354D] bg-[#F3F6FA] dark:bg-[#0F172A] px-5 py-2.5 text-xs text-[#64748B] dark:text-[#94A3B8] transition-colors">
          <span className="font-mono text-[11px]">
            Added: {formatISTDateTime(currentLead.created_at)} • Updated: {formatISTDateTime(currentLead.updated_at)}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] px-3 py-1 text-xs font-semibold text-[#172438] dark:text-[#F8FAFC] hover:bg-[#E9EFF8] dark:hover:bg-[#1E293B] transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
