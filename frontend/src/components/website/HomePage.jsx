import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import StickyMobileCta from './StickyMobileCta';

export default function HomePage({ onNavigate }) {
  const sampleLeads = [
    {
      id: 'LEAD-2026-001',
      customer: 'Fleet Logistics Ltd',
      channel: 'Phone',
      vehicle: 'Tata Prima 4028.S (Multi-Axle)',
      part: 'Air Brake Valve & Booster Assembly',
      value: 48500,
      priority: 'High',
      status: 'New',
      urgencyReason: 'Highway breakdown on NH-48; 32-ton reefer halted with perishable cargo.',
    },
    {
      id: 'LEAD-2026-002',
      customer: 'Metro Auto Workshop',
      channel: 'Website',
      vehicle: 'Ashok Leyland 2820 HG',
      part: 'Clutch Plate & Release Bearing Kit',
      value: 27500,
      priority: 'Medium',
      status: 'Contacted',
      urgencyReason: 'Vehicle scheduled for weekend fleet overhaul; needs parts delivered by Friday.',
    },
    {
      id: 'LEAD-2026-003',
      customer: 'Apex Parts Retailers',
      channel: 'Referral',
      vehicle: 'Mahindra Blazo X 35',
      part: 'Standard Oil Filter & Gasket Pack (x10)',
      value: 12000,
      priority: 'Low',
      status: 'Qualified',
      urgencyReason: 'Monthly inventory restock quotation; requesting price check on standard bulk cartons.',
    },
  ];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
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

  const handleLaunch = () => {
    if (onNavigate) onNavigate('/app');
  };

  return (
    <div className="min-h-screen bg-[#F3F6FA] dark:bg-[#0B132B] text-[#172438] dark:text-[#F8FAFC] font-sans antialiased pb-16 md:pb-0 transition-colors duration-150">
      {/* Navigation */}
      <Navbar currentRoute="/" onNavigate={onNavigate} />

      <main>
        {/* Hero Section — Important content & Try It Now visible above the fold */}
        <section aria-labelledby="hero-heading" className="border-b border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#0F172A] py-12 sm:py-16 lg:py-20 transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded border border-[#DCE4EE] dark:border-[#26354D] bg-[#E9EFF8] dark:bg-[#162032] px-3 py-1 text-xs text-[#173B67] dark:text-[#93C5FD] font-semibold mb-5 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-[#3678D4]"></span>
                <span>AI-Powered Spare Parts Lead Prioritization</span>
              </div>

              {/* Main Headline */}
              <h1 id="hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#173B67] dark:text-[#F8FAFC] leading-tight">
                Prioritize Urgent Auto Parts Orders Before Costly Vehicle Downtime Multiplies
              </h1>

              {/* Subheadline & Business Problem Summary */}
              <p className="mt-4 text-xs sm:text-sm lg:text-base text-[#64748B] dark:text-[#94A3B8] leading-relaxed max-w-2xl mx-auto font-medium">
                Commercial auto parts desks receive dozens of inquiries daily. PrioritiQ classifies breakdown emergencies instantly, evaluates commercial order value, and equips sales representatives with transparent AI recommendations and manual override controls.
              </p>

              {/* Primary Actions (Above the fold) */}
              <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleLaunch}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-[#3678D4] hover:bg-[#2A62B6] text-white px-6 py-2.5 text-xs font-bold shadow-btn btn-interactive focus-ring"
                  aria-label="Launch CRM Application (Try It Now)"
                >
                  <span>Try It Now</span>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                <a
                  href="/features"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate('/features');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] px-5 py-2.5 text-xs font-semibold text-[#172438] dark:text-[#F8FAFC] hover:bg-[#E9EFF8] dark:hover:bg-[#1A263D] hover:border-[#3678D4]/30 dark:hover:border-[#3678D4]/60 transition-colors shadow-xs"
                >
                  Explore Capabilities
                </a>
              </div>

              {/* Quick Specification Strip */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left border-t border-[#DCE4EE] dark:border-[#26354D] pt-6 text-xs">
                <div className="rounded border border-[#DCE4EE] dark:border-[#26354D] bg-[#F3F6FA] dark:bg-[#162032] p-3 shadow-xs">
                  <span className="block text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Classification</span>
                  <span className="mt-0.5 block text-xs font-bold text-[#173B67] dark:text-[#F8FAFC]">High • Medium • Low</span>
                </div>
                <div className="rounded border border-[#DCE4EE] dark:border-[#26354D] bg-[#F3F6FA] dark:bg-[#162032] p-3 shadow-xs">
                  <span className="block text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Audit Trail</span>
                  <span className="mt-0.5 block text-xs font-bold text-[#173B67] dark:text-[#F8FAFC]">Immutable ML Scoring</span>
                </div>
                <div className="rounded border border-[#DCE4EE] dark:border-[#26354D] bg-[#F3F6FA] dark:bg-[#162032] p-3 shadow-xs">
                  <span className="block text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Human Control</span>
                  <span className="mt-0.5 block text-xs font-bold text-[#173B67] dark:text-[#F8FAFC]">Manual Sales Override</span>
                </div>
                <div className="rounded border border-[#DCE4EE] dark:border-[#26354D] bg-[#F3F6FA] dark:bg-[#162032] p-3 shadow-xs">
                  <span className="block text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Batch Ingestion</span>
                  <span className="mt-0.5 block text-xs font-bold text-[#173B67] dark:text-[#F8FAFC]">RFC 4180 CSV Import</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Business Problem & Solution Section */}
        <section aria-labelledby="problem-heading" className="border-b border-[#DCE4EE] dark:border-[#26354D] py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3678D4] dark:text-[#60A5FA]">The Problem &amp; Solution</span>
              <h2 id="problem-heading" className="mt-1 text-2xl font-bold tracking-tight text-[#173B67] dark:text-[#F8FAFC]">
                Solving the High-Volume Commercial Spare Parts Queue
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                When a commercial vehicle breaks down on a transport corridor, every hour of delay costs fleet operators tens of thousands of rupees. In chronological inboxes, critical emergency inquiries sit behind routine quotation requests.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <article className="rounded-md border border-[#FCA5A5] dark:border-[#DC2626]/50 bg-white dark:bg-[#162032] p-5 space-y-2 shadow-card dark:shadow-card-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-150">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#DC2626] dark:text-[#F87171] border border-[#FCA5A5] dark:border-[#DC2626]/50 text-xs font-bold">
                  01
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-[#F8FAFC]">Breakdown Inquiries Lost in the Queue</h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Emergency orders for brake valves, transmission gears, and turbochargers arrive mixed with general inquiries. PrioritiQ extracts urgency signals to surface high-consequence orders immediately.
                </p>
              </article>

              <article className="rounded-md border border-[#FCD34D] dark:border-[#D97706]/50 bg-white dark:bg-[#162032] p-5 space-y-2 shadow-card dark:shadow-card-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-150">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#FFFBEB] dark:bg-[#78350F]/30 text-[#D97706] dark:text-[#FBBF24] border border-[#FCD34D] dark:border-[#D97706]/50 text-xs font-bold">
                  02
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-[#F8FAFC]">Manual Triage Bottlenecks</h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Sales desks spend up to 40% of their morning reading unformatted messages and calculating order values. PrioritiQ automates triage in real time so reps focus on quoting and closing deals.
                </p>
              </article>

              <article className="rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-5 space-y-2 shadow-card dark:shadow-card-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-150">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#E9EFF8] dark:bg-[#1E3A8A]/30 text-[#3678D4] dark:text-[#60A5FA] border border-[#DCE4EE] dark:border-[#3B82F6]/40 text-xs font-bold">
                  03
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-[#F8FAFC]">Explainable AI with Human Override</h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Reps retain full agency to adjust effective priorities for strategic commercial accounts, while the original recommendation remains permanently archived for audit compliance.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Live Product Preview Section */}
        <section aria-labelledby="preview-heading" className="border-b border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#0F172A] py-14 sm:py-16 transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-5 border-b border-[#DCE4EE] dark:border-[#26354D]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#3678D4] dark:text-[#60A5FA]">Live Product Preview</span>
                <h2 id="preview-heading" className="mt-1 text-2xl font-bold tracking-tight text-[#173B67] dark:text-[#F8FAFC]">
                  Actual CRM Prioritization Queue
                </h2>
                <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Below is an authentic preview of the operational CRM lead table and multi-class classification tags.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLaunch}
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded bg-[#3678D4] hover:bg-[#2A62B6] text-white px-3.5 py-1.5 text-xs font-bold shadow-btn btn-interactive"
              >
                <span>Launch Working CRM (Try It Now)</span>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {/* Table Mockup Container */}
            <div className="mt-6 rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] overflow-hidden shadow-card dark:shadow-card-dark">
              <div className="bg-[#F3F6FA] dark:bg-[#0B132B] border-b border-[#DCE4EE] dark:border-[#26354D] px-4 py-2.5 flex items-center justify-between text-xs">
                <span className="font-bold text-[#173B67] dark:text-[#F8FAFC]">Operational Triage Queue</span>
                <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono">Real-time classification based on urgency &amp; value</span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#DCE4EE] dark:divide-[#26354D] text-left text-xs">
                  <thead className="bg-[#F3F6FA] dark:bg-[#0B132B] text-[#64748B] dark:text-[#94A3B8] font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th scope="col" className="px-3 py-2">Lead ID</th>
                      <th scope="col" className="px-3 py-2">Customer &amp; Channel</th>
                      <th scope="col" className="px-3 py-2">Vehicle &amp; Part</th>
                      <th scope="col" className="px-3 py-2 text-right">Order Value</th>
                      <th scope="col" className="px-3 py-2">Priority</th>
                      <th scope="col" className="px-3 py-2">Status</th>
                      <th scope="col" className="px-3 py-2">Inbound Inquiry Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE4EE] dark:divide-[#26354D] bg-white dark:bg-[#162032]">
                    {sampleLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#E9EFF8]/40 dark:hover:bg-[#1E293B]/60 transition-colors">
                        <td className="px-3 py-2 font-mono font-bold text-[#173B67] dark:text-[#60A5FA] whitespace-nowrap">
                          {lead.id}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="font-semibold text-[#172438] dark:text-[#F8FAFC]">{lead.customer}</div>
                          <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">{lead.channel}</div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="font-semibold text-[#172438] dark:text-[#F8FAFC]">{lead.part}</div>
                          <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate max-w-xs">{lead.vehicle}</div>
                        </td>
                        <td className="px-3 py-2 text-right font-mono font-bold text-[#173B67] dark:text-[#F8FAFC] whitespace-nowrap">
                          {formatCurrency(lead.value)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className={`inline-block rounded px-2.5 py-0.5 text-xs font-bold border ${getPriorityBadgeClass(lead.priority)}`}>
                            {lead.priority}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold border ${getStatusBadgeClass(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-[#64748B] dark:text-[#94A3B8] text-xs italic max-w-xs truncate">
                          "{lead.urgencyReason}"
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Key Product Capabilities Overview */}
        <section aria-labelledby="capabilities-heading" className="border-b border-[#DCE4EE] dark:border-[#26354D] py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-4 border-b border-[#DCE4EE] dark:border-[#26354D]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#3678D4] dark:text-[#60A5FA]">System Capabilities</span>
                <h2 id="capabilities-heading" className="mt-1 text-2xl font-bold tracking-tight text-[#173B67] dark:text-[#F8FAFC]">
                  Engineered Strictly for Implemented CRM Workflows
                </h2>
                <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Discover how each functional module supports sales desk operations.
                </p>
              </div>
              <a
                href="/features"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate('/features');
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#3678D4] dark:text-[#60A5FA] hover:text-[#2A62B6] dark:hover:text-[#93C5FD]"
              >
                <span>View Full Features Specification</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-4 space-y-1.5 shadow-card dark:shadow-card-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-150">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-[#F8FAFC]">Real-Time ML Priority Scoring</h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Infers priority across High, Medium, and Low with confidence scores using text feature extraction and logistic regression.
                </p>
              </div>

              <div className="rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-4 space-y-1.5 shadow-card dark:shadow-card-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-150">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-[#F8FAFC]">Manual Sales Priority Override</h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Reps can adjust effective priorities when customer context requires, while immutable model predictions remain archived.
                </p>
              </div>

              <div className="rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-4 space-y-1.5 shadow-card dark:shadow-card-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-150">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-[#F8FAFC]">4-Stage Qualification Funnel</h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Advance inquiries through New, Contacted, Qualified, and Closed states to track pipeline movement cleanly.
                </p>
              </div>

              <div className="rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-4 space-y-1.5 shadow-card dark:shadow-card-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-150">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-[#F8FAFC]">Search, Filter &amp; Pagination</h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  High-density CRM table with keyword search across customer, vehicle, part, and message fields with server-side pagination.
                </p>
              </div>

              <div className="rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-4 space-y-1.5 shadow-card dark:shadow-card-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-150">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-[#F8FAFC]">Bulk CSV Import Engine</h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Batch upload customer inquiries with automated RFC 4180 validation, partial acceptance handling, and row-level classification.
                </p>
              </div>

              <div className="rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-4 space-y-1.5 shadow-card dark:shadow-card-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-150">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B67] dark:text-[#F8FAFC]">Real-Time Operational Analytics</h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Live metrics dashboard aggregating total leads, priority distribution breakdown, and funnel conversion stages.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#DCE4EE] dark:border-[#26354D] gap-2 text-xs">
              <a
                href="/how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate('/how-it-works');
                }}
                className="font-semibold text-[#173B67] dark:text-[#60A5FA] hover:text-[#3678D4] dark:hover:text-[#93C5FD] underline"
              >
                Learn how the ML classification pipeline works step-by-step →
              </a>
              <a
                href="/privacy"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate('/privacy');
                }}
                className="text-[#64748B] dark:text-[#94A3B8] hover:text-[#173B67] dark:hover:text-[#F8FAFC] underline"
              >
                Review our Data Handling &amp; Privacy Policy →
              </a>
            </div>
          </div>
        </section>

        {/* Closing CTA Section */}
        <section aria-labelledby="cta-heading" className="border-t border-[#DCE4EE] dark:border-[#26354D] bg-[#173B67] dark:bg-[#080D1D] text-white py-14 sm:py-16 transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold tracking-tight">
              Test the AI Lead Prioritization CRM Now
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
              Experience lead creation, automated priority inference, manual sales overrides, batch CSV processing, and live analytics in the functional application.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleLaunch}
                className="inline-flex items-center gap-2 rounded bg-[#3678D4] hover:bg-[#2A62B6] text-white px-6 py-2.5 text-xs font-bold shadow-btn btn-interactive focus-ring"
                aria-label="Launch Working CRM Application (Try It Now)"
              >
                <span>Try It Now</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />

      {/* Sticky Mobile CTA Button */}
      <StickyMobileCta onLaunchMvp={handleLaunch} />
    </div>
  );
}
