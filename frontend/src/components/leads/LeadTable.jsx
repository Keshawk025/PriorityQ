import React, { useState, useEffect, useCallback } from 'react';
import { fetchLeadsApi, clearAllLeadsApi, formatISTDateTime } from '../../services/leadApi';
import LeadDetailModal from './LeadDetailModal';
import SingleCsvImport from './SingleCsvImport';

const STATUS_OPTIONS = ['All', 'New', 'Contacted', 'Qualified', 'Closed'];
const PAGE_SIZE_OPTIONS = [10, 25, 50];

export default function LeadTable({ refreshTrigger, onOpenCsvImport, onDataChanged }) {
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
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleClearAll = async () => {
    setIsClearing(true);
    setError(null);
    try {
      await clearAllLeadsApi();
      setShowClearConfirm(false);
      setSkip(0);
      loadLeads(0, limit, searchTerm, statusFilter, sortOrder);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      setError('Failed to clear database: ' + (err.message || 'Unknown error'));
    } finally {
      setIsClearing(false);
    }
  };

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

  const handleTogglePrioritySort = () => {
    // If not currently sorting by priority, default to High to Low (highest urgency first)
    // If already priority_desc, switch to priority_asc (Low to High), and vice versa
    const nextSort = sortOrder === 'priority_desc' ? 'priority_asc' : 'priority_desc';
    setSortOrder(nextSort);
    setSkip(0);
  };

  const handleToggleDateSort = () => {
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
    if (onDataChanged) onDataChanged();
  };

  const handleImportSuccess = () => {
    loadLeads(skip, limit, searchTerm, statusFilter, sortOrder);
    if (onDataChanged) onDataChanged();
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

  return (
    <div className="rounded-lg border border-border bg-surface flex flex-col shadow-card hover:border-border-strong transition-all duration-150">
      {/* Table Header & Controls */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-text tracking-tight">Lead Prioritization Queue</h2>
              <span className="rounded border border-border bg-surface-raised px-2 py-0.5 text-[11px] font-mono font-medium text-text-secondary">
                {total} {total === 1 ? 'lead' : 'leads'}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Active sales leads with automated priority scoring and lifecycle management
            </p>
          </div>

          {/* Action Toolbar: Import CSV, Bulk Import & Refresh */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* Import CSV (Single File) */}
            <SingleCsvImport onImportSuccess={handleImportSuccess} />

            {/* Bulk Import (CSV) Button */}
            {onOpenCsvImport && (
              <button
                type="button"
                onClick={onOpenCsvImport}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-surface-hover hover:border-border-strong px-2.5 py-1.5 text-xs font-semibold text-text focus-ring transition-colors"
                aria-label="Bulk import multiple CSV files"
                title="Open Bulk CSV Import modal"
              >
                <svg className="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Bulk Import</span>
              </button>
            )}

            {/* Quick Refresh Button */}
            <button
              type="button"
              onClick={() => loadLeads(skip, limit, searchTerm, statusFilter, sortOrder)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-text hover:bg-surface-hover hover:border-border-strong focus-ring disabled:opacity-50 transition-colors"
              aria-label="Refresh lead table"
              title="Refresh lead table"
            >
              <svg
                className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-text' : 'text-text-muted'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>

            {/* Clear Database Pipeline Button */}
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-500 px-2.5 py-1.5 text-xs font-semibold text-text-muted focus-ring transition-colors"
              title="Clear all leads from database pipeline"
              aria-label="Clear all leads from database pipeline"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Clear Pipeline</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-0.5">
          {/* Search Input Form */}
          <form onSubmit={handleSearchSubmit} className="sm:col-span-4 relative">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                <svg className="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ID, customer, vehicle, part..."
                className="block w-full rounded-md border border-input-border bg-input-bg pl-8 pr-14 py-1.5 text-xs text-text placeholder-text-muted focus:border-input-focus focus:outline-none focus:ring-1 focus:ring-input-focus transition-colors"
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
                    className="p-1 text-text-muted hover:text-text rounded"
                    title="Clear search"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  className="rounded bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-contrast hover:bg-accent-hover transition-colors"
                >
                  Go
                </button>
              </div>
            </div>
          </form>

          {/* Status Filter Dropdown */}
          <div className="sm:col-span-2">
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="block w-full rounded-md border border-input-border py-1.5 px-2 text-xs text-text bg-input-bg focus:border-input-focus focus:outline-none focus:ring-1 focus:ring-input-focus transition-colors"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status === 'All' ? 'All Statuses' : status}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order Selector: Priority (High/Medium/Low) & Creation Date */}
          <div className="sm:col-span-4">
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="block w-full rounded-md border border-input-border py-1.5 px-2 text-xs text-text bg-input-bg focus:border-input-focus focus:outline-none focus:ring-1 focus:ring-input-focus transition-colors"
              title="Sort leads by priority (High/Medium/Low) or creation time"
              aria-label="Sort leads by priority or creation time"
            >
              <option value="newest">Added On: Newest First</option>
              <option value="oldest">Added On: Oldest First</option>
              <option value="priority_desc">Priority: High → Medium → Low</option>
              <option value="priority_asc">Priority: Low → Medium → High</option>
            </select>
          </div>

          {/* Page Size Selector */}
          <div className="sm:col-span-2">
            <select
              value={limit}
              onChange={handleLimitChange}
              className="block w-full rounded-md border border-input-border py-1.5 px-2.5 text-xs text-text bg-input-bg focus:border-input-focus focus:outline-none focus:ring-1 focus:ring-input-focus transition-colors"
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
        <div className="m-3 rounded-md border border-border-strong bg-surface-raised p-3 text-xs text-text">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">✕</span>
              <span className="font-medium">{error}</span>
            </div>
            <button
              type="button"
              onClick={() => loadLeads(skip, limit, searchTerm, statusFilter, sortOrder)}
              className="font-bold underline text-text hover:text-text-secondary focus-ring"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Compact CRM Table */}
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-border text-left text-xs">
          <thead className="bg-surface-raised text-text-muted font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th scope="col" className="px-3.5 py-2.5 w-28">Lead ID</th>
              <th scope="col" className="px-3.5 py-2.5 w-40">Customer &amp; Channel</th>
              <th scope="col" className="px-3.5 py-2.5">Vehicle &amp; Part</th>
              <th scope="col" className="px-3.5 py-2.5 text-right w-28">Order Value</th>
              <th scope="col" className="px-3.5 py-2.5 w-32">
                <button
                  type="button"
                  onClick={handleTogglePrioritySort}
                  className="group inline-flex items-center gap-1 font-bold uppercase tracking-wider text-[10px] focus:outline-none transition-colors hover:text-text"
                  title={
                    sortOrder === 'priority_desc'
                      ? 'Sorted: High (Red) → Medium (Amber) → Low (Green). Click for Low → High.'
                      : sortOrder === 'priority_asc'
                      ? 'Sorted: Low (Green) → Medium (Amber) → High (Red). Click for High → Low.'
                      : 'Click to sort by priority: High (Red) → Medium (Amber) → Low (Green)'
                  }
                  aria-label="Sort by Priority level"
                >
                  <span className={sortOrder.startsWith('priority') ? 'text-text font-black' : 'text-text-muted'}>
                    Priority
                  </span>
                  <span className="font-mono text-xs">
                    {sortOrder === 'priority_desc' ? (
                      <span className="text-red-500 font-bold" title="High to Low">↓</span>
                    ) : sortOrder === 'priority_asc' ? (
                      <span className="text-emerald-500 font-bold" title="Low to High">↑</span>
                    ) : (
                      <span className="text-text-muted opacity-40 group-hover:opacity-100">↕</span>
                    )}
                  </span>
                </button>
              </th>
              <th scope="col" className="px-3.5 py-2.5 w-24">Status</th>
              <th scope="col" className="px-3.5 py-2.5 w-44">
                <button
                  type="button"
                  onClick={handleToggleDateSort}
                  className="group inline-flex items-center gap-1 font-bold uppercase tracking-wider text-[10px] focus:outline-none transition-colors hover:text-text"
                  title={`Sorted by ${sortOrder === 'newest' ? 'newest first' : sortOrder === 'oldest' ? 'oldest first' : 'custom'}. Click to toggle date sort.`}
                  aria-label="Sort by Added On date"
                >
                  <span className={sortOrder === 'newest' || sortOrder === 'oldest' ? 'text-text font-black' : 'text-text-muted'}>
                    Added On (IST)
                  </span>
                  <span className="font-mono text-xs text-text">
                    {sortOrder === 'newest' ? (
                      '↓'
                    ) : sortOrder === 'oldest' ? (
                      '↑'
                    ) : (
                      <span className="text-text-muted opacity-40 group-hover:opacity-100">↕</span>
                    )}
                  </span>
                </button>
              </th>
              <th scope="col" className="px-3.5 py-2.5 text-center w-24">Manage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {isLoading ? (
              // Skeleton loading rows
              Array.from({ length: Math.min(5, limit) }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="animate-pulse">
                  <td className="px-3.5 py-2.5"><div className="h-3 w-16 bg-surface-raised rounded"></div></td>
                  <td className="px-3.5 py-2.5"><div className="h-3 w-24 bg-surface-raised rounded"></div></td>
                  <td className="px-3.5 py-2.5"><div className="h-3 w-36 bg-surface-raised rounded"></div></td>
                  <td className="px-3.5 py-2.5 text-right"><div className="h-3 w-16 bg-surface-raised rounded ml-auto"></div></td>
                  <td className="px-3.5 py-2.5"><div className="h-3.5 w-16 bg-surface-raised rounded"></div></td>
                  <td className="px-3.5 py-2.5"><div className="h-3.5 w-14 bg-surface-raised rounded"></div></td>
                  <td className="px-3.5 py-2.5"><div className="h-3 w-28 bg-surface-raised rounded"></div></td>
                  <td className="px-3.5 py-2.5 text-center"><div className="h-3.5 w-12 bg-surface-raised rounded mx-auto"></div></td>
                </tr>
              ))
            ) : leads.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={8} className="px-3 py-10 text-center text-text-muted">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded border border-border bg-surface-raised">
                    <svg className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="mt-2.5 text-xs font-bold text-text">No leads found</h3>
                  <p className="mt-1 text-[11px] text-text-muted max-w-sm mx-auto">
                    {searchTerm || statusFilter !== 'All'
                      ? 'No records match your active search and status filter criteria.'
                      : 'No leads have been added yet. Use the Create Lead form or import CSV to add sales leads.'}
                  </p>
                  {(searchTerm || statusFilter !== 'All') && (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="mt-2.5 inline-flex items-center rounded border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-text hover:bg-surface-hover transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              // Leads Data Rows
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-surface-hover transition-colors">
                  {/* Lead ID */}
                  <td className="px-3.5 py-2.5 font-mono font-semibold text-text whitespace-nowrap">
                    {lead.lead_id}
                  </td>

                  {/* Customer & Source */}
                  <td className="px-3.5 py-2.5 whitespace-nowrap">
                    <div className="font-semibold text-text">{lead.customer_type}</div>
                    <div className="text-[11px] text-text-secondary capitalize">{lead.source}</div>
                  </td>

                  {/* Vehicle & Part */}
                  <td className="px-3.5 py-2.5">
                    <div className="font-semibold text-text">{lead.part_needed}</div>
                    <div className="text-[11px] text-text-secondary">{lead.vehicle}</div>
                  </td>

                  {/* Order Value */}
                  <td className="px-3.5 py-2.5 text-right font-mono font-bold text-text whitespace-nowrap">
                    {formatCurrency(lead.estimated_order_value_inr)}
                  </td>

                  {/* Priority (Monochrome badge with symbol) */}
                  <td className="px-3.5 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {renderPriorityBadge(lead.effective_priority)}
                      {lead.override_priority && (
                        <span
                          className="inline-flex items-center rounded border border-border-strong bg-surface-raised px-1.5 py-0.5 text-[10px] text-text-muted font-mono"
                          title={`Manual override applied: ${lead.override_priority}`}
                        >
                          Manual
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-3.5 py-2.5 whitespace-nowrap">
                    {renderStatusBadge(lead.status)}
                  </td>

                  {/* Added On (IST) */}
                  <td className="px-3.5 py-2.5 whitespace-nowrap text-xs text-text-secondary font-mono">
                    {formatISTDateTime(lead.created_at)}
                  </td>

                  {/* Action / Manage Button */}
                  <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedLead(lead)}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-text hover:bg-surface-hover hover:border-border-strong transition-all focus-ring"
                      title="View details & manage"
                    >
                      <svg className="h-3 w-3 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-border px-4 py-2.5 text-xs text-text-secondary">
        <div>
          Showing <span className="font-mono font-bold text-text">{startIndex}</span> to{' '}
          <span className="font-mono font-bold text-text">{endIndex}</span> of{' '}
          <span className="font-mono font-bold text-text">{total}</span> leads
        </div>

        <div className="flex items-center gap-2">
          <span className="text-text-muted text-xs mr-1 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={skip === 0 || isLoading}
            className="inline-flex items-center rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-text hover:bg-surface-hover hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-40 transition-colors focus-ring"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={skip + limit >= total || isLoading}
            className="inline-flex items-center rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-text hover:bg-surface-hover hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-40 transition-colors focus-ring"
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

      {/* Clear Database Pipeline Confirmation Modal */}
      {showClearConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-pipeline-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in"
        >
          <div
            className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-2xl space-y-4 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 id="clear-pipeline-dialog-title" className="text-sm font-bold text-text">
                  Clear Database Pipeline?
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Permanent action
                </p>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Are you sure you want to clear the entire lead pipeline? This will permanently delete all leads and reset your dashboard metrics to zero.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                disabled={isClearing}
                className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text hover:bg-surface-hover hover:border-border-strong disabled:opacity-50 transition-colors focus-ring"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                disabled={isClearing}
                className="inline-flex items-center gap-1.5 rounded-md bg-red-600 hover:bg-red-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs focus-ring disabled:opacity-50 transition-colors"
              >
                {isClearing ? (
                  <>
                    <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Clearing...</span>
                  </>
                ) : (
                  <span>Yes, Clear Database</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}