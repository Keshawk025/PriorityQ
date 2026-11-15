import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './components/website/HomePage';
import FeaturesPage from './components/website/FeaturesPage';
import HowItWorksPage from './components/website/HowItWorksPage';
import PrivacyPage from './components/website/PrivacyPage';
import ThankYouPage from './components/website/ThankYouPage';
import CrmApp from './components/crm/CrmApp';

export default function App() {
  // Normalize pathname to prevent trailing slash inconsistencies
  const getNormalizedPath = () => {
    if (typeof window === 'undefined') return '/';
    let path = window.location.pathname || '/';
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    return path;
  };

  const [currentPath, setCurrentPath] = useState(getNormalizedPath);

  // Synchronize route state with browser forward/back buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getNormalizedPath());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamically update document title and meta description per route
  useEffect(() => {
    let title = 'PrioritiQ CRM — AI-Powered Spare Parts Lead Prioritization';
    let description =
      'Accelerate automotive spare parts dispatch. Automatically classify inbound parts inquiries with scikit-learn ML, rank emergency breakdown leads, and optimize sales conversions.';

    if (currentPath.startsWith('/app')) {
      title = 'Lead Prioritization CRM — Sales Workspace';
      description =
        'Operational sales workspace for lead triage, ML priority recommendations, manual overrides, CSV batch import, and pipeline analytics.';
    } else if (currentPath === '/features') {
      title = 'Product Features — PrioritiQ Lead Prioritization CRM';
      description =
        'Explore verified CRM features: AI priority classification, 7-field sales intake, lifecycle stage tracking, manual overrides, search, and RFC 4180 CSV batch import.';
    } else if (currentPath === '/how-it-works') {
      title = 'How It Works — ML Inference Pipeline & Prioritization Architecture';
      description =
        'Learn how PrioritiQ processes automotive inquiries: TF-IDF feature extraction, Logistic Regression multi-class classification, and supervised human priority overrides.';
    } else if (currentPath === '/privacy') {
      title = 'Privacy Policy & Security Architecture — PrioritiQ CRM';
      description =
        'Transparent data handling policy: local SQLite persistence, zero third-party telemetry or cloud tracking, and local on-premises scikit-learn model inference.';
    } else if (currentPath === '/thank-you') {
      title = 'Inquiry Received — PrioritiQ Commercial Parts Prioritization';
      description =
        'Thank you for registering your commercial parts inquiry. Test the live lead prioritization CRM directly in your browser.';
    }

    document.title = title;

    // Update or insert meta description tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;
  }, [currentPath]);

  // Client-side router navigation without full page reload
  const navigate = (to) => {
    let target = to;
    if (target.length > 1 && target.endsWith('/')) {
      target = target.slice(0, -1);
    }

    if (target !== getNormalizedPath()) {
      window.history.pushState(null, '', target);
    }
    setCurrentPath(target);
    window.scrollTo(0, 0);
  };

  // Route dispatching
  const renderContent = () => {
    if (currentPath.startsWith('/app')) {
      return <CrmApp onNavigateHome={() => navigate('/')} />;
    }

    if (currentPath === '/features') {
      return <FeaturesPage onNavigate={navigate} />;
    }

    if (currentPath === '/how-it-works') {
      return <HowItWorksPage onNavigate={navigate} />;
    }

    if (currentPath === '/privacy') {
      return <PrivacyPage onNavigate={navigate} />;
    }

    if (currentPath === '/thank-you') {
      return <ThankYouPage onNavigate={navigate} />;
    }

    // Default fallback route is Home Page
    return <HomePage onNavigate={navigate} />;
  };

  return <ThemeProvider>{renderContent()}</ThemeProvider>;
}
