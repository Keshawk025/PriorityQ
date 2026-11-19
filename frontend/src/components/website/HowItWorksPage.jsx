import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import StickyMobileCta from './StickyMobileCta';

export default function HowItWorksPage({ onNavigate }) {
  const handleLaunch = () => {
    if (onNavigate) onNavigate('/app');
  };

  const workflowSteps = [
    {
      step: '01',
      title: 'Customer Inquiry Submission',
      subtitle: 'Inbound Multi-Channel Ingestion',
      description:
        'A commercial customer (fleet owner, workshop manager, or retail buyer) submits an inquiry detailing their vehicle downtime, required part, location, and urgency.',
      technicalNote:
        'Captured via the structured 7-field form or uploaded as part of a batch RFC 4180 CSV file.',
    },
    {
      step: '02',
      title: 'Text Feature Extraction (TF-IDF)',
      subtitle: 'Natural Language Processing',
      description:
        'The inquiry message text is tokenized and transformed using Term Frequency-Inverse Document Frequency (TF-IDF) vectorization. Crucial urgency vocabulary (e.g. "breakdown", "stuck on highway", "urgent replacement", "overhaul") is weighted mathematically.',
      technicalNote:
        'Converts variable-length raw text strings into numerical feature matrices calibrated on automotive spare parts domain vocabulary.',
    },
    {
      step: '03',
      title: 'Multi-Class Logistic Regression Classification',
      subtitle: 'Probabilistic Model Inference',
      description:
        'The feature vector is processed by a multi-class Logistic Regression classifier trained specifically to distinguish emergency breakdown needs from predictable maintenance and casual price inquiries.',
      technicalNote:
        'Computes class probabilities across all three target tiers and assigns the class with highest posterior probability alongside a calibrated confidence score.',
    },
    {
      step: '04',
      title: 'Priority Recommendation & Queue Insertion',
      subtitle: 'Immediate Queue Routing',
      description:
        'The lead is persisted in the database with its predicted priority, probability confidence score, and initial effective priority. Emergency leads immediately surface at the top of the sales desk queue.',
      technicalNote:
        'predicted_priority and confidence are committed as permanent immutable audit records.',
    },
    {
      step: '05',
      title: 'Human Review & Sales Override',
      subtitle: 'Supervised Sales Governance',
      description:
        'Sales representatives inspect the inquiry context. If strategic commercial commitments, credit terms, or verbal phone agreements warrant an adjustment, the rep can apply a manual override or clear an existing override at any time.',
      technicalNote:
        'The effective_priority updates immediately for daily workflows while original ML outputs remain intact for managerial oversight.',
    },
  ];

  const priorityDefinitions = [
    {
      level: 'High Priority (P1)',
      dotClass: 'bg-red-600 dark:bg-red-500',
      borderClass: 'border-l-4 border-l-red-500',
      badgeClass: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60 font-bold',
      definition:
        'Immediate operational downtime. A commercial vehicle or fleet truck is immobilized on a route, carrying time-sensitive cargo, or causing severe commercial disruption.',
      sampleParts: 'Brake valves, booster assemblies, steering linkages, clutch release bearings, fuel pump units.',
      sampleInquiry:
        '"Vehicle halted on highway with 30 tons of perishable load. Brake valve cracked. Need immediate replacement dispatched to highway depot within 2 hours."',
      recommendedAction:
        'Immediate telephone callback within 15 minutes; prioritize stock availability and express dispatch.',
    },
    {
      level: 'Medium Priority (P2)',
      dotClass: 'bg-amber-500',
      borderClass: 'border-l-4 border-l-amber-500',
      badgeClass: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 font-bold',
      definition:
        'Predictable commercial maintenance. A vehicle is scheduled for fleet inspection, weekend workshop overhaul, or preventative component replacement within several days.',
      sampleParts: 'Clutch plates, suspension bushes, radiator hoses, standard brake shoe sets, water pumps.',
      sampleInquiry:
        '"Truck scheduled for planned maintenance this weekend. Require clutch kit and release bearing by Friday afternoon to avoid driver delay."',
      recommendedAction:
        'Review inventory and provide pricing and delivery timeline within 2 to 4 business hours.',
    },
    {
      level: 'Low Priority (P3)',
      dotClass: 'bg-emerald-500',
      borderClass: 'border-l-4 border-l-emerald-500',
      badgeClass: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 font-bold',
      definition:
        'General commercial inquiry. Exploratory requests for price estimations, periodic inventory restock comparisons, or standard catalog queries with no active downtime.',
      sampleParts: 'Standard oil filters, gasket packs, consumable clips, bulk accessory hardware.',
      sampleInquiry:
        '"Requesting quotation on 10 packs of standard oil filters and gaskets for routine inventory stocking. Please share bulk rate card."',
      recommendedAction:
        'Standard quotation workflow; batch response within standard commercial sales turnaround.',
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-text font-sans antialiased pb-16 md:pb-0 transition-colors duration-150">
      <Navbar currentRoute="/how-it-works" onNavigate={onNavigate} />

      <main className="py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[{ label: 'How It Works', path: '/how-it-works' }]}
            onNavigate={onNavigate}
          />

          {/* Page Header */}
          <div className="max-w-3xl pb-8 border-b border-border">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted font-mono">
              Technical &amp; Operational Architecture
            </span>
            <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-text">
              How the Prioritization Workflow Operates
            </h1>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              PrioritiQ bridges machine learning inference and frontline sales decision-making. Below is the real architectural workflow implemented in the software, from inquiry text tokenization to supervised sales override controls.
            </p>
          </div>

          {/* Workflow Sequence */}
          <section aria-labelledby="workflow-heading" className="mt-10">
            <h2 id="workflow-heading" className="text-lg font-bold text-text mb-6">
              The End-to-End Triage Sequence
            </h2>

            <div className="space-y-4">
              {workflowSteps.map((step) => (
                <div
                  key={step.step}
                  className="rounded-lg border border-border bg-surface p-5 sm:p-6 shadow-card hover:border-border-strong transition-all duration-150 flex flex-col sm:flex-row sm:items-start gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-raised border border-border text-text font-mono font-bold text-sm">
                    {step.step}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h3 className="text-sm font-bold text-text">{step.title}</h3>
                      <span className="text-[11px] font-mono text-text-muted bg-surface-raised border border-border rounded px-2.5 py-0.5 self-start sm:self-auto">
                        {step.subtitle}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {step.description}
                    </p>
                    <p className="text-[11px] text-text-secondary font-mono bg-surface-raised p-2.5 rounded-md border border-border mt-2.5">
                      <span className="font-semibold text-text">Implementation Note:</span> {step.technicalNote}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Priority Class Definitions */}
          <section aria-labelledby="classes-heading" className="mt-14 pt-10 border-t border-border">
            <div className="max-w-2xl mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted font-mono">
                Classification Framework
              </span>
              <h2 id="classes-heading" className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-text">
                Understanding High, Medium, and Low Priority Tiers
              </h2>
              <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
                PrioritiQ evaluates both linguistic indicators and order context to establish three distinct priority tiers, each with dedicated sales response protocols.
              </p>
            </div>

            <div className="space-y-4">
              {priorityDefinitions.map((tier) => (
                <article
                  key={tier.level}
                  className={`rounded-lg border border-border bg-surface p-5 sm:p-6 shadow-card hover:border-border-strong transition-all duration-150 ${tier.borderClass || ''}`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${tier.dotClass}`}></span>
                      <h3 className="text-sm font-bold text-text">{tier.level}</h3>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded px-2.5 py-0.5 text-[11px] ${tier.badgeClass}`}>
                      <span>{tier.level.split(' ')[0]}</span>
                    </span>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                    <strong className="text-text">Operational Trigger:</strong> {tier.definition}
                  </p>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-surface-raised p-3 rounded-md border border-border">
                    <div>
                      <span className="text-[10px] font-mono font-semibold uppercase text-text-muted block mb-0.5">
                        Typical Component Requests
                      </span>
                      <p className="text-text">{tier.sampleParts}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-semibold uppercase text-text-muted block mb-0.5">
                        Recommended Sales Protocol
                      </span>
                      <p className="text-text">{tier.recommendedAction}</p>
                    </div>
                  </div>

                  <div className="mt-3 text-xs bg-surface p-2.5 rounded-md border border-border">
                    <span className="text-[10px] font-mono font-semibold uppercase text-text-muted block mb-0.5">
                      Illustrative Inquiry Statement
                    </span>
                    <p className="italic text-text-secondary">{tier.sampleInquiry}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Illustrative Architecture Blueprint */}
          <section aria-labelledby="blueprint-heading" className="mt-14 pt-10 border-t border-border">
            <div className="max-w-2xl mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted font-mono">
                System Transparency
              </span>
              <h2 id="blueprint-heading" className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-text">
                Product Architecture Blueprint
              </h2>
              <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
                This workflow reflects the actual components running in this environment. No fabricated customer case studies, simulated metrics, or artificial accuracy statistics are presented.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-surface p-6 shadow-card text-xs space-y-4 hover:border-border-strong transition-all duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-md border border-border bg-surface-raised p-3.5 space-y-1">
                  <span className="font-bold text-text block text-xs">FastAPI Backend Service</span>
                  <p className="text-text-secondary text-[11px] leading-relaxed">
                    Validates 7-field Pydantic schema, handles duplicate prevention, and serves paginated queries.
                  </p>
                </div>
                <div className="rounded-md border border-border bg-surface-raised p-3.5 space-y-1">
                  <span className="font-bold text-text block text-xs">Scikit-Learn ML Pipeline</span>
                  <p className="text-text-secondary text-[11px] leading-relaxed">
                    Transforms text via TF-IDF Vectorizer and predicts class probabilities via Logistic Regression.
                  </p>
                </div>
                <div className="rounded-md border border-border bg-surface-raised p-3.5 space-y-1">
                  <span className="font-bold text-text block text-xs">React 18 &amp; Tailwind UI</span>
                  <p className="text-text-secondary text-[11px] leading-relaxed">
                    Provides high-density lead queue tables, manual override controls, and dynamic CSV batch ingestion.
                  </p>
                </div>
              </div>

              <div className="pt-3 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
                <span className="text-text-secondary text-xs">
                  Ready to test the live ML inference and override engine?
                </span>
                <button
                  type="button"
                  onClick={handleLaunch}
                  className="inline-flex items-center gap-1.5 rounded-md bg-accent text-accent-contrast hover:bg-accent-hover px-4 py-2 text-xs font-bold shadow-xs focus-ring transition-colors"
                >
                  <span>Try It Now (Launch CRM)</span>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
      <StickyMobileCta onLaunchMvp={handleLaunch} />
    </div>
  );
}