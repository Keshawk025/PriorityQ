import React from 'react';
import HomePage from '../website/HomePage';

export default function LandingPage({ onLaunchMvp }) {
  return <HomePage onNavigate={(path) => { if (path === '/app' && onLaunchMvp) onLaunchMvp(); }} />;
}