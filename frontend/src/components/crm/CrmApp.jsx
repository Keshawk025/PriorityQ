import React, { useState } from 'react';
import Layout from '../layout/Layout';
import DashboardShell from '../dashboard/DashboardShell';
import CsvImportModal from '../leads/CsvImportModal';

export default function CrmApp({ onNavigateHome }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDataChanged = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Layout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onOpenCsvImport={() => setIsCsvModalOpen(true)}
      onNavigateHome={onNavigateHome}
    >
      <DashboardShell
        activeTab={activeTab}
        refreshTrigger={refreshTrigger}
        onDataChanged={handleDataChanged}
        onOpenCsvImport={() => setIsCsvModalOpen(true)}
      />

      {/* CSV Bulk Import Modal */}
      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onImportSuccess={() => {
          handleDataChanged();
        }}
      />
    </Layout>
  );
}
