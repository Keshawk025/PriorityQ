import React from 'react';

export default function LandingPage({ onLaunchMvp }) {
  const sampleLeads = [
    {
      id: 'LEAD-2026-001',
      customer: 'Fleet Logistics Ltd',
      channel: 'Phone',
      vehicle: 'Tata Prima 4028.S (Multi-Axle)',
      part: 'Air Brake Valve & Booster Assembly',
      value: 48500,
      priority: 'High',
      confidence: '96.2%',
      effective: 'High',
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
      confidence: '84.7%',
      effective: 'Medium',
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
      confidence: '91.0%',
      effective: 'Low',
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
        return 'text-[#DC2626] bg-[#FEF2F2] border-[#FCA5A5] font-bold';
      case 'Medium':
        return 'text-[#D97706] bg-[#FFFBEB] border-[#FCD34D] font-bold';
      case 'Low':
        return 'text-[#059669] bg-[#ECFDF5] border-[#6EE7B7] font-bold';
      default:
        return 'text-[#172438] bg-[#F3F6FA] border-[#DCE4EE] font-bold';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Contacted':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Qualified':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Closed':
        return 'text-slate-600 bg-slate-100 border-slate-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-slate-900 text-white font-bold text-xs">
              P
            </div>
            <div>
              <span className="font-semibold text-slate-900 text-sm tracking-tight">PrioritiQ CRM</span>
              <span className="hidden sm:inline-block ml-2 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.2 text-[10px] font-medium text-slate-600">
                Commercial Parts Edition
              </span>
            </div>
          </div>

          {/* Quick anchor links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
            <a href="#overview" className="hover:text-slate-900 transition-colors">Overview</a>
            <a href="#problem" className="hover:text-slate-900 transition-colors">The Problem</a>
            <a href="#solution" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#capabilities" className="hover:text-slate-900 transition-colors">Capabilities</a>
            <a href="#preview" className="hover:text-slate-900 transition-colors">Interactive Preview</a>
          </nav>

          {/* Try It Now CTA Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onLaunchMvp}
              className="inline-flex items-center gap-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 text-xs font-medium shadow-none transition-colors focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <span>Try It Now</span>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="overview" className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Tag pill */}
            <div className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
              <span className="font-medium">AI-Driven Sales Triage for Commercial Automotive Parts</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Prioritize Urgent Spare Parts Orders Before Downtime Multiplies
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Commercial auto parts desks receive dozens of inquiries daily. PrioritiQ uses machine learning to classify breakdown emergencies instantly, score order value, and guide sales reps with explainable recommendations and manual override controls.
            </p>

            {/* CTA Group */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onLaunchMvp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-xs font-semibold shadow-none transition-colors"
              >
                <span>Try It Now</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <a
                href="#preview"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded border border-slate-300 bg-white px-5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Explore Live Data Preview
              </a>
            </div>

            {/* Core Metrics Strip */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left border-t border-slate-100 pt-8">
              <div className="rounded border border-slate-200 bg-slate-50/70 p-3">
                <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Classification</span>
                <span className="mt-1 block text-sm font-semibold text-slate-900">High • Medium • Low</span>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50/70 p-3">
                <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Audit Trail</span>
                <span className="mt-1 block text-sm font-semibold text-slate-900">Immutable ML Scoring</span>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50/70 p-3">
                <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Human Control</span>
                <span className="mt-1 block text-sm font-semibold text-slate-900">Manual Sales Override</span>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50/70 p-3">
                <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Data Ingestion</span>
                <span className="mt-1 block text-sm font-semibold text-slate-900">Single & Batch CSV</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="border-b border-slate-200 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">The Problem</span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Commercial Parts Sales Inboxes Are Noisy, Unsorted, and Time-Sensitive
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              When a commercial vehicle breaks down on a transport corridor, every hour of delay costs fleet operators significant revenue. Yet sales teams frequently lose these high-margin orders because inquiries sit buried in chronological inboxes.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-md border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                01
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Critical Breakdowns Hidden in Routine Queues</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Emergency requests for brake boosters, clutch assemblies, and turbochargers arrive alongside routine price queries. Without automated triage, sales reps handle whichever message arrived first rather than whichever is most urgent.
              </p>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                02
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Manual Triage Bottlenecks & Lost Sales</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Representatives spend hours reading multi-line customer descriptions, cross-referencing vehicle models, and calculating order values. In the commercial aftermarket, buyers call the next supplier if they do not receive a quote within 30 minutes.
              </p>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold">
                03
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Lack of Auditability & Oversight</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When sales priorities are altered arbitrarily without logging, dealership managers cannot evaluate triage quality, identify recurring customer urgency patterns, or audit whether high-value orders were dropped.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How the AI Solution Works */}
      <section id="solution" className="border-b border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">The Solution</span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              How PrioritiQ Scores and Routes Every Inbound Lead
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              PrioritiQ integrates machine learning directly into the lead ingestion lifecycle to extract urgency indicators from customer messages, calculate commercial priorities, and maintain strict sales governance.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-md border border-slate-200 bg-slate-50/60 p-4 space-y-2">
              <span className="text-[10px] font-mono font-semibold uppercase text-slate-400">Step 1</span>
              <h3 className="text-xs font-semibold text-slate-900">Text & Order Ingestion</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Captures inquiry messages containing symptom statements, fleet status, vehicle models, part requirements, and order values in INR.
              </p>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50/60 p-4 space-y-2">
              <span className="text-[10px] font-mono font-semibold uppercase text-slate-400">Step 2</span>
              <h3 className="text-xs font-semibold text-slate-900">Urgency Classification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Natural language features classify urgency into High (P1), Medium (P2), or Low (P3), calculating a calibrated confidence percentage.
              </p>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50/60 p-4 space-y-2">
              <span className="text-[10px] font-mono font-semibold uppercase text-slate-400">Step 3</span>
              <h3 className="text-xs font-semibold text-slate-900">Effective Priority Routing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The lead queue surfaces urgent cases at the top of the desk. Sales reps see both the predicted recommendation and the active operational priority.
              </p>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50/60 p-4 space-y-2">
              <span className="text-[10px] font-mono font-semibold uppercase text-slate-400">Step 4</span>
              <h3 className="text-xs font-semibold text-slate-900">Human Override & Audit</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reps can manually adjust priority for key accounts or phone agreements; original model predictions remain permanently preserved for quality auditing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Product Capabilities */}
      <section id="capabilities" className="border-b border-slate-200 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Core Capabilities</span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Built for Fast Commercial Sales Operations
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every feature in PrioritiQ is engineered to reduce sales triage friction and keep customer communications responsive.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Capability 1 */}
            <div className="rounded-md border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-600"></span>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Instant Priority Scoring</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sub-second classification categorizes leads into High, Medium, or Low priority upon creation, returning an exact confidence percentage.
              </p>
            </div>

            {/* Capability 2 */}
            <div className="rounded-md border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Human-in-the-Loop Override</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sales representatives can manually adjust effective priorities or clear overrides at any time without erasing the immutable system prediction.
              </p>
            </div>

            {/* Capability 3 */}
            <div className="rounded-md border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">4-Stage Lifecycle Tracking</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manage qualification progress across four standard lifecycle statuses: <code>New</code>, <code>Contacted</code>, <code>Qualified</code>, and <code>Closed</code>.
              </p>
            </div>

            {/* Capability 4 */}
            <div className="rounded-md border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-700"></span>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Compact CRM Data Table</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                High-density layout optimized for quick scanning with live keyword search, lifecycle status filtering, and server-side pagination.
              </p>
            </div>

            {/* Capability 5 */}
            <div className="rounded-md border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-600"></span>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Bulk CSV Ingestion</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload inquiry batches via RFC 4180 CSV with automatic field validation, partial acceptance handling, and per-row priority scoring.
              </p>
            </div>

            {/* Capability 6 */}
            <div className="rounded-md border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Live Pipeline Analytics</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time metrics track total lead volume, active priority ratios, and sales funnel distribution without manual report generation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Interface Preview */}
      <section id="preview" className="border-b border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live Preview</span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                The Actual CRM Interface in Action
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                Below is an authentic sample of the CRM lead management queue, priority classification badges, and order details.
              </p>
            </div>
            <button
              type="button"
              onClick={onLaunchMvp}
              className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold transition-colors"
            >
              <span>Open in Full MVP →</span>
            </button>
          </div>

          {/* Mockup Container */}
          <div className="mt-8 rounded-md border border-slate-200 bg-white shadow-xs overflow-hidden">
            {/* Table Mockup Header Bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">Lead Prioritization Queue</span>
                <span className="rounded border border-slate-200 bg-white px-1.5 py-0.2 text-[11px] font-medium text-slate-600">
                  3 sample leads
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Real-time sorting: Emergency Breakdown & Order Value
              </div>
            </div>

            {/* Table Preview */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-3 py-2">Lead ID</th>
                    <th className="px-3 py-2">Customer & Channel</th>
                    <th className="px-3 py-2">Vehicle & Part</th>
                    <th className="px-3 py-2 text-right">Order Value</th>
                    <th className="px-3 py-2">Predicted Priority</th>
                    <th className="px-3 py-2">Confidence</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Problem Statement Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {sampleLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-3 py-2.5 font-mono font-medium text-slate-900 whitespace-nowrap">
                        {lead.id}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{lead.customer}</div>
                        <div className="text-[11px] text-slate-400">{lead.channel}</div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-slate-800">{lead.part}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{lead.vehicle}</div>
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-medium text-slate-900 whitespace-nowrap">
                        {formatCurrency(lead.value)}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className={`inline-block rounded px-1.5 py-0.5 text-[11px] font-medium border ${getPriorityBadgeClass(lead.priority)}`}>
                          {lead.priority}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                        {lead.confidence}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium border ${getStatusBadgeClass(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600 text-xs italic max-w-xs truncate">
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

      {/* CTA Footer Section */}
      <section className="border-t border-slate-200 bg-slate-900 text-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to Explore the Functional CRM Application?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Create leads, test automated urgency classification, perform manual sales overrides, import batches via CSV, and review live pipeline metrics in the running MVP.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={onLaunchMvp}
              className="inline-flex items-center gap-2 rounded bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <span>Try It Now</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Copyright & Disclaimer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PrioritiQ CRM • Commercial Automotive Spare Parts Desk</span>
          <span className="text-[11px] text-slate-600">Local Evaluation MVP • Fully Functional</span>
        </div>
      </footer>
    </div>
  );
}
