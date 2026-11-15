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
      borderClass: 'border-l-4 border-l-[#DC2626]',
      badgeClass: 'text-[#DC2626] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 border-[#FCA5A5] dark:border-[#DC2626]/50 font-bold',
      dotClass: 'bg-[#DC2626]',
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
      borderClass: 'border-l-4 border-l-[#D97706]',
      badgeClass: 'text-[#D97706] dark:text-[#FBBF24] bg-[#FFFBEB] dark:bg-[#78350F]/30 border-[#FCD34D] dark:border-[#D97706]/50 font-bold',
      dotClass: 'bg-[#D97706]',
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
      borderClass: 'border-l-4 border-l-[#059669]',
      badgeClass: 'text-[#059669] dark:text-[#34D399] bg-[#ECFDF5] dark:bg-[#064E3B]/30 border-[#6EE7B7] dark:border-[#059669]/50 font-bold',
      dotClass: 'bg-[#059669]',
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
    <div className="min-h-screen bg-[#F3F6FA] dark:bg-[#0B132B] text-[#172438] dark:text-[#F8FAFC] font-sans antialiased pb-16 md:pb-0">
      <Navbar currentRoute="/how-it-works" onNavigate={onNavigate} />

      <main className="py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[{ label: 'How It Works', path: '/how-it-works' }]}
            onNavigate={onNavigate}
          />

          {/* Page Header */}
          <div className="max-w-3xl pb-8 border-b border-[#DCE4EE] dark:border-[#26354D]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
              Technical &amp; Operational Architecture
            </span>
            <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-[#173B67] dark:text-white">
              How the Prioritization Workflow Operates
            </h1>
            <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              PrioritiQ bridges machine learning inference and frontline sales decision-making. Below is the real architectural workflow implemented in the software, from inquiry text tokenization to supervised sales override controls.
            </p>
          </div>

          {/* Workflow Sequence */}
          <section aria-labelledby="workflow-heading" className="mt-10">
            <h2 id="workflow-heading" className="text-lg font-bold text-[#173B67] dark:text-white mb-6">
              The End-to-End Triage Sequence
            </h2>

            <div className="space-y-4">
              {workflowSteps.map((step) => (
                <div
                  key={step.step}
                  className="rounded-lg border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-shadow flex flex-col sm:flex-row sm:items-start gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#173B67] dark:bg-[#1E293B] border border-transparent dark:border-[#26354D] text-white font-mono font-bold text-sm">
                    {step.step}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h3 className="text-sm font-bold text-[#172438] dark:text-[#F8FAFC]">{step.title}</h3>
                      <span className="text-[11px] font-semibold text-[#3678D4] dark:text-[#60A5FA] bg-[#E9EFF8] dark:bg-[#1E293B] border border-[#3678D4]/20 dark:border-[#3678D4]/40 rounded px-2.5 py-0.5 self-start sm:self-auto">
                        {step.subtitle}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                      {step.description}
                    </p>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono bg-[#F3F6FA] dark:bg-[#0F172A] p-2.5 rounded border border-[#DCE4EE] dark:border-[#26354D] mt-2.5">
                      <span className="font-semibold text-[#173B67] dark:text-[#93C5FD]">Implementation Note:</span> {step.technicalNote}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Priority Class Definitions */}
          <section aria-labelledby="classes-heading" className="mt-14 pt-10 border-t border-[#DCE4EE] dark:border-[#26354D]">
            <div className="max-w-2xl mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                Classification Framework
              </span>
              <h2 id="classes-heading" className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[#173B67] dark:text-white">
                Understanding High, Medium, and Low Priority Tiers
              </h2>
              <p className="mt-1.5 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                PrioritiQ evaluates both linguistic indicators and order context to establish three distinct priority tiers, each with dedicated sales response protocols.
              </p>
            </div>

            <div className="space-y-4">
              {priorityDefinitions.map((tier) => (
                <article
                  key={tier.level}
                  className={`rounded-lg border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-shadow ${tier.borderClass}`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#DCE4EE] dark:border-[#26354D]">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${tier.dotClass}`}></span>
                      <h3 className="text-sm font-bold text-[#172438] dark:text-[#F8FAFC]">{tier.level}</h3>
                    </div>
                    <span className={`rounded border px-2.5 py-0.5 text-[11px] font-bold ${tier.badgeClass}`}>
                      {tier.level.split(' ')[0]} Priority
                    </span>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-[#172438] dark:text-[#E2E8F0] leading-relaxed">
                    <strong>Operational Trigger:</strong> {tier.definition}
                  </p>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-[#F3F6FA] dark:bg-[#0F172A] p-3 rounded-md border border-[#DCE4EE] dark:border-[#26354D]">
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-[#64748B] dark:text-[#94A3B8] block mb-0.5">
                        Typical Component Requests
                      </span>
                      <p className="text-[#172438] dark:text-[#E2E8F0]">{tier.sampleParts}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-[#64748B] dark:text-[#94A3B8] block mb-0.5">
                        Recommended Sales Protocol
                      </span>
                      <p className="text-[#172438] dark:text-[#E2E8F0]">{tier.recommendedAction}</p>
                    </div>
                  </div>

                  <div className="mt-3 text-xs bg-white dark:bg-[#1E293B] p-2.5 rounded-md border border-[#DCE4EE] dark:border-[#26354D]">
                    <span className="text-[10px] font-semibold uppercase text-[#64748B] dark:text-[#94A3B8] block mb-0.5">
                      Illustrative Inquiry Statement
                    </span>
                    <p className="italic text-[#64748B] dark:text-[#94A3B8]">{tier.sampleInquiry}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Illustrative Architecture Blueprint */}
          <section aria-labelledby="blueprint-heading" className="mt-14 pt-10 border-t border-[#DCE4EE] dark:border-[#26354D]">
            <div className="max-w-2xl mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                System Transparency
              </span>
              <h2 id="blueprint-heading" className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[#173B67] dark:text-white">
                Product Architecture Blueprint
              </h2>
              <p className="mt-1.5 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                This workflow reflects the actual components running in this environment. No fabricated customer case studies, simulated metrics, or artificial accuracy statistics are presented.
              </p>
            </div>

            <div className="rounded-lg border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-6 shadow-card text-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-[#F3F6FA] dark:bg-[#0F172A] p-3.5 space-y-1">
                  <span className="font-bold text-[#173B67] dark:text-[#93C5FD] block text-xs">FastAPI Backend Service</span>
                  <p className="text-[#64748B] dark:text-[#94A3B8] text-[11px] leading-relaxed">
                    Validates 7-field Pydantic schema, handles duplicate prevention, and serves paginated queries.
                  </p>
                </div>
                <div className="rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-[#F3F6FA] dark:bg-[#0F172A] p-3.5 space-y-1">
                  <span className="font-bold text-[#173B67] dark:text-[#93C5FD] block text-xs">Scikit-Learn ML Pipeline</span>
                  <p className="text-[#64748B] dark:text-[#94A3B8] text-[11px] leading-relaxed">
                    Transforms text via TF-IDF Vectorizer and predicts class probabilities via Logistic Regression.
                  </p>
                </div>
                <div className="rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-[#F3F6FA] dark:bg-[#0F172A] p-3.5 space-y-1">
                  <span className="font-bold text-[#173B67] dark:text-[#93C5FD] block text-xs">React 18 &amp; Tailwind UI</span>
                  <p className="text-[#64748B] dark:text-[#94A3B8] text-[11px] leading-relaxed">
                    Provides high-density lead queue tables, manual override controls, and dynamic CSV batch ingestion.
                  </p>
                </div>
              </div>

              <div className="pt-3 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#DCE4EE] dark:border-[#26354D]">
                <span className="text-[#64748B] dark:text-[#94A3B8] text-xs">
                  Ready to test the live ML inference and override engine?
                </span>
                <button
                  type="button"
                  onClick={handleLaunch}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#3678D4] hover:bg-[#2A62B6] text-white px-4 py-2 text-xs font-semibold shadow-btn btn-interactive transition-all"
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
