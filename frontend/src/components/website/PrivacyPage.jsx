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
    <div className="min-h-screen bg-[#F3F6FA] dark:bg-[#0B132B] text-[#172438] dark:text-[#F8FAFC] flex flex-col font-sans">
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
        <section className="bg-white dark:bg-[#0F172A] border-b border-[#DCE4EE] dark:border-[#26354D] py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3678D4] dark:text-[#60A5FA] bg-[#E9EFF8] dark:bg-[#1E293B] border border-[#3678D4]/20 dark:border-[#3678D4]/40 px-2.5 py-1 rounded-md">
              Data Protection &amp; Governance
            </span>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#173B67] dark:text-white tracking-tight">
              Privacy Policy &amp; Security Architecture
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed max-w-3xl">
              Transparent disclosure of data handling, on-premises storage architecture, ML inference privacy,
              and application scope for the AI Lead Prioritization CRM.
            </p>
            <div className="mt-3 text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              Last updated: November 2026 • Policy Version 1.2 • Autonomous Enterprise Deployment
            </div>
          </div>
        </section>

        {/* Core Policy Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          
          {/* Key Principles Callout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-5 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="h-8 w-8 rounded bg-[#E9EFF8] dark:bg-[#1E293B] text-[#3678D4] dark:text-[#60A5FA] flex items-center justify-center font-bold text-sm mb-3 font-mono">
                01
              </div>
              <h2 className="text-sm font-bold text-[#173B67] dark:text-white">Local Data Ownership</h2>
              <p className="mt-1.5 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                All lead records, customer inquiries, and priority history are stored in your local SQLite database instance. Data never leaves your infrastructure.
              </p>
            </div>

            <div className="rounded-lg border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-5 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="h-8 w-8 rounded bg-[#ECFDF5] dark:bg-[#064E3B]/40 text-[#059669] dark:text-[#34D399] flex items-center justify-center font-bold text-sm mb-3 font-mono">
                02
              </div>
              <h2 className="text-sm font-bold text-[#173B67] dark:text-white">Zero Cloud Telemetry</h2>
              <p className="mt-1.5 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                No third-party tracking pixels, external analytics beacons, or behavioral monitoring scripts run in this CRM deployment.
              </p>
            </div>

            <div className="rounded-lg border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-5 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="h-8 w-8 rounded bg-[#FEF2F2] dark:bg-[#7F1D1D]/40 text-[#DC2626] dark:text-[#F87171] flex items-center justify-center font-bold text-sm mb-3 font-mono">
                03
              </div>
              <h2 className="text-sm font-bold text-[#173B67] dark:text-white">On-Premises ML Inference</h2>
              <p className="mt-1.5 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Inference runs locally using serialized scikit-learn models. Inbound text is never forwarded to external commercial LLM APIs.
              </p>
            </div>
          </div>

          {/* Section 1: Data Collection & Storage */}
          <article className="rounded-lg border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-6 shadow-card">
            <h2 className="text-base font-bold text-[#173B67] dark:text-white border-b border-[#DCE4EE] dark:border-[#26354D] pb-3 flex items-center justify-between">
              <span>1. Data Collection &amp; Local Persistence</span>
              <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Architecture</span>
            </h2>
            <div className="mt-4 space-y-3 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              <p>
                When utilizing the AI Lead Prioritization CRM, the system captures commercial sales information necessary to triage and fulfill automotive spare parts inquiries:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#172438] dark:text-[#E2E8F0]">
                <li><strong className="text-[#173B67] dark:text-[#93C5FD]">Commercial Identifier:</strong> Lead ID (unique string token for tracking inquiries).</li>
                <li><strong className="text-[#173B67] dark:text-[#93C5FD]">Acquisition Source:</strong> Source channel (e.g. Website, Phone Inquiry, WhatsApp, Field Sales).</li>
                <li><strong className="text-[#173B67] dark:text-[#93C5FD]">Customer Classification:</strong> Fleet Owner, Independent Workshop, Retail Buyer, or Dealership.</li>
                <li><strong className="text-[#173B67] dark:text-[#93C5FD]">Operational Context:</strong> Vehicle Model, Part Needed, Estimated Order Value (INR), and Inbound Inquiry Message.</li>
              </ul>
              <p>
                All captured records are committed directly to a local embedded database engine (<code className="bg-[#F3F6FA] dark:bg-[#0F172A] text-[#173B67] dark:text-[#93C5FD] px-1 py-0.5 rounded border border-[#DCE4EE] dark:border-[#26354D] text-[11px] font-mono">backend/lead_crm.db</code>). At no point does the application transmit customer order records to external clouds, multi-tenant databases, or centralized repositories.
              </p>
            </div>
          </article>

          {/* Section 2: Machine Learning Privacy & Processing */}
          <article className="rounded-lg border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-6 shadow-card">
            <h2 className="text-base font-bold text-[#173B67] dark:text-white border-b border-[#DCE4EE] dark:border-[#26354D] pb-3 flex items-center justify-between">
              <span>2. Machine Learning Inference Privacy</span>
              <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Algorithms</span>
            </h2>
            <div className="mt-4 space-y-3 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              <p>
                Automated lead classification is performed entirely by a local scikit-learn pipeline (<code className="bg-[#F3F6FA] dark:bg-[#0F172A] text-[#173B67] dark:text-[#93C5FD] px-1 py-0.5 rounded border border-[#DCE4EE] dark:border-[#26354D] text-[11px] font-mono">backend/ml_models/lead_priority_model.pkl</code>) running inside the local FastAPI runtime:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#172438] dark:text-[#E2E8F0]">
                <li><strong className="text-[#173B67] dark:text-[#93C5FD]">Local Vectorization:</strong> Unstructured customer messages are parsed using a local TF-IDF vectorizer.</li>
                <li><strong className="text-[#173B67] dark:text-[#93C5FD]">Deterministic Scoring:</strong> A local Logistic Regression classification model calculates class probabilities without external API calls.</li>
                <li><strong className="text-[#173B67] dark:text-[#93C5FD]">No Model Retraining on User Input:</strong> Customer messages are not used to retrain external public models, eliminating data leakage risks.</li>
                <li><strong className="text-[#173B67] dark:text-[#93C5FD]">Audit Trail Retention:</strong> Predicted priority and confidence percentages are stored permanently as read-only audit records to verify algorithmic fairness.</li>
              </ul>
            </div>
          </article>

          {/* Section 3: Third-Party Tracking & Web Beacons */}
          <article className="rounded-lg border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-6 shadow-card">
            <h2 className="text-base font-bold text-[#173B67] dark:text-white border-b border-[#DCE4EE] dark:border-[#26354D] pb-3 flex items-center justify-between">
              <span>3. Zero Third-Party Tracking &amp; Analytics Disclosure</span>
              <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Compliance</span>
            </h2>
            <div className="mt-4 space-y-3 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              <p>
                The AI Lead Prioritization CRM does not implement any third-party tracking technologies:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="border border-[#DCE4EE] dark:border-[#26354D] rounded-md p-3 bg-[#F3F6FA] dark:bg-[#0F172A]">
                  <div className="font-bold text-[#173B67] dark:text-[#F8FAFC] flex items-center gap-1.5">
                    <span className="text-[#059669] dark:text-[#34D399] font-bold">✓</span> No Advertising Pixels
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">
                    Zero Meta Pixel, LinkedIn Insight Tag, Google Ads or affiliate marketing cookies.
                  </p>
                </div>
                <div className="border border-[#DCE4EE] dark:border-[#26354D] rounded-md p-3 bg-[#F3F6FA] dark:bg-[#0F172A]">
                  <div className="font-bold text-[#173B67] dark:text-[#F8FAFC] flex items-center gap-1.5">
                    <span className="text-[#059669] dark:text-[#34D399] font-bold">✓</span> No External Analytics
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">
                    Google Analytics is currently disabled. No tracking scripts or device fingerprints are deployed.
                  </p>
                </div>
                <div className="border border-[#DCE4EE] dark:border-[#26354D] rounded-md p-3 bg-[#F3F6FA] dark:bg-[#0F172A]">
                  <div className="font-bold text-[#173B67] dark:text-[#F8FAFC] flex items-center gap-1.5">
                    <span className="text-[#059669] dark:text-[#34D399] font-bold">✓</span> No Session Recording
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">
                    No Hotjar, FullStory, or DOM keylogging tools are integrated into any CRM page.
                  </p>
                </div>
                <div className="border border-[#DCE4EE] dark:border-[#26354D] rounded-md p-3 bg-[#F3F6FA] dark:bg-[#0F172A]">
                  <div className="font-bold text-[#173B67] dark:text-[#F8FAFC] flex items-center gap-1.5">
                    <span className="text-[#059669] dark:text-[#34D399] font-bold">✓</span> Local Browser Storage Only
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">
                    State management is confined to memory and local navigation history.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Section 4: System Boundaries & Limitations */}
          <article className="rounded-lg border border-[#FCD34D] dark:border-[#D97706]/50 bg-[#FFFBEB] dark:bg-[#78350F]/20 p-6 shadow-card">
            <h2 className="text-base font-bold text-[#D97706] dark:text-[#FBBF24] border-b border-[#FCD34D] dark:border-[#D97706]/40 pb-3 flex items-center justify-between">
              <span>4. Technical Scope &amp; Backend Service Boundaries</span>
              <span className="text-[10px] font-bold text-[#D97706] dark:text-[#FBBF24] uppercase tracking-wider">Transparency Notice</span>
            </h2>
            <div className="mt-4 space-y-3 text-xs text-[#172438] dark:text-[#F8FAFC] leading-relaxed">
              <p>
                In the interest of rigorous enterprise transparency, please note the operational boundary of this installation:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#172438] dark:text-[#E2E8F0]">
                <li>
                  <strong className="text-[#173B67] dark:text-[#93C5FD]">Active API Surface:</strong> The backend REST service exclusively implements endpoints for CRM workflow operations: <code className="bg-white/80 dark:bg-[#0F172A] text-[#172438] dark:text-[#F8FAFC] px-1 py-0.5 rounded border border-[#FCD34D] dark:border-[#D97706]/50 text-[11px] font-mono">POST /leads</code>, <code className="bg-white/80 dark:bg-[#0F172A] text-[#172438] dark:text-[#F8FAFC] px-1 py-0.5 rounded border border-[#FCD34D] dark:border-[#D97706]/50 text-[11px] font-mono">GET /leads</code>, <code className="bg-white/80 dark:bg-[#0F172A] text-[#172438] dark:text-[#F8FAFC] px-1 py-0.5 rounded border border-[#FCD34D] dark:border-[#D97706]/50 text-[11px] font-mono">PATCH /leads/{'{id}'}</code>, <code className="bg-white/80 dark:bg-[#0F172A] text-[#172438] dark:text-[#F8FAFC] px-1 py-0.5 rounded border border-[#FCD34D] dark:border-[#D97706]/50 text-[11px] font-mono">POST /leads/import</code>, and <code className="bg-white/80 dark:bg-[#0F172A] text-[#172438] dark:text-[#F8FAFC] px-1 py-0.5 rounded border border-[#FCD34D] dark:border-[#D97706]/50 text-[11px] font-mono">GET /metrics</code>.
                </li>
                <li>
                  <strong className="text-[#173B67] dark:text-[#93C5FD]">No Marketing Endpoint:</strong> There is no separate marketing email dispatch service or public inquiry collector. Commercial parts triage inquiries submitted via the form below are processed for demonstration within this client environment and route directly to the confirmation workflow.
                </li>
                <li>
                  <strong className="text-[#173B67] dark:text-[#93C5FD]">Self-Contained Deployment:</strong> To ingest actual customer leads, use the structured Lead Creation form or RFC 4180 CSV Import modal located in the working CRM application.
                </li>
              </ul>
            </div>
          </article>

          {/* Demo Inquiry Form Section */}
          <section className="rounded-lg border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-6 sm:p-8 shadow-card">
            <div className="border-b border-[#DCE4EE] dark:border-[#26354D] pb-4 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3678D4] dark:text-[#60A5FA] bg-[#E9EFF8] dark:bg-[#1E293B] border border-[#3678D4]/20 dark:border-[#3678D4]/40 px-2.5 py-1 rounded">
                Contact &amp; Evaluation Inquiry
              </span>
              <h2 className="mt-2 text-lg sm:text-xl font-bold text-[#173B67] dark:text-white">
                Request Commercial Parts Prioritization Consultation
              </h2>
              <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
                Have questions about deploying PrioritiQ within your dealership or fleet network? Submit an inquiry to experience our priority confirmation workflow.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inquiry-name" className="block text-xs font-bold text-[#172438] dark:text-[#E2E8F0] mb-1">
                    Contact Name <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    id="inquiry-name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full rounded-md border border-[#DCE4EE] dark:border-[#26354D] px-3 py-2 text-xs text-[#172438] dark:text-[#F8FAFC] bg-white dark:bg-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#3678D4] focus:border-[#3678D4]"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-email" className="block text-xs font-bold text-[#172438] dark:text-[#E2E8F0] mb-1">
                    Work Email <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="email"
                    id="inquiry-email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="r.patel@logisticsfleet.com"
                    className="w-full rounded-md border border-[#DCE4EE] dark:border-[#26354D] px-3 py-2 text-xs text-[#172438] dark:text-[#F8FAFC] bg-white dark:bg-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#3678D4] focus:border-[#3678D4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inquiry-org" className="block text-xs font-bold text-[#172438] dark:text-[#E2E8F0] mb-1">
                    Organization / Workshop Name <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    id="inquiry-org"
                    name="organization"
                    required
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="e.g. Western Express Logistics"
                    className="w-full rounded-md border border-[#DCE4EE] dark:border-[#26354D] px-3 py-2 text-xs text-[#172438] dark:text-[#F8FAFC] bg-white dark:bg-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#3678D4] focus:border-[#3678D4]"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-fleet" className="block text-xs font-bold text-[#172438] dark:text-[#E2E8F0] mb-1">
                    Fleet Size / Monthly Volume
                  </label>
                  <select
                    id="inquiry-fleet"
                    name="fleetSize"
                    value={formData.fleetSize}
                    onChange={handleChange}
                    className="w-full rounded-md border border-[#DCE4EE] dark:border-[#26354D] px-3 py-2 text-xs text-[#172438] dark:text-[#F8FAFC] bg-white dark:bg-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#3678D4] focus:border-[#3678D4]"
                  >
                    <option value="1-10">1 – 10 Vehicles (Small Workshop)</option>
                    <option value="11-50">11 – 50 Vehicles (Regional Fleet)</option>
                    <option value="51-200">51 – 200 Vehicles (Commercial Fleet)</option>
                    <option value="200+">200+ Vehicles (Enterprise Logistics)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="inquiry-message" className="block text-xs font-bold text-[#172438] dark:text-[#E2E8F0] mb-1">
                  Inquiry Message or Parts Dispatch Requirements <span className="text-[#DC2626]">*</span>
                </label>
                <textarea
                  id="inquiry-message"
                  name="inquiry"
                  rows={3}
                  required
                  value={formData.inquiry}
                  onChange={handleChange}
                  placeholder="Detail your fleet downtime challenges, spare parts categories, or integration requirements..."
                  className="w-full rounded-md border border-[#DCE4EE] dark:border-[#26354D] px-3 py-2 text-xs text-[#172438] dark:text-[#F8FAFC] bg-white dark:bg-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#3678D4] focus:border-[#3678D4]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                  <span className="font-semibold text-[#173B67] dark:text-[#93C5FD]">Privacy Notice:</span> Submission operates within local security boundaries.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[#3678D4] hover:bg-[#2A62B6] text-white px-5 py-2 text-xs font-semibold shadow-btn btn-interactive transition-all"
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
          <div className="rounded-lg border border-[#DCE4EE] dark:border-[#26354D] bg-[#173B67] dark:bg-[#1E293B] text-white p-6 sm:p-8 sm:flex sm:items-center sm:justify-between gap-6 shadow-card">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Ready to Experience the Live Application?</h2>
              <p className="mt-1 text-xs text-[#E9EFF8]/80 dark:text-[#94A3B8] leading-relaxed">
                Launch the operational CRM workspace to test lead management, priority scoring, overrides, and CSV ingestion directly.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLaunch}
              className="mt-4 sm:mt-0 shrink-0 inline-flex items-center gap-1.5 rounded-md bg-[#3678D4] hover:bg-[#2A62B6] text-white px-5 py-2.5 text-xs font-semibold shadow-btn btn-interactive transition-all"
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
