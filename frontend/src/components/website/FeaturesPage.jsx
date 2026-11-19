import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import StickyMobileCta from './StickyMobileCta';

export default function FeaturesPage({ onNavigate }) {
  const handleLaunch = () => {
    if (onNavigate) onNavigate('/app');
  };

  const features = [
    {
      id: 'ai-priority',
      title: 'AI-Powered Lead Priority Prediction',
      badge: 'Machine Learning Core',
      description:
        'Every inbound customer inquiry is scored in real time by an automated ML classification pipeline. The model analyzes unstructured symptom descriptions, breakdown locations, and urgency vocabulary alongside commercial parameters to assign a priority rating: High, Medium, or Low.',
      details: [
        'Multi-class urgency classification (High, Medium, Low)',
        'Calibrated probability confidence score (0.0% to 100.0%)',
        'Sub-second inference time upon lead creation and batch import',
        'Audit integrity guarantee: predicted priority and confidence remain permanent and immutable',
      ],
    },
    {
      id: 'lead-creation',
      title: 'Structured 7-Field Lead Creation Form',
      badge: 'Sales Ingestion',
      description:
        'A streamlined sales intake form captures commercial order context with strict client-side and server-side validation to eliminate incomplete or corrupted entries.',
      details: [
        'Seven verified fields: Lead ID, Source Channel, Customer Type, Vehicle Model, Part Needed, Order Value (INR), and Customer Message',
        'Real-time non-whitespace string verification and integer order value validation (ge=0)',
        'Instant duplicate Lead ID prevention (HTTP 409 conflict detection)',
        'Immediate display of inferred priority upon creation',
      ],
    },
    {
      id: 'search-filtering',
      title: 'Real-Time Search & Status Filtering',
      badge: 'Queue Navigation',
      description:
        'Sales representatives can quickly isolate relevant leads using fast text search across multiple dimensions and dedicated lifecycle filters.',
      details: [
        'Comprehensive multi-field search: matches across Lead ID, Customer Type, Vehicle, Part, and Inquiry Message',
        'Lifecycle status filtering: instant switching between All, New, Contacted, Qualified, and Closed',
        'Server-side pagination with configurable page sizes (10, 25, 50 records per page)',
        'Dynamic query parameter synchronization and one-click filter reset',
      ],
    },
    {
      id: 'lifecycle-management',
      title: '4-Stage Lead Lifecycle Management',
      badge: 'Sales Funnel',
      description:
        'Tracks the progression of commercial opportunities from initial receipt to final resolution across four distinct operational stages.',
      details: [
        'New: Freshly ingested inquiry awaiting sales rep assessment',
        'Contacted: Initial customer outreach initiated via phone, email, or WhatsApp',
        'Qualified: Vehicle specifications and commercial pricing agreed with buyer',
        'Closed: Order completed and invoiced, or inquiry resolved',
      ],
    },
    {
      id: 'priority-overrides',
      title: 'Manual Priority Overrides with Audit Integrity',
      badge: 'Human-in-the-Loop',
      description:
        'Empowers sales representatives to adjust active operational priorities when commercial context dictates, while permanently retaining original system recommendations for quality auditing.',
      details: [
        'Manual override selector with High, Medium, and Low options',
        'Clear Override function: instantly reverts effective priority back to the initial AI prediction',
        'Clear visual separation between AI recommendations and human overrides',
        'Server-side PATCH enforcement prohibiting client modification of ML prediction fields',
      ],
    },
    {
      id: 'csv-import',
      title: 'Bulk & Single CSV Ingestion with Diagnostics',
      badge: 'Batch Processing',
      description:
        'Enables high-volume ingestion of historical or third-party lead lists via standard CSV files, automatically validating schema requirements, showing row-level diagnostics, and scoring priorities.',
      details: [
        'Single and multi-file bulk CSV upload flows with native file picker support',
        'Automated header alias mapping matching standard and client CSV schemas',
        'Partial acceptance handling: valid rows are ingested and scored while invalid rows are isolated',
        'Tabular rejected rows report detailing exact row numbers and failure reasons',
      ],
    },
    {
      id: 'analytics-metrics',
      title: 'Real-Time Pipeline Analytics & Metrics',
      badge: 'Operational Visibility',
      description:
        'Provides instant operational visibility into lead volume, priority distribution ratios, and sales qualification progress without generating offline reports.',
      details: [
        'Total pipeline lead counter reflecting live database records',
        'Priority breakdown tracking the proportion of High, Medium, and Low urgency leads',
        'Lifecycle pipeline distribution bar visualizing stage conversion progress',
        'Automatic synchronization after every lead creation, status update, or CSV import',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-text font-sans antialiased pb-16 md:pb-0 transition-colors duration-150">
      <Navbar currentRoute="/features" onNavigate={onNavigate} />

      <main className="py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[{ label: 'Product Features', path: '/features' }]}
            onNavigate={onNavigate}
          />

          {/* Page Header */}
          <div className="max-w-3xl pb-8 border-b border-border">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted font-mono">
              System Specification
            </span>
            <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-text">
              Features &amp; Functional Capabilities
            </h1>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Every capability detailed below is fully implemented and operational in the running PrioritiQ application. No speculative or unverified features are listed.
            </p>
          </div>

          {/* Features Grid */}
          <div className="mt-10 space-y-8">
            {features.map((feature, idx) => (
              <article
                key={feature.id}
                id={feature.id}
                className="rounded-lg border border-border bg-surface p-6 sm:p-7 shadow-card hover:border-border-strong transition-all duration-150"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-surface-raised text-text text-xs font-bold font-mono border border-border">
                      0{idx + 1}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-text">
                      {feature.title}
                    </h2>
                  </div>
                  <span className="self-start sm:self-auto rounded-md border border-border bg-surface-raised px-2.5 py-0.5 text-[11px] font-mono text-text-muted">
                    {feature.badge}
                  </span>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>

                <div className="mt-4 pt-3 border-t border-border">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text mb-2 font-mono">
                    Key Specifications &amp; Safeguards:
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-secondary">
                    {feature.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-1.5">
                        <span className="text-text font-bold shrink-0">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          {/* Call to Action Banner */}
          <div className="mt-12 rounded-lg border border-border bg-surface text-text p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-card hover:border-border-strong transition-all duration-150">
            <div>
              <h2 className="text-xl font-bold text-text">Test These Capabilities in the Live CRM</h2>
              <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                Launch the running application to evaluate lead creation, priority scoring, search, overrides, and CSV ingestion directly.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLaunch}
              className="mt-4 sm:mt-0 shrink-0 inline-flex items-center gap-1.5 rounded-md bg-accent text-accent-contrast hover:bg-accent-hover px-5 py-2.5 text-xs font-bold shadow-xs focus-ring transition-colors"
            >
              <span>Try It Now (Launch CRM)</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
      <StickyMobileCta onLaunchMvp={handleLaunch} />
    </div>
  );
}