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
          <div key={i} className="rounded-lg border border-border bg-surface p-4 shadow-card animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-surface-raised rounded"></div>
              <div className="h-4 w-12 bg-surface-raised rounded"></div>
            </div>
            <div className="mt-3">
              <div className="h-6 w-16 bg-surface-raised rounded"></div>
              <div className="mt-1.5 h-2.5 w-28 bg-surface-raised rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && !metrics) {
    return (
      <div className="rounded-lg border border-border-strong bg-surface-raised p-3.5 text-xs text-text flex items-center justify-between shadow-card">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">!</span>
          <span className="font-medium">Unable to load pipeline metrics. Please retry.</span>
        </div>
        <button
          type="button"
          onClick={loadMetrics}
          className="font-semibold text-text underline hover:text-text-secondary focus-ring"
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
      badgeNode: (
        <span className="inline-flex items-center rounded border border-border bg-surface-raised px-1.5 py-0.5 text-[10px] font-mono text-text-secondary">
          All Tiers
        </span>
      ),
    },
    {
      title: 'High Priority',
      value: highCount,
      caption: total > 0 ? `${highPct}% of total lead volume` : '0% of total',
      valueColor: 'text-red-600 dark:text-red-400',
      badgeNode: (
        <span className="inline-flex items-center gap-1 rounded bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/60 px-1.5 py-0.5 text-[10px] font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-500"></span>
          <span>High (P1)</span>
        </span>
      ),
    },
    {
      title: 'Medium Priority',
      value: mediumCount,
      caption: total > 0 ? `${mediumPct}% of total lead volume` : '0% of total',
      valueColor: 'text-amber-600 dark:text-amber-400',
      badgeNode: (
        <span className="inline-flex items-center gap-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 px-1.5 py-0.5 text-[10px] font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
          <span>Medium (P2)</span>
        </span>
      ),
    },
    {
      title: 'Low Priority',
      value: lowCount,
      caption: total > 0 ? `${lowPct}% of total lead volume` : '0% of total',
      valueColor: 'text-emerald-600 dark:text-emerald-400',
      badgeNode: (
        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 px-1.5 py-0.5 text-[10px] font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span>Low (P3)</span>
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* 4 Summary Cards with Red / Yellow / Green Priority Highlights */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.title}
            className="rounded-lg border border-border bg-surface p-4 shadow-card hover:border-border-strong transition-all duration-150"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                {c.title}
              </span>
              {c.badgeNode}
            </div>
            <div className="mt-2.5">
              <div className={`text-2xl font-bold font-mono tracking-tight ${c.valueColor || 'text-text'}`}>
                {c.value}
              </div>
              <p className="mt-0.5 text-[11px] text-text-secondary font-medium">{c.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Priority Distribution Chart */}
        <div className="rounded-lg border border-border bg-surface p-4 shadow-card hover:border-border-strong transition-all duration-150">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
              <span className="text-xs font-bold text-text uppercase tracking-wider">
                Priority Distribution
              </span>
            </div>
            <span className="text-xs font-mono font-semibold text-text-secondary bg-surface-raised border border-border px-2 py-0.5 rounded">
              {total} {total === 1 ? 'Lead' : 'Leads'} Total
            </span>
          </div>

          {/* Segmented Progress Bar: Red (High), Amber/Yellow (Medium), Emerald/Green (Low) */}
          <div className="h-2.5 w-full bg-surface-raised rounded-full overflow-hidden flex border border-border">
            {total > 0 ? (
              <>
                <div
                  style={{ width: `${(highCount / total) * 100}%` }}
                  className="bg-red-500 transition-all duration-500"
                  title={`High Priority: ${highCount} (${highPct}%)`}
                />
                <div
                  style={{ width: `${(mediumCount / total) * 100}%` }}
                  className="bg-amber-400 transition-all duration-500"
                  title={`Medium Priority: ${mediumCount} (${mediumPct}%)`}
                />
                <div
                  style={{ width: `${(lowCount / total) * 100}%` }}
                  className="bg-emerald-500 transition-all duration-500"
                  title={`Low Priority: ${lowCount} (${lowPct}%)`}
                />
              </>
            ) : (
              <div className="w-full bg-surface-raised" />
            )}
          </div>

          {/* Red, Yellow, Green Priority Legend Chips */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center justify-between rounded border border-red-200 dark:border-red-800/60 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 text-red-700 dark:text-red-400">
              <span className="font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-500"></span>
                High
              </span>
              <span className="font-mono font-bold">
                {highCount} <span className="text-[10px] opacity-80">({highPct}%)</span>
              </span>
            </div>

            <div className="flex items-center justify-between rounded border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 text-amber-700 dark:text-amber-400">
              <span className="font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                Medium
              </span>
              <span className="font-mono font-bold">
                {mediumCount} <span className="text-[10px] opacity-80">({mediumPct}%)</span>
              </span>
            </div>

            <div className="flex items-center justify-between rounded border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-emerald-700 dark:text-emerald-400">
              <span className="font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Low
              </span>
              <span className="font-mono font-bold">
                {lowCount} <span className="text-[10px] opacity-80">({lowPct}%)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Lifecycle Status Funnel */}
        <div className="rounded-lg border border-border bg-surface p-4 shadow-card hover:border-border-strong transition-all duration-150">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-text-muted"></span>
              <span className="text-xs font-bold text-text uppercase tracking-wider">
                Lead Lifecycle Pipeline
              </span>
            </div>
            <span className="text-xs text-text-muted font-medium">Sales Funnel</span>
          </div>

          {/* Segmented Status Bar: Monochrome progression */}
          <div className="h-2.5 w-full bg-surface-raised rounded-full overflow-hidden flex border border-border">
            {total > 0 ? (
              <>
                <div
                  style={{ width: `${((statusCounts.New || 0) / total) * 100}%` }}
                  className="bg-text transition-all duration-500"
                  title={`New: ${statusCounts.New || 0}`}
                />
                <div
                  style={{ width: `${((statusCounts.Contacted || 0) / total) * 100}%` }}
                  className="bg-neutral-300 dark:bg-neutral-400 transition-all duration-500"
                  title={`Contacted: ${statusCounts.Contacted || 0}`}
                />
                <div
                  style={{ width: `${((statusCounts.Qualified || 0) / total) * 100}%` }}
                  className="bg-neutral-400 dark:bg-neutral-600 transition-all duration-500"
                  title={`Qualified: ${statusCounts.Qualified || 0}`}
                />
                <div
                  style={{ width: `${((statusCounts.Closed || 0) / total) * 100}%` }}
                  className="bg-neutral-200 dark:bg-neutral-800 transition-all duration-500"
                  title={`Closed: ${statusCounts.Closed || 0}`}
                />
              </>
            ) : (
              <div className="w-full bg-surface-raised" />
            )}
          </div>

          {/* Status Breakdown Chips */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center justify-between rounded border border-border bg-surface-raised px-2 py-1 text-text">
              <span className="flex items-center gap-1 font-medium text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-text"></span>
                New
              </span>
              <span className="font-mono font-bold">{statusCounts.New || 0}</span>
            </div>
            <div className="flex items-center justify-between rounded border border-border bg-surface px-2 py-1 text-text-secondary">
              <span className="flex items-center gap-1 font-medium text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-400"></span>
                Contacted
              </span>
              <span className="font-mono font-bold">{statusCounts.Contacted || 0}</span>
            </div>
            <div className="flex items-center justify-between rounded border border-border bg-surface px-2 py-1 text-text">
              <span className="flex items-center gap-1 font-medium text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-500"></span>
                Qualified
              </span>
              <span className="font-mono font-bold">{statusCounts.Qualified || 0}</span>
            </div>
            <div className="flex items-center justify-between rounded border border-border bg-surface px-2 py-1 text-text-muted">
              <span className="flex items-center gap-1 font-medium text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-700"></span>
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