import React, { useState, useEffect, useCallback } from 'react';
import { fetchLeadsApi, formatISTDateTime } from '../../services/leadApi';
import LeadDetailModal from './LeadDetailModal';

const STATUS_OPTIONS = ['All', 'New', 'Contacted', 'Qualified', 'Closed'];
const PAGE_SIZE_OPTIONS = [10, 25, 50];

export default function LeadTable({ refreshTrigger }) {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  const loadLeads = useCallback(async (currentSkip, currentLimit, currentSearch, currentStatus, currentSort) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchLeadsApi({
        skip: currentSkip,
        limit: currentLimit,
        search: currentSearch,
        status: currentStatus,
        sort: currentSort,
      });
      setLeads(data.leads || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load leads. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads(skip, limit, searchTerm, statusFilter, sortOrder);
  }, [skip, limit, searchTerm, statusFilter, sortOrder, refreshTrigger, loadLeads]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSkip(0);
    loadLeads(0, limit, searchTerm, statusFilter, sortOrder);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
    setSkip(0);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortOrder(newSort);
    setSkip(0);
  };

  const handleToggleSort = () => {
    const nextSort = sortOrder === 'newest' ? 'oldest' : 'newest';
    setSortOrder(nextSort);
    setSkip(0);
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setSkip(0);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setSortOrder('newest');
    setSkip(0);
  };

  const handleLeadUpdated = (updated) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    loadLeads(skip, limit, searchTerm, statusFilter, sortOrder);
  };

  const totalPages = Math.ceil(total / limit) || 1;
  const currentPage = Math.floor(skip / limit) + 1;
  const startIndex = total === 0 ? 0 : skip + 1;
  const endIndex = Math.min(skip + limit, total);

  const handlePrevPage = () => {
    if (skip > 0) {
      setSkip(Math.max(0, skip - limit));
    }
  };

  const handleNextPage = () => {
    if (skip + limit < total) {
      setSkip(skip + limit);
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-[#DC2626] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 border-[#FCA5A5] dark:border-[#DC2626]/50';
      case 'Medium':
        return 'text-[#D97706] dark:text-[#FBBF24] bg-[#FFFBEB] dark:bg-[#78350F]/30 border-[#FCD34D] dark:border-[#D97706]/50';
      case 'Low':
        return 'text-[#059669] dark:text-[#34D399] bg-[#ECFDF5] dark:bg-[#064E3B]/30 border-[#6EE7B7] dark:border-[#059669]/50';
      default:
        return 'text-[#172438] dark:text-[#F8FAFC] bg-[#F3F6FA] dark:bg-[#162032] border-[#DCE4EE] dark:border-[#26354D]';
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

  return (
    <div className="rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] flex flex-col shadow-card dark:shadow-card-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-150">
      {/* Table Header & Controls */}
      <div className="p-4 border-b border-[#DCE4EE] dark:border-[#26354D] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#173B67] dark:text-[#F8FAFC]">Lead Prioritization Queue</h2>
              <span className="rounded border border-[#DCE4EE] dark:border-[#26354D] bg-[#E9EFF8] dark:bg-[#1E3A8A]/30 px-2 py-0.5 text-[11px] font-bold text-[#173B67] dark:text-[#93C5FD]">
                {total} {total === 1 ? 'lead' : 'leads'}
              </span>
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Active sales leads with automated priority scoring and lifecycle management
            </p>
          </div>

          {/* Quick Refresh Button */}
          <button
            type="button"
            onClick={() => loadLeads(skip, limit, searchTerm, statusFilter, sortOrder)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#1A263D] px-2.5 py-1 text-xs font-semibold text-[#172438] dark:text-[#F8FAFC] hover:bg-[#E9EFF8] dark:hover:bg-[#26354D] hover:text-[#173B67] dark:hover:text-[#60A5FA] hover:border-[#3678D4]/30 dark:hover:border-[#60A5FA]/40 focus-ring disabled:opacity-50 transition-colors shadow-xs"
            title="Refresh lead table"
          >
            <svg
              className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-[#3678D4] dark:text-[#60A5FA]' : 'text-[#64748B] dark:text-[#94A3B8]'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-0.5">
          {/* Search Input Form */}
          <form onSubmit={handleSearchSubmit} className="sm:col-span-5 relative">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                <svg className="h-3.5 w-3.5 text-[#64748B] dark:text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ID, customer, vehicle, part, message..."
                className="block w-full rounded border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#0F172A] pl-8 pr-14 py-1.5 text-xs text-[#172438] dark:text-[#F8FAFC] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:border-[#3678D4] dark:focus:border-[#60A5FA] focus:outline-none focus:ring-1 focus:ring-[#3678D4] dark:focus:ring-[#60A5FA] transition-colors"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-1 gap-1">
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setSkip(0);
                      loadLeads(0, limit, '', statusFilter, sortOrder);
                    }}
                    className="p-1 text-[#64748B] dark:text-[#94A3B8] hover:text-[#172438] dark:hover:text-[#F8FAFC] rounded"
                    title="Clear search"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  className="rounded bg-[#3678D4] px-2 py-0.5 text-[11px] font-bold text-white hover:bg-[#2A62B6] transition-colors shadow-btn"
                >
                  Go
                </button>
              </div>
            </div>
          </form>

          {/* Status Filter Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="block w-full rounded border border-[#DCE4EE] dark:border-[#26354D] py-1.5 px-2.5 text-xs text-[#172438] dark:text-[#F8FAFC] bg-white dark:bg-[#0F172A] focus:border-[#3678D4] dark:focus:border-[#60A5FA] focus:outline-none focus:ring-1 focus:ring-[#3678D4] dark:focus:ring-[#60A5FA] transition-colors"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status === 'All' ? 'All Statuses' : `Status: ${status}`}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order Selector */}
          <div className="sm:col-span-2">
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="block w-full rounded border border-[#DCE4EE] dark:border-[#26354D] py-1.5 px-2 text-xs text-[#172438] dark:text-[#F8FAFC] bg-white dark:bg-[#0F172A] focus:border-[#3678D4] dark:focus:border-[#60A5FA] focus:outline-none focus:ring-1 focus:ring-[#3678D4] dark:focus:ring-[#60A5FA] transition-colors"
              title="Sort leads by creation time"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Page Size Selector */}
          <div className="sm:col-span-2">
            <select
              value={limit}
              onChange={handleLimitChange}
              className="block w-full rounded border border-[#DCE4EE] dark:border-[#26354D] py-1.5 px-2.5 text-xs text-[#172438] dark:text-[#F8FAFC] bg-white dark:bg-[#0F172A] focus:border-[#3678D4] dark:focus:border-[#60A5FA] focus:outline-none focus:ring-1 focus:ring-[#3678D4] dark:focus:ring-[#60A5FA] transition-colors"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error State Banner */}
      {error && (
        <div className="m-3 rounded border border-[#FCA5A5] dark:border-red-800/60 bg-[#FEF2F2] dark:bg-red-950/40 p-3 text-xs text-[#DC2626] dark:text-red-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0 text-[#DC2626] dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
            <button
              type="button"
              onClick={() => loadLeads(skip, limit, searchTerm, statusFilter, sortOrder)}
              className="font-bold text-[#DC2626] dark:text-red-400 underline hover:text-red-900 dark:hover:text-red-300 focus-ring"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Compact CRM Table */}
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-[#DCE4EE] dark:divide-[#26354D] text-left text-xs">
          <thead className="bg-[#F3F6FA] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th scope="col" className="px-3.5 py-2.5 w-28">Lead ID</th>
              <th scope="col" className="px-3.5 py-2.5 w-40">Customer &amp; Channel</th>
              <th scope="col" className="px-3.5 py-2.5">Vehicle &amp; Part</th>
              <th scope="col" className="px-3.5 py-2.5 text-right w-28">Order Value</th>
              <th scope="col" className="px-3.5 py-2.5 w-28">Priority</th>
              <th scope="col" className="px-3.5 py-2.5 w-24">Status</th>
              <th scope="col" className="px-3.5 py-2.5 w-44">
                <button
                  type="button"
                  onClick={handleToggleSort}
                  className="group inline-flex items-center gap-1 font-bold text-[#64748B] dark:text-[#94A3B8] hover:text-[#173B67] dark:hover:text-[#F8FAFC] uppercase tracking-wider text-[10px] focus:outline-none transition-colors"
                  title={`Sorted by ${sortOrder === 'newest' ? 'newest first' : 'oldest first'}. Click to toggle.`}
                >
                  <span>Added On (IST)</span>
                  <span className="text-[#3678D4] dark:text-[#60A5FA] font-mono text-xs">
                    {sortOrder === 'newest' ? '↓' : '↑'}
                  </span>
                </button>
              </th>
              <th scope="col" className="px-3.5 py-2.5 text-center w-24">Manage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCE4EE] dark:divide-[#26354D] bg-white dark:bg-[#162032]">
            {isLoading ? (
              // Skeleton loading rows
              Array.from({ length: Math.min(5, limit) }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="animate-pulse">
                  <td className="px-3.5 py-2.5"><div className="h-3 w-16 bg-[#E9EFF8] dark:bg-[#1E293B] rounded"></div></td>
                  <td className="px-3.5 py-2.5"><div className="h-3 w-24 bg-[#E9EFF8] dark:bg-[#1E293B] rounded"></div></td>
                  <td className="px-3.5 py-2.5"><div className="h-3 w-36 bg-[#E9EFF8] dark:bg-[#1E293B] rounded"></div></td>
                  <td className="px-3.5 py-2.5 text-right"><div className="h-3 w-16 bg-[#E9EFF8] dark:bg-[#1E293B] rounded ml-auto"></div></td>
                  <td className="px-3.5 py-2.5"><div className="h-3.5 w-16 bg-[#E9EFF8] dark:bg-[#1E293B] rounded"></div></td>
                  <td className="px-3.5 py-2.5"><div className="h-3.5 w-14 bg-[#E9EFF8] dark:bg-[#1E293B] rounded"></div></td>
                  <td className="px-3.5 py-2.5"><div className="h-3 w-28 bg-[#E9EFF8] dark:bg-[#1E293B] rounded"></div></td>
                  <td className="px-3.5 py-2.5 text-center"><div className="h-3.5 w-12 bg-[#E9EFF8] dark:bg-[#1E293B] rounded mx-auto"></div></td>
                </tr>
              ))
            ) : leads.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={8} className="px-3 py-10 text-center text-[#64748B] dark:text-[#94A3B8]">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded border border-[#DCE4EE] dark:border-[#26354D] bg-[#F3F6FA] dark:bg-[#0F172A]">
                    <svg className="h-5 w-5 text-[#64748B] dark:text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="mt-2.5 text-xs font-bold text-[#172438] dark:text-[#F8FAFC]">No leads found</h3>
                  <p className="mt-1 text-[11px] text-[#64748B] dark:text-[#94A3B8] max-w-sm mx-auto">
                    {searchTerm || statusFilter !== 'All'
                      ? 'No records match your active search and status filter criteria.'
                      : 'No leads have been added yet. Use the Create Lead form to add your first sales lead.'}
                  </p>
                  {(searchTerm || statusFilter !== 'All') && (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="mt-2.5 inline-flex items-center rounded border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#0F172A] px-2.5 py-1 text-xs font-semibold text-[#172438] dark:text-[#F8FAFC] hover:bg-[#E9EFF8] dark:hover:bg-[#1A263D] transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              // Leads Data Rows
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#E9EFF8]/40 dark:hover:bg-[#1E293B]/60 transition-colors">
                  {/* Lead ID */}
                  <td className="px-3.5 py-2.5 font-mono font-semibold text-[#172438] dark:text-[#F8FAFC] whitespace-nowrap">
                    {lead.lead_id}
                  </td>

                  {/* Customer & Source */}
                  <td className="px-3.5 py-2.5 whitespace-nowrap">
                    <div className="font-semibold text-[#172438] dark:text-[#F8FAFC]">{lead.customer_type}</div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] capitalize">{lead.source}</div>
                  </td>

                  {/* Vehicle & Part */}
                  <td className="px-3.5 py-2.5">
                    <div className="font-semibold text-[#172438] dark:text-[#F8FAFC]">{lead.part_needed}</div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">{lead.vehicle}</div>
                  </td>

                  {/* Order Value */}
                  <td className="px-3.5 py-2.5 text-right font-mono font-bold text-[#172438] dark:text-[#F8FAFC] whitespace-nowrap">
                    {formatCurrency(lead.estimated_order_value_inr)}
                  </td>

                  {/* Priority (Single column: displays effective_priority with prominent color badge & override indicator) */}
                  <td className="px-3.5 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-block rounded px-2.5 py-0.5 text-xs font-bold border ${getPriorityBadgeClass(
                          lead.effective_priority
                        )}`}
                      >
                        {lead.effective_priority}
                      </span>
                      {lead.override_priority && (
                        <span
                          className="inline-flex items-center rounded bg-[#FFFBEB] dark:bg-[#78350F]/40 border border-[#FCD34D] dark:border-[#D97706]/50 px-1.5 py-0.2 text-[10px] text-[#D97706] dark:text-[#FBBF24] font-bold"
                          title={`Manual override applied: ${lead.override_priority}`}
                        >
                          Override
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-3.5 py-2.5 whitespace-nowrap">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold border ${getStatusBadgeClass(
                        lead.status
                      )}`}
                    >
                      {lead.status}
                    </span>
                  </td>

                  {/* Added On (IST) */}
                  <td className="px-3.5 py-2.5 whitespace-nowrap text-xs text-[#172438] dark:text-[#F8FAFC] font-mono">
                    {formatISTDateTime(lead.created_at)}
                  </td>

                  {/* Action / Manage Button */}
                  <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedLead(lead)}
                      className="inline-flex items-center gap-1 rounded border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#0F172A] px-2.5 py-1 text-xs font-semibold text-[#172438] dark:text-[#F8FAFC] hover:bg-[#E9EFF8] dark:hover:bg-[#1A263D] hover:border-[#3678D4]/40 dark:hover:border-[#60A5FA]/40 hover:text-[#3678D4] dark:hover:text-[#60A5FA] transition-all shadow-xs"
                      title="View details & manage"
                    >
                      <svg className="h-3 w-3 text-[#3678D4] dark:text-[#60A5FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Manage</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-[#DCE4EE] dark:border-[#26354D] px-4 py-2.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
        <div>
          Showing <span className="font-mono font-bold text-[#172438] dark:text-[#F8FAFC]">{startIndex}</span> to{' '}
          <span className="font-mono font-bold text-[#172438] dark:text-[#F8FAFC]">{endIndex}</span> of{' '}
          <span className="font-mono font-bold text-[#172438] dark:text-[#F8FAFC]">{total}</span> leads
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#64748B] dark:text-[#94A3B8] text-xs mr-1 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={skip === 0 || isLoading}
            className="inline-flex items-center rounded border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#0F172A] px-2.5 py-1 text-xs font-semibold text-[#172438] dark:text-[#F8FAFC] hover:bg-[#E9EFF8] dark:hover:bg-[#1A263D] hover:border-[#3678D4]/30 dark:hover:border-[#60A5FA]/30 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={skip + limit >= total || isLoading}
            className="inline-flex items-center rounded border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#0F172A] px-2.5 py-1 text-xs font-semibold text-[#172438] dark:text-[#F8FAFC] hover:bg-[#E9EFF8] dark:hover:bg-[#1A263D] hover:border-[#3678D4]/30 dark:hover:border-[#60A5FA]/30 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Lead Detail & Management Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onLeadUpdated={handleLeadUpdated}
        />
      )}
    </div>
  );
}
