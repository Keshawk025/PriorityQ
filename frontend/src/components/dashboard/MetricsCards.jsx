import React, { useState, useEffect, useCallback } from 'react';
import { fetchMetricsApi } from '../../services/leadApi';

export default function MetricsCards({ refreshTrigger }) {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchMetricsApi();
      setMetrics(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch live metrics.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics, refreshTrigger]);

  if (isLoading && !metrics) {
    return (
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-4 shadow-card dark:shadow-card-dark">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-[#E9EFF8] dark:bg-[#1E293B] rounded animate-pulse"></div>
              <div className="h-4 w-4 bg-[#E9EFF8] dark:bg-[#1E293B] rounded animate-pulse"></div>
            </div>
            <div className="mt-3">
              <div className="h-6 w-12 bg-[#E9EFF8] dark:bg-[#1E293B] rounded animate-pulse"></div>
              <div className="mt-1.5 h-2.5 w-24 bg-[#E9EFF8] dark:bg-[#1E293B] rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && !metrics) {
    return (
      <div className="rounded-md border border-[#FCA5A5] dark:border-red-800/60 bg-[#FEF2F2] dark:bg-red-950/40 p-3.5 text-xs text-[#DC2626] dark:text-red-400 flex items-center justify-between shadow-card">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 shrink-0 text-[#DC2626] dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">Unable to load pipeline metrics. Please retry.</span>
        </div>
        <button
          type="button"
          onClick={loadMetrics}
          className="font-semibold text-[#DC2626] dark:text-red-400 underline hover:text-red-900 dark:hover:text-red-300 focus-ring"
        >
          Retry
        </button>
      </div>
    );
  }

  const total = metrics?.total_leads || 0;
  const statusCounts = metrics?.status_counts || { New: 0, Contacted: 0, Qualified: 0, Closed: 0 };
  const priorityCounts = metrics?.predicted_priority_counts || { High: 0, Medium: 0, Low: 0 };

  const highCount = priorityCounts.High || 0;
  const mediumCount = priorityCounts.Medium || 0;
  const lowCount = priorityCounts.Low || 0;

  const highPct = total > 0 ? Math.round((highCount / total) * 100) : 0;
  const mediumPct = total > 0 ? Math.round((mediumCount / total) * 100) : 0;
  const lowPct = total > 0 ? Math.round((lowCount / total) * 100) : 0;

  const cards = [
    {
      title: 'Total Pipeline Leads',
      value: total,
      caption: total === 1 ? '1 active lead in pipeline' : `${total} active leads in pipeline`,
      accentBorder: 'border-l-4 border-l-[#173B67] dark:border-l-[#3678D4]',
      badgeClass: 'text-[#173B67] dark:text-[#93C5FD] bg-[#E9EFF8] dark:bg-[#1E3A8A]/30 border-[#DCE4EE] dark:border-[#3B82F6]/40',
      dotClass: 'bg-[#173B67] dark:bg-[#3678D4]',
      valueColor: 'text-[#173B67] dark:text-[#F8FAFC]',
      badgeText: 'All Tiers',
    },
    {
      title: 'High Priority',
      value: highCount,
      caption: total > 0 ? `${highPct}% of total lead volume` : '0% of total',
      accentBorder: 'border-l-4 border-l-[#DC2626] dark:border-l-[#F87171]',
      badgeClass: 'text-[#DC2626] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 border-[#FCA5A5] dark:border-[#DC2626]/50',
      dotClass: 'bg-[#DC2626] dark:bg-[#F87171]',
      valueColor: 'text-[#DC2626] dark:text-[#F87171]',
      badgeText: 'High (P1)',
    },
    {
      title: 'Medium Priority',
      value: mediumCount,
      caption: total > 0 ? `${mediumPct}% of total lead volume` : '0% of total',
      accentBorder: 'border-l-4 border-l-[#D97706] dark:border-l-[#FBBF24]',
      badgeClass: 'text-[#D97706] dark:text-[#FBBF24] bg-[#FFFBEB] dark:bg-[#78350F]/30 border-[#FCD34D] dark:border-[#D97706]/50',
      dotClass: 'bg-[#D97706] dark:bg-[#FBBF24]',
      valueColor: 'text-[#D97706] dark:text-[#FBBF24]',
      badgeText: 'Medium (P2)',
    },
    {
      title: 'Low Priority',
      value: lowCount,
      caption: total > 0 ? `${lowPct}% of total lead volume` : '0% of total',
      accentBorder: 'border-l-4 border-l-[#059669] dark:border-l-[#34D399]',
      badgeClass: 'text-[#059669] dark:text-[#34D399] bg-[#ECFDF5] dark:bg-[#064E3B]/30 border-[#6EE7B7] dark:border-[#059669]/50',
      dotClass: 'bg-[#059669] dark:bg-[#34D399]',
      valueColor: 'text-[#059669] dark:text-[#34D399]',
      badgeText: 'Low (P3)',
    },
  ];

  return (
    <div className="space-y-4">
      {/* 4 Visually Distinct Summary Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.title}
            className={`rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-4 shadow-card dark:shadow-card-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-150 ${c.accentBorder}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                {c.title}
              </span>
              <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-bold ${c.badgeClass}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${c.dotClass}`}></span>
                {c.badgeText}
              </span>
            </div>
            <div className="mt-2.5">
              <div className={`text-2xl font-bold font-mono tracking-tight ${c.valueColor}`}>
                {c.value}
              </div>
              <p className="mt-0.5 text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium">{c.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Priority Distribution Chart */}
        <div className="rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-4 shadow-card dark:shadow-card-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-150">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#3678D4]"></span>
              <span className="text-xs font-bold text-[#173B67] dark:text-[#F8FAFC] uppercase tracking-wider">
                Priority Distribution
              </span>
            </div>
            <span className="text-xs font-mono font-semibold text-[#173B67] dark:text-[#93C5FD] bg-[#E9EFF8] dark:bg-[#1E3A8A]/30 border border-[#DCE4EE] dark:border-[#3B82F6]/40 px-2 py-0.5 rounded">
              {total} {total === 1 ? 'Lead' : 'Leads'} Total
            </span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="h-2.5 w-full bg-[#E9EFF8] dark:bg-[#0F172A] rounded-full overflow-hidden flex shadow-inner">
            {total > 0 ? (
              <>
                <div
                  style={{ width: `${(highCount / total) * 100}%` }}
                  className="bg-[#DC2626] dark:bg-[#EF4444] transition-all duration-500"
                  title={`High Priority: ${highCount} (${highPct}%)`}
                />
                <div
                  style={{ width: `${(mediumCount / total) * 100}%` }}
                  className="bg-[#D97706] dark:bg-[#F59E0B] transition-all duration-500"
                  title={`Medium Priority: ${mediumCount} (${mediumPct}%)`}
                />
                <div
                  style={{ width: `${(lowCount / total) * 100}%` }}
                  className="bg-[#059669] dark:bg-[#10B981] transition-all duration-500"
                  title={`Low Priority: ${lowCount} (${lowPct}%)`}
                />
              </>
            ) : (
              <div className="w-full bg-[#DCE4EE] dark:bg-[#26354D]" />
            )}
          </div>

          {/* Prominent Priority Legend Chips */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center justify-between rounded border border-[#FCA5A5] dark:border-[#DC2626]/50 bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 px-2.5 py-1 text-[#DC2626] dark:text-[#F87171]">
              <span className="font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#DC2626] dark:bg-[#F87171]"></span>
                High
              </span>
              <span className="font-mono font-bold">
                {highCount} <span className="text-[10px] opacity-80">({highPct}%)</span>
              </span>
            </div>

            <div className="flex items-center justify-between rounded border border-[#FCD34D] dark:border-[#D97706]/50 bg-[#FFFBEB] dark:bg-[#78350F]/30 px-2.5 py-1 text-[#D97706] dark:text-[#FBBF24]">
              <span className="font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D97706] dark:bg-[#FBBF24]"></span>
                Medium
              </span>
              <span className="font-mono font-bold">
                {mediumCount} <span className="text-[10px] opacity-80">({mediumPct}%)</span>
              </span>
            </div>

            <div className="flex items-center justify-between rounded border border-[#6EE7B7] dark:border-[#059669]/50 bg-[#ECFDF5] dark:bg-[#064E3B]/30 px-2.5 py-1 text-[#059669] dark:text-[#34D399]">
              <span className="font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#059669] dark:bg-[#34D399]"></span>
                Low
              </span>
              <span className="font-mono font-bold">
                {lowCount} <span className="text-[10px] opacity-80">({lowPct}%)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Lifecycle Status Funnel */}
        <div className="rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-4 shadow-card dark:shadow-card-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-150">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#173B67] dark:bg-[#3678D4]"></span>
              <span className="text-xs font-bold text-[#173B67] dark:text-[#F8FAFC] uppercase tracking-wider">
                Lead Lifecycle Pipeline
              </span>
            </div>
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">Sales Funnel</span>
          </div>

          {/* Segmented Status Bar */}
          <div className="h-2.5 w-full bg-[#E9EFF8] dark:bg-[#0F172A] rounded-full overflow-hidden flex shadow-inner">
            {total > 0 ? (
              <>
                <div
                  style={{ width: `${((statusCounts.New || 0) / total) * 100}%` }}
                  className="bg-[#173B67] dark:bg-[#3678D4] transition-all duration-500"
                  title={`New: ${statusCounts.New || 0}`}
                />
                <div
                  style={{ width: `${((statusCounts.Contacted || 0) / total) * 100}%` }}
                  className="bg-[#7C3AED] dark:bg-[#A855F7] transition-all duration-500"
                  title={`Contacted: ${statusCounts.Contacted || 0}`}
                />
                <div
                  style={{ width: `${((statusCounts.Qualified || 0) / total) * 100}%` }}
                  className="bg-[#059669] dark:bg-[#10B981] transition-all duration-500"
                  title={`Qualified: ${statusCounts.Qualified || 0}`}
                />
                <div
                  style={{ width: `${((statusCounts.Closed || 0) / total) * 100}%` }}
                  className="bg-[#94A3B8] dark:bg-[#64748B] transition-all duration-500"
                  title={`Closed: ${statusCounts.Closed || 0}`}
                />
              </>
            ) : (
              <div className="w-full bg-[#DCE4EE] dark:bg-[#26354D]" />
            )}
          </div>

          {/* Status Breakdown Chips */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center justify-between rounded border border-[#DCE4EE] dark:border-[#3B82F6]/40 bg-[#E9EFF8]/60 dark:bg-[#1E3A8A]/30 px-2 py-1 text-[#172438] dark:text-[#93C5FD]">
              <span className="flex items-center gap-1 font-medium text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#173B67] dark:bg-[#3678D4]"></span>
                New
              </span>
              <span className="font-mono font-bold">{statusCounts.New || 0}</span>
            </div>
            <div className="flex items-center justify-between rounded border border-purple-200 dark:border-purple-800/50 bg-purple-50 dark:bg-purple-950/40 px-2 py-1 text-purple-900 dark:text-purple-300">
              <span className="flex items-center gap-1 font-medium text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED] dark:bg-[#A855F7]"></span>
                Contacted
              </span>
              <span className="font-mono font-bold">{statusCounts.Contacted || 0}</span>
            </div>
            <div className="flex items-center justify-between rounded border border-[#6EE7B7] dark:border-[#059669]/50 bg-[#ECFDF5] dark:bg-[#064E3B]/30 px-2 py-1 text-[#059669] dark:text-[#34D399]">
              <span className="flex items-center gap-1 font-medium text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#059669] dark:bg-[#34D399]"></span>
                Qualified
              </span>
              <span className="font-mono font-bold">{statusCounts.Qualified || 0}</span>
            </div>
            <div className="flex items-center justify-between rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1 font-medium text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#94A3B8] dark:bg-[#64748B]"></span>
                Closed
              </span>
              <span className="font-mono font-bold">{statusCounts.Closed || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
