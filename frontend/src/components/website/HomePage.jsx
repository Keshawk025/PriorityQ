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
            <span>{priority}</span>
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

  const handleLaunch = () => {
    if (onNavigate) onNavigate('/app');
  };

  return (
    <div className="min-h-screen bg-bg text-text font-sans antialiased pb-16 md:pb-0 transition-colors duration-150">
      {/* Navigation */}
      <Navbar currentRoute="/" onNavigate={onNavigate} />

      <main>
        {/* Hero Section */}
        <section aria-labelledby="hero-heading" className="border-b border-border bg-surface py-12 sm:py-16 lg:py-20 transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-raised px-3 py-1 text-xs text-text font-mono mb-5 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-text"></span>
                <span>AI-Powered Spare Parts Lead Prioritization</span>
              </div>

              {/* Main Headline */}
              <h1 id="hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text leading-tight">
                Prioritize Urgent Auto Parts Orders Before Costly Vehicle Downtime Multiplies
              </h1>

              {/* Subheadline & Business Problem Summary */}
              <p className="mt-4 text-xs sm:text-sm lg:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto font-medium">
                Commercial auto parts desks receive dozens of inquiries daily. PrioritiQ classifies breakdown emergencies instantly, evaluates commercial order value, and equips sales representatives with transparent AI recommendations and manual override controls.
              </p>

              {/* Primary Actions (Above the fold) */}
              <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleLaunch}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-accent text-accent-contrast hover:bg-accent-hover px-6 py-2.5 text-xs font-bold shadow-xs focus-ring transition-colors"
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
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 text-xs font-semibold text-text hover:bg-surface-hover hover:border-border-strong transition-colors shadow-xs"
                >
                  Explore Capabilities
                </a>
              </div>

              {/* Quick Specification Strip */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left border-t border-border pt-6 text-xs">
                <div className="rounded-md border border-border bg-surface-raised p-3 shadow-xs">
                  <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">Classification</span>
                  <span className="mt-0.5 block text-xs font-bold text-text font-mono">High • Medium • Low</span>
                </div>
                <div className="rounded-md border border-border bg-surface-raised p-3 shadow-xs">
                  <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">Audit Trail</span>
                  <span className="mt-0.5 block text-xs font-bold text-text font-mono">Immutable ML Scoring</span>
                </div>
                <div className="rounded-md border border-border bg-surface-raised p-3 shadow-xs">
                  <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">Human Control</span>
                  <span className="mt-0.5 block text-xs font-bold text-text font-mono">Manual Sales Override</span>
                </div>
                <div className="rounded-md border border-border bg-surface-raised p-3 shadow-xs">
                  <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">Batch Ingestion</span>
                  <span className="mt-0.5 block text-xs font-bold text-text font-mono">RFC 4180 CSV Import</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Business Problem & Solution Section */}
        <section aria-labelledby="problem-heading" className="border-b border-border py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">The Problem &amp; Solution</span>
              <h2 id="problem-heading" className="mt-1 text-2xl font-bold tracking-tight text-text">
                Solving the High-Volume Commercial Spare Parts Queue
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                When a commercial vehicle breaks down on a transport corridor, every hour of delay costs fleet operators tens of thousands of rupees. In chronological inboxes, critical emergency inquiries sit behind routine quotation requests.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <article className="rounded-lg border border-border bg-surface p-5 space-y-2 shadow-card hover:border-border-strong transition-all duration-150">
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface-raised text-text font-mono text-xs font-bold">
                  01
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-text">Breakdown Inquiries Lost in the Queue</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Emergency orders for brake valves, transmission gears, and turbochargers arrive mixed with general inquiries. PrioritiQ extracts urgency signals to surface high-consequence orders immediately.
                </p>
              </article>

              <article className="rounded-lg border border-border bg-surface p-5 space-y-2 shadow-card hover:border-border-strong transition-all duration-150">
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface-raised text-text font-mono text-xs font-bold">
                  02
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-text">Manual Triage Bottlenecks</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Sales desks spend up to 40% of their morning reading unformatted messages and calculating order values. PrioritiQ automates triage in real time so reps focus on quoting and closing deals.
                </p>
              </article>

              <article className="rounded-lg border border-border bg-surface p-5 space-y-2 shadow-card hover:border-border-strong transition-all duration-150">
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface-raised text-text font-mono text-xs font-bold">
                  03
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-text">Explainable AI with Human Override</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Reps retain full agency to adjust effective priorities for strategic commercial accounts, while the original recommendation remains permanently archived for audit compliance.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Live Product Preview Section */}
        <section aria-labelledby="preview-heading" className="border-b border-border bg-surface py-14 sm:py-16 transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-5 border-b border-border">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Live Product Preview</span>
                <h2 id="preview-heading" className="mt-1 text-2xl font-bold tracking-tight text-text">
                  Actual CRM Prioritization Queue
                </h2>
                <p className="mt-1 text-xs text-text-secondary">
                  Below is an authentic preview of the operational CRM lead table and multi-class classification tags.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLaunch}
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-md bg-accent text-accent-contrast hover:bg-accent-hover px-3.5 py-1.5 text-xs font-bold shadow-xs focus-ring transition-colors"
              >
                <span>Launch Working CRM (Try It Now)</span>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {/* Table Mockup Container */}
            <div className="mt-6 rounded-lg border border-border bg-surface overflow-hidden shadow-card">
              <div className="bg-surface-raised border-b border-border px-4 py-2.5 flex items-center justify-between text-xs">
                <span className="font-bold text-text">Operational Triage Queue</span>
                <span className="text-[11px] text-text-muted font-mono">Real-time classification based on urgency &amp; value</span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border text-left text-xs">
                  <thead className="bg-surface-raised text-text-muted font-bold uppercase tracking-wider text-[10px]">
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
                  <tbody className="divide-y divide-border bg-surface">
                    {sampleLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-surface-hover transition-colors">
                        <td className="px-3 py-2 font-mono font-bold text-text whitespace-nowrap">
                          {lead.id}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="font-semibold text-text">{lead.customer}</div>
                          <div className="text-[11px] text-text-secondary">{lead.channel}</div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="font-semibold text-text">{lead.part}</div>
                          <div className="text-[11px] text-text-secondary truncate max-w-xs">{lead.vehicle}</div>
                        </td>
                        <td className="px-3 py-2 text-right font-mono font-bold text-text whitespace-nowrap">
                          {formatCurrency(lead.value)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {renderPriorityBadge(lead.priority)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {renderStatusBadge(lead.status)}
                        </td>
                        <td className="px-3 py-2 text-text-secondary text-xs italic max-w-xs truncate">
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
        <section aria-labelledby="capabilities-heading" className="border-b border-border py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-4 border-b border-border">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">System Capabilities</span>
                <h2 id="capabilities-heading" className="mt-1 text-2xl font-bold tracking-tight text-text">
                  Engineered Strictly for Implemented CRM Workflows
                </h2>
                <p className="mt-1 text-xs text-text-secondary">
                  Discover how each functional module supports sales desk operations.
                </p>
              </div>
              <a
                href="/features"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate('/features');
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-text hover:text-text-secondary underline"
              >
                <span>View Full Features Specification</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-border bg-surface p-4 space-y-1.5 shadow-card hover:border-border-strong transition-all duration-150">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text">Real-Time ML Priority Scoring</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Infers priority across High, Medium, and Low with confidence scores using text feature extraction and logistic regression.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-surface p-4 space-y-1.5 shadow-card hover:border-border-strong transition-all duration-150">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text">Manual Sales Priority Override</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Reps can adjust effective priorities when customer context requires, while immutable model predictions remain archived.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-surface p-4 space-y-1.5 shadow-card hover:border-border-strong transition-all duration-150">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text">4-Stage Qualification Funnel</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Advance inquiries through New, Contacted, Qualified, and Closed states to track pipeline movement cleanly.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-surface p-4 space-y-1.5 shadow-card hover:border-border-strong transition-all duration-150">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text">Search, Filter &amp; Pagination</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  High-density CRM table with keyword search across customer, vehicle, part, and message fields with server-side pagination.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-surface p-4 space-y-1.5 shadow-card hover:border-border-strong transition-all duration-150">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text">Bulk CSV Import Engine</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Batch upload customer inquiries with automated RFC 4180 validation, partial acceptance handling, and row-level classification.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-surface p-4 space-y-1.5 shadow-card hover:border-border-strong transition-all duration-150">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text">Real-Time Operational Analytics</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Live metrics dashboard aggregating total leads, priority distribution breakdown, and funnel conversion stages.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-border gap-2 text-xs">
              <a
                href="/how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate('/how-it-works');
                }}
                className="font-semibold text-text hover:text-text-secondary underline"
              >
                Learn how the ML classification pipeline works step-by-step →
              </a>
              <a
                href="/privacy"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate('/privacy');
                }}
                className="text-text-muted hover:text-text underline"
              >
                Review our Data Handling &amp; Privacy Policy →
              </a>
            </div>
          </div>
        </section>

        {/* Closing CTA Section */}
        <section aria-labelledby="cta-heading" className="border-t border-border bg-surface text-text py-14 sm:py-16 transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
              Test the AI Lead Prioritization CRM Now
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
              Experience lead creation, automated priority inference, manual sales overrides, batch CSV processing, and live analytics in the functional application.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleLaunch}
                className="inline-flex items-center gap-2 rounded-md bg-accent text-accent-contrast hover:bg-accent-hover px-6 py-2.5 text-xs font-bold shadow-xs focus-ring transition-colors"
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