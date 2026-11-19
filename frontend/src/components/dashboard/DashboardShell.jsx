import React from 'react';
import LeadCreateForm from '../leads/LeadCreateForm';
import LeadTable from '../leads/LeadTable';
import MetricsCards from './MetricsCards';
import SingleCsvImport from '../leads/SingleCsvImport';

export default function DashboardShell({ activeTab = 'dashboard', refreshTrigger, onDataChanged, onOpenCsvImport }) {
  return (
    <div className="space-y-5">
      {/* Page Header (Clean, purposeful enterprise title bar) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border gap-3 transition-colors duration-150">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-lg font-bold text-text tracking-tight">
              {activeTab === 'dashboard' && 'Commercial Lead Prioritization Workspace'}
              {activeTab === 'leads' && 'Comprehensive Leads Management Queue'}
              {activeTab === 'analytics' && 'Operational Analytics & Pipeline Insights'}
            </h1>
            <span className="hidden sm:inline-flex items-center rounded border border-border bg-surface px-2 py-0.5 text-[11px] font-mono text-text-muted">
              Commercial Sales Pipeline
            </span>
          </div>
          <p className="text-xs text-text-secondary">
            Urgency classification and priority recommendations for commercial automotive spare parts orders with sales representative override controls.
          </p>
        </div>

        {/* Action Buttons: Import CSV (Single) & Bulk Import (CSV) */}
        <div className="flex items-center gap-2 text-xs">
          <SingleCsvImport onImportSuccess={onDataChanged} />

          {onOpenCsvImport && (
            <button
              type="button"
              onClick={onOpenCsvImport}
              className="inline-flex items-center gap-1.5 rounded-md bg-accent text-accent-contrast hover:bg-accent-hover px-3 py-1.5 text-xs font-bold shadow-xs transition-all duration-150 active:scale-[0.99] focus-ring"
              aria-label="Bulk import multiple CSV files"
              title="Open Bulk CSV Import modal"
            >
              <svg className="h-3.5 w-3.5 text-accent-contrast" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Bulk Import (CSV)</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: Dashboard Overview (Metrics + Form + Table) */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5 animate-fade-in">
          {/* Live Pipeline Metrics */}
          <section aria-label="Operational Metrics">
            <MetricsCards refreshTrigger={refreshTrigger} />
          </section>

          {/* 2-Column Operational Grid: Lead Creation Form & Leads Table */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Left Column: Lead Creation Form */}
            <div className="lg:col-span-5">
              <LeadCreateForm onLeadCreated={onDataChanged} />
            </div>

            {/* Right Column: Leads Table & Prioritization Queue */}
            <div className="lg:col-span-7">
              <LeadTable
                refreshTrigger={refreshTrigger}
                onOpenCsvImport={onOpenCsvImport}
                onDataChanged={onDataChanged}
              />
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Dedicated Leads Management Queue (Full Width Table) */}
      {activeTab === 'leads' && (
        <div className="space-y-5 animate-fade-in">
          <LeadTable
            refreshTrigger={refreshTrigger}
            onOpenCsvImport={onOpenCsvImport}
            onDataChanged={onDataChanged}
          />
        </div>
      )}

      {/* VIEW 3: Dedicated Analytics & Pipeline Metrics */}
      {activeTab === 'analytics' && (
        <div className="space-y-5 animate-fade-in">
          <MetricsCards refreshTrigger={refreshTrigger} />

          {/* Operational Policy & Workflow Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-surface p-4 space-y-2.5 shadow-card hover:border-border-strong transition-all duration-150">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-text"></span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-text">
                  Priority Classification Policy
                </h2>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Customer inquiries are scored according to urgency indicators, vehicle breakdown status, critical spare part requirements, and estimated commercial order value.
              </p>
              <div className="pt-2 text-xs space-y-1.5 border-t border-border">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.2 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-500"></span>
                    High
                  </span>
                  <span className="text-text-muted text-[11px]">Critical downtime, emergency parts, fleet halts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.2 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Medium
                  </span>
                  <span className="text-text-muted text-[11px]">Standard replacements, scheduled maintenance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Low
                  </span>
                  <span className="text-text-muted text-[11px]">General price inquiries, future inventory planning</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-surface p-4 space-y-2.5 shadow-card hover:border-border-strong transition-all duration-150">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-text-muted"></span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-text">
                  Sales Override Policy
                </h2>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Sales representatives can manually adjust effective priorities to reflect strategic commercial relationships, direct phone agreements, or customer commitments.
              </p>
              <div className="pt-2 text-xs space-y-1.5 border-t border-border">
                <div className="flex items-center gap-1.5">
                  <span className="text-text font-semibold text-[11px]">Predicted Priority:</span>
                  <span className="text-text-muted text-[11px]">Initial automated recommendation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-text font-semibold text-[11px]">Manual Override:</span>
                  <span className="text-text-muted text-[11px]">Sales rep adjusted priority (or cleared)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-text font-semibold text-[11px]">Effective Priority:</span>
                  <span className="text-text-muted text-[11px]">Active operational priority in queue</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-surface p-4 space-y-2.5 shadow-card hover:border-border-strong transition-all duration-150">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-text-secondary"></span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-text">
                  Lifecycle Qualification Workflow
                </h2>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Leads progress through four operational stages to ensure timely response, quotation delivery, and commercial order fulfillment.
              </p>
              <div className="pt-2 text-xs space-y-1.5 border-t border-border">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block rounded px-1.5 py-0.2 text-[10px] font-mono border border-border text-text bg-surface-raised">New</span>
                  <span className="text-text-muted text-[11px]">Ingested inquiry awaiting first review</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block rounded px-1.5 py-0.2 text-[10px] font-mono border border-border-strong text-text-secondary bg-surface">Contacted</span>
                  <span className="text-text-muted text-[11px]">Direct outreach initiated with customer</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block rounded px-1.5 py-0.2 text-[10px] font-mono border border-text text-text bg-transparent font-medium">Qualified</span>
                  <span className="text-text-muted text-[11px]">Part specs and commercial pricing confirmed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
