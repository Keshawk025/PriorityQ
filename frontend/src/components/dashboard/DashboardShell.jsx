import React from 'react';
import LeadCreateForm from '../leads/LeadCreateForm';
import LeadTable from '../leads/LeadTable';
import MetricsCards from './MetricsCards';

export default function DashboardShell({ activeTab = 'dashboard', refreshTrigger, onDataChanged, onOpenCsvImport }) {
  return (
    <div className="space-y-5">
      {/* Page Header (Clean, purposeful enterprise title bar) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#DCE4EE] dark:border-[#26354D] gap-3 transition-colors duration-150">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-lg font-bold text-[#173B67] dark:text-[#F8FAFC] tracking-tight">
              {activeTab === 'dashboard' && 'Commercial Lead Prioritization Workspace'}
              {activeTab === 'leads' && 'Comprehensive Leads Management Queue'}
              {activeTab === 'analytics' && 'Operational Analytics & Pipeline Insights'}
            </h1>
            <span className="hidden sm:inline-flex items-center rounded border border-[#DCE4EE] dark:border-[#26354D] bg-[#E9EFF8] dark:bg-[#162032] px-2 py-0.5 text-[11px] font-semibold text-[#173B67] dark:text-[#93C5FD]">
              Commercial Sales Pipeline
            </span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            Urgency classification and priority recommendations for commercial automotive spare parts orders with sales representative override controls.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {onOpenCsvImport && (
            <button
              type="button"
              onClick={onOpenCsvImport}
              className="inline-flex items-center gap-1.5 rounded bg-[#3678D4] hover:bg-[#2A62B6] text-white px-3 py-1.5 text-xs font-semibold shadow-btn transition-all duration-150 active:scale-[0.99] focus-ring"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <LeadTable refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Dedicated Leads Management Queue (Full Width Table) */}
      {activeTab === 'leads' && (
        <div className="space-y-5 animate-fade-in">
          <LeadTable refreshTrigger={refreshTrigger} />
        </div>
      )}

      {/* VIEW 3: Dedicated Analytics & Pipeline Metrics */}
      {activeTab === 'analytics' && (
        <div className="space-y-5 animate-fade-in">
          <MetricsCards refreshTrigger={refreshTrigger} />

          {/* Operational Policy & Workflow Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-4 space-y-2.5 shadow-card dark:shadow-card-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-150">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#3678D4]"></span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-[#F8FAFC]">Priority Classification Policy</h2>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Customer inquiries are scored according to urgency indicators, vehicle breakdown status, critical spare part requirements, and estimated commercial order value.
              </p>
              <div className="pt-2 text-xs space-y-1.5 border-t border-[#DCE4EE] dark:border-[#26354D]">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block rounded px-1.5 py-0.2 text-[10px] font-bold text-[#DC2626] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 border border-[#FCA5A5] dark:border-[#DC2626]/50">High</span>
                  <span className="text-[#64748B] dark:text-[#94A3B8] text-[11px]">Critical downtime, emergency parts, fleet halts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block rounded px-1.5 py-0.2 text-[10px] font-bold text-[#D97706] dark:text-[#FBBF24] bg-[#FFFBEB] dark:bg-[#78350F]/30 border border-[#FCD34D] dark:border-[#D97706]/50">Medium</span>
                  <span className="text-[#64748B] dark:text-[#94A3B8] text-[11px]">Standard replacements, scheduled maintenance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block rounded px-1.5 py-0.2 text-[10px] font-bold text-[#059669] dark:text-[#34D399] bg-[#ECFDF5] dark:bg-[#064E3B]/30 border border-[#6EE7B7] dark:border-[#059669]/50">Low</span>
                  <span className="text-[#64748B] dark:text-[#94A3B8] text-[11px]">General price inquiries, future inventory planning</span>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-4 space-y-2.5 shadow-card dark:shadow-card-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-150">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#D97706]"></span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-[#F8FAFC]">Sales Representative Override Policy</h2>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Sales representatives can manually adjust effective priorities to reflect strategic commercial relationships, direct phone agreements, or customer commitments.
              </p>
              <div className="pt-2 text-xs space-y-1.5 border-t border-[#DCE4EE] dark:border-[#26354D]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#172438] dark:text-[#F8FAFC] font-semibold text-[11px]">Predicted Priority:</span>
                  <span className="text-[#64748B] dark:text-[#94A3B8] text-[11px]">Initial automated recommendation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#172438] dark:text-[#F8FAFC] font-semibold text-[11px]">Manual Override:</span>
                  <span className="text-[#64748B] dark:text-[#94A3B8] text-[11px]">Sales rep adjusted priority (or cleared)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#172438] dark:text-[#F8FAFC] font-semibold text-[11px]">Effective Priority:</span>
                  <span className="text-[#64748B] dark:text-[#94A3B8] text-[11px]">Active operational priority in queue</span>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-4 space-y-2.5 shadow-card dark:shadow-card-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-150">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#059669]"></span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-[#F8FAFC]">Lifecycle Qualification Workflow</h2>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Leads progress through four operational stages to ensure timely response, quotation delivery, and commercial order fulfillment.
              </p>
              <div className="pt-2 text-xs space-y-1.5 border-t border-[#DCE4EE] dark:border-[#26354D]">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block rounded px-1.5 py-0.2 text-[10px] font-semibold text-[#173B67] dark:text-[#93C5FD] bg-[#E9EFF8] dark:bg-[#1E3A8A]/30 border border-[#DCE4EE] dark:border-[#3B82F6]/40">New</span>
                  <span className="text-[#64748B] dark:text-[#94A3B8] text-[11px]">Ingested inquiry awaiting first review</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block rounded px-1.5 py-0.2 text-[10px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50">Contacted</span>
                  <span className="text-[#64748B] dark:text-[#94A3B8] text-[11px]">Direct outreach initiated with customer</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block rounded px-1.5 py-0.2 text-[10px] font-semibold text-[#059669] dark:text-[#34D399] bg-[#ECFDF5] dark:bg-[#064E3B]/30 border border-[#6EE7B7] dark:border-[#059669]/50">Qualified</span>
                  <span className="text-[#64748B] dark:text-[#94A3B8] text-[11px]">Part specs and commercial pricing confirmed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
