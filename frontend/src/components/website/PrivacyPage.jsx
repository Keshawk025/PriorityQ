import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import StickyMobileCta from './StickyMobileCta';

export default function PrivacyPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    fleetSize: '1-10',
    inquiry: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleLaunch = () => {
    if (onNavigate) onNavigate('/app');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Smoothly transition to Thank You page
    if (onNavigate) {
      onNavigate('/thank-you');
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col font-sans transition-colors duration-150">
      <Navbar onNavigate={onNavigate} currentRoute="/privacy" />

      <main className="flex-1 pb-20">
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Privacy Policy & Data Governance', path: '/privacy' },
          ]}
          onNavigate={onNavigate}
        />

        {/* Page Header */}
        <section className="bg-surface border-b border-border py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text bg-surface-raised border border-border px-2.5 py-1 rounded-md font-mono">
              Data Protection &amp; Governance
            </span>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
              Privacy Policy &amp; Security Architecture
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed max-w-3xl">
              Transparent disclosure of data handling, on-premises storage architecture, ML inference privacy,
              and application scope for the AI Lead Prioritization CRM.
            </p>
            <div className="mt-3 text-[11px] text-text-muted font-mono">
              Last updated: November 2026 • Policy Version 1.2 • Autonomous Enterprise Deployment
            </div>
          </div>
        </section>

        {/* Core Policy Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          
          {/* Key Principles Callout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-surface p-5 shadow-card hover:border-border-strong transition-all duration-150">
              <div className="h-8 w-8 rounded-md bg-surface-raised border border-border text-text flex items-center justify-center font-bold text-sm mb-3 font-mono">
                01
              </div>
              <h2 className="text-sm font-bold text-text">Local Data Ownership</h2>
              <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
                All lead records, customer inquiries, and priority history are stored in your local SQLite database instance. Data never leaves your infrastructure.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-surface p-5 shadow-card hover:border-border-strong transition-all duration-150">
              <div className="h-8 w-8 rounded-md bg-surface-raised border border-border text-text flex items-center justify-center font-bold text-sm mb-3 font-mono">
                02
              </div>
              <h2 className="text-sm font-bold text-text">Zero Cloud Telemetry</h2>
              <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
                No third-party tracking pixels, external analytics beacons, or behavioral monitoring scripts run in this CRM deployment.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-surface p-5 shadow-card hover:border-border-strong transition-all duration-150">
              <div className="h-8 w-8 rounded-md bg-surface-raised border border-border text-text flex items-center justify-center font-bold text-sm mb-3 font-mono">
                03
              </div>
              <h2 className="text-sm font-bold text-text">On-Premises ML Inference</h2>
              <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
                Inference runs locally using serialized scikit-learn models. Inbound text is never forwarded to external commercial LLM APIs.
              </p>
            </div>
          </div>

          {/* Section 1: Data Collection & Storage */}
          <article className="rounded-lg border border-border bg-surface p-6 shadow-card hover:border-border-strong transition-all duration-150">
            <h2 className="text-base font-bold text-text border-b border-border pb-3 flex items-center justify-between">
              <span>1. Data Collection &amp; Local Persistence</span>
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Architecture</span>
            </h2>
            <div className="mt-4 space-y-3 text-xs text-text-secondary leading-relaxed">
              <p>
                When utilizing the AI Lead Prioritization CRM, the system captures commercial sales information necessary to triage and fulfill automotive spare parts inquiries:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-text">
                <li><strong className="text-text">Commercial Identifier:</strong> Lead ID (unique string token for tracking inquiries).</li>
                <li><strong className="text-text">Acquisition Source:</strong> Source channel (e.g. Website, Phone Inquiry, WhatsApp, Field Sales).</li>
                <li><strong className="text-text">Customer Classification:</strong> Fleet Owner, Independent Workshop, Retail Buyer, or Dealership.</li>
                <li><strong className="text-text">Operational Context:</strong> Vehicle Model, Part Needed, Estimated Order Value (INR), and Inbound Inquiry Message.</li>
              </ul>
              <p>
                All captured records are committed directly to a local embedded database engine (<code className="bg-surface-raised text-text px-1 py-0.5 rounded border border-border text-[11px] font-mono">backend/lead_crm.db</code>). At no point does the application transmit customer order records to external clouds, multi-tenant databases, or centralized repositories.
              </p>
            </div>
          </article>

          {/* Section 2: Machine Learning Privacy & Processing */}
          <article className="rounded-lg border border-border bg-surface p-6 shadow-card hover:border-border-strong transition-all duration-150">
            <h2 className="text-base font-bold text-text border-b border-border pb-3 flex items-center justify-between">
              <span>2. Machine Learning Inference Privacy</span>
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Algorithms</span>
            </h2>
            <div className="mt-4 space-y-3 text-xs text-text-secondary leading-relaxed">
              <p>
                Automated lead classification is performed entirely by a local scikit-learn pipeline (<code className="bg-surface-raised text-text px-1 py-0.5 rounded border border-border text-[11px] font-mono">backend/ml_models/lead_priority_model.pkl</code>) running inside the local FastAPI runtime:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-text">
                <li><strong className="text-text">Local Vectorization:</strong> Unstructured customer messages are parsed using a local TF-IDF vectorizer.</li>
                <li><strong className="text-text">Deterministic Scoring:</strong> A local Logistic Regression classification model calculates class probabilities without external API calls.</li>
                <li><strong className="text-text">No Model Retraining on User Input:</strong> Customer messages are not used to retrain external public models, eliminating data leakage risks.</li>
                <li><strong className="text-text">Audit Trail Retention:</strong> Predicted priority and confidence percentages are stored permanently as read-only audit records to verify algorithmic fairness.</li>
              </ul>
            </div>
          </article>

          {/* Section 3: Third-Party Tracking & Web Beacons */}
          <article className="rounded-lg border border-border bg-surface p-6 shadow-card hover:border-border-strong transition-all duration-150">
            <h2 className="text-base font-bold text-text border-b border-border pb-3 flex items-center justify-between">
              <span>3. Zero Third-Party Tracking &amp; Analytics Disclosure</span>
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Compliance</span>
            </h2>
            <div className="mt-4 space-y-3 text-xs text-text-secondary leading-relaxed">
              <p>
                The AI Lead Prioritization CRM does not implement any third-party tracking technologies:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="border border-border rounded-md p-3 bg-surface-raised">
                  <div className="font-bold text-text flex items-center gap-1.5">
                    <span className="text-text font-bold">✓</span> No Advertising Pixels
                  </div>
                  <p className="text-[11px] text-text-muted mt-1">
                    Zero Meta Pixel, LinkedIn Insight Tag, Google Ads or affiliate marketing cookies.
                  </p>
                </div>
                <div className="border border-border rounded-md p-3 bg-surface-raised">
                  <div className="font-bold text-text flex items-center gap-1.5">
                    <span className="text-text font-bold">✓</span> No External Analytics
                  </div>
                  <p className="text-[11px] text-text-muted mt-1">
                    Google Analytics is currently disabled. No tracking scripts or device fingerprints are deployed.
                  </p>
                </div>
                <div className="border border-border rounded-md p-3 bg-surface-raised">
                  <div className="font-bold text-text flex items-center gap-1.5">
                    <span className="text-text font-bold">✓</span> No Session Recording
                  </div>
                  <p className="text-[11px] text-text-muted mt-1">
                    No Hotjar, FullStory, or DOM keylogging tools are integrated into any CRM page.
                  </p>
                </div>
                <div className="border border-border rounded-md p-3 bg-surface-raised">
                  <div className="font-bold text-text flex items-center gap-1.5">
                    <span className="text-text font-bold">✓</span> Local Browser Storage Only
                  </div>
                  <p className="text-[11px] text-text-muted mt-1">
                    State management is confined to memory and local navigation history.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Section 4: System Boundaries & Limitations */}
          <article className="rounded-lg border border-border bg-surface p-6 shadow-card hover:border-border-strong transition-all duration-150">
            <h2 className="text-base font-bold text-text border-b border-border pb-3 flex items-center justify-between">
              <span>4. Technical Scope &amp; Backend Service Boundaries</span>
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Transparency Notice</span>
            </h2>
            <div className="mt-4 space-y-3 text-xs text-text-secondary leading-relaxed">
              <p>
                In the interest of rigorous enterprise transparency, please note the operational boundary of this installation:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-text">
                <li>
                  <strong className="text-text">Active API Surface:</strong> The backend REST service exclusively implements endpoints for CRM workflow operations: <code className="bg-surface-raised text-text px-1 py-0.5 rounded border border-border text-[11px] font-mono">POST /leads</code>, <code className="bg-surface-raised text-text px-1 py-0.5 rounded border border-border text-[11px] font-mono">GET /leads</code>, <code className="bg-surface-raised text-text px-1 py-0.5 rounded border border-border text-[11px] font-mono">PATCH /leads/{'{id}'}</code>, <code className="bg-surface-raised text-text px-1 py-0.5 rounded border border-border text-[11px] font-mono">POST /leads/import</code>, and <code className="bg-surface-raised text-text px-1 py-0.5 rounded border border-border text-[11px] font-mono">GET /metrics</code>.
                </li>
                <li>
                  <strong className="text-text">No Marketing Endpoint:</strong> There is no separate marketing email dispatch service or public inquiry collector. Commercial parts triage inquiries submitted via the form below are processed for demonstration within this client environment and route directly to the confirmation workflow.
                </li>
                <li>
                  <strong className="text-text">Self-Contained Deployment:</strong> To ingest actual customer leads, use the structured Lead Creation form or CSV Import modal located in the working CRM application.
                </li>
              </ul>
            </div>
          </article>

          {/* Demo Inquiry Form Section */}
          <section className="rounded-lg border border-border bg-surface p-6 sm:p-8 shadow-card hover:border-border-strong transition-all duration-150">
            <div className="border-b border-border pb-4 mb-6">
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider bg-surface-raised border border-border px-2.5 py-1 rounded">
                Contact &amp; Evaluation Inquiry
              </span>
              <h2 className="mt-2 text-lg sm:text-xl font-bold text-text">
                Request Commercial Parts Prioritization Consultation
              </h2>
              <p className="mt-1 text-xs text-text-secondary">
                Have questions about deploying PrioritiQ within your dealership or fleet network? Submit an inquiry to experience our priority confirmation workflow.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inquiry-name" className="block text-xs font-bold text-text mb-1">
                    Contact Name <span className="text-text-muted">*</span>
                  </label>
                  <input
                    type="text"
                    id="inquiry-name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full rounded-md border border-input-border px-3 py-2 text-xs text-text bg-input-bg focus:outline-none focus:ring-1 focus:ring-input-focus focus:border-input-focus"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-email" className="block text-xs font-bold text-text mb-1">
                    Work Email <span className="text-text-muted">*</span>
                  </label>
                  <input
                    type="email"
                    id="inquiry-email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="r.patel@logisticsfleet.com"
                    className="w-full rounded-md border border-input-border px-3 py-2 text-xs text-text bg-input-bg focus:outline-none focus:ring-1 focus:ring-input-focus focus:border-input-focus"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inquiry-org" className="block text-xs font-bold text-text mb-1">
                    Organization / Workshop Name <span className="text-text-muted">*</span>
                  </label>
                  <input
                    type="text"
                    id="inquiry-org"
                    name="organization"
                    required
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="e.g. Western Express Logistics"
                    className="w-full rounded-md border border-input-border px-3 py-2 text-xs text-text bg-input-bg focus:outline-none focus:ring-1 focus:ring-input-focus focus:border-input-focus"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-fleet" className="block text-xs font-bold text-text mb-1">
                    Fleet Size / Monthly Volume
                  </label>
                  <select
                    id="inquiry-fleet"
                    name="fleetSize"
                    value={formData.fleetSize}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input-border px-3 py-2 text-xs text-text bg-input-bg focus:outline-none focus:ring-1 focus:ring-input-focus focus:border-input-focus"
                  >
                    <option value="1-10">1 – 10 Vehicles (Small Workshop)</option>
                    <option value="11-50">11 – 50 Vehicles (Regional Fleet)</option>
                    <option value="51-200">51 – 200 Vehicles (Commercial Fleet)</option>
                    <option value="200+">200+ Vehicles (Enterprise Logistics)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="inquiry-message" className="block text-xs font-bold text-text mb-1">
                  Inquiry Message or Parts Dispatch Requirements <span className="text-text-muted">*</span>
                </label>
                <textarea
                  id="inquiry-message"
                  name="inquiry"
                  rows={3}
                  required
                  value={formData.inquiry}
                  onChange={handleChange}
                  placeholder="Detail your fleet downtime challenges, spare parts categories, or integration requirements..."
                  className="w-full rounded-md border border-input-border px-3 py-2 text-xs text-text bg-input-bg focus:outline-none focus:ring-1 focus:ring-input-focus focus:border-input-focus"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-[11px] text-text-muted">
                  <span className="font-semibold text-text font-mono">Privacy Notice:</span> Submission operates within local security boundaries.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-md bg-accent text-accent-contrast hover:bg-accent-hover px-5 py-2 text-xs font-bold shadow-xs focus-ring transition-colors"
                >
                  <span>Submit Inquiry &amp; Verify Triage</span>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>
          </section>

          {/* Direct CTA */}
          <div className="rounded-lg border border-border bg-surface text-text p-6 sm:p-8 sm:flex sm:items-center sm:justify-between gap-6 shadow-card hover:border-border-strong transition-all duration-150">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-text">Ready to Experience the Live Application?</h2>
              <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                Launch the operational CRM workspace to test lead management, priority scoring, overrides, and CSV ingestion directly.
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