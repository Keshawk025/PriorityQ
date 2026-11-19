import React, { useState, useRef } from 'react';
import { importLeadsCsvApi, downloadSampleCsv } from '../../services/leadApi';

/**
 * Multi-File Bulk CSV Import Modal
 *
 * Implements Task 1 requirements:
 * - Multi-file selection and drag & drop support
 * - Visual file queue with per-file status (Pending, Uploading, Done, Error)
 * - Sequential batch processing via POST /leads/import
 * - Per-file and per-row error diagnostics (expandable rejected rows)
 * - "Download sample CSV" link
 * - AMOLED Pure Black & White theme (Task 2)
 */
export default function CsvImportModal({ isOpen, onClose, onImportSuccess }) {
  const [fileQueue, setFileQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [queueError, setQueueError] = useState(null);
  const [expandedFileIdx, setExpandedFileIdx] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const validateFile = (file) => {
    const isCsvExtension = file.name.toLowerCase().endsWith('.csv');
    const isCsvMime = !file.type || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel';

    if (!isCsvExtension && !isCsvMime) {
      return 'Not a valid CSV file (.csv)';
    }
    if (file.size === 0) {
      return 'File is empty (0 bytes)';
    }
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_SIZE) {
      return `File exceeds 10 MB limit (${formatFileSize(file.size)})`;
    }
    return null;
  };

  const addFilesToQueue = (newFiles) => {
    if (!newFiles || newFiles.length === 0) return;

    const added = Array.from(newFiles).map((file) => {
      const error = validateFile(file);
      return {
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        status: error ? 'invalid' : 'pending',
        error,
        result: null,
      };
    });

    setFileQueue((prev) => [...prev, ...added]);
    setQueueError(null);
  };

  const handleFileInputChange = (e) => {
    addFilesToQueue(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files?.length > 0) {
      addFilesToQueue(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (id) => {
    if (isProcessing) return;
    setFileQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const handleProcessQueue = async () => {
    const eligibleItems = fileQueue.filter((item) => item.status === 'pending');
    if (eligibleItems.length === 0) {
      setQueueError('No valid pending CSV files to upload.');
      return;
    }

    setIsProcessing(true);
    setQueueError(null);
    let anySuccess = false;

    for (let i = 0; i < fileQueue.length; i++) {
      const item = fileQueue[i];
      if (item.status !== 'pending') continue;

      setCurrentIndex(i);
      setFileQueue((prev) =>
        prev.map((it, idx) => (idx === i ? { ...it, status: 'uploading' } : it))
      );

      try {
        const result = await importLeadsCsvApi(item.file);
        setFileQueue((prev) =>
          prev.map((it, idx) =>
            idx === i ? { ...it, status: 'done', result, error: null } : it
          )
        );
        if (result.imported_count > 0) {
          anySuccess = true;
        }
      } catch (err) {
        setFileQueue((prev) =>
          prev.map((it, idx) =>
            idx === i
              ? { ...it, status: 'error', error: err.message || 'Import failed' }
              : it
          )
        );
      }
    }

    setIsProcessing(false);
    setCurrentIndex(-1);

    if (anySuccess && onImportSuccess) {
      onImportSuccess();
    }
  };

  const handleClearAll = () => {
    if (isProcessing) return;
    setFileQueue([]);
    setQueueError(null);
    setExpandedFileIdx(null);
  };

  const pendingCount = fileQueue.filter((f) => f.status === 'pending').length;
  const completedCount = fileQueue.filter((f) => f.status === 'done').length;
  const failedCount = fileQueue.filter((f) => f.status === 'error' || f.status === 'invalid').length;
  const totalImportedRows = fileQueue.reduce((acc, f) => acc + (f.result?.imported_count || 0), 0);
  const totalRejectedRows = fileQueue.reduce((acc, f) => acc + (f.result?.rejected_count || 0), 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-csv-modal-title"
    >
      <div
        className="relative my-6 w-full max-w-2xl rounded-lg bg-surface border border-border shadow-2xl overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border bg-surface-raised px-5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-text bg-surface border border-border px-1.5 py-0.5 rounded">
              BATCH
            </span>
            <div>
              <h3 id="bulk-csv-modal-title" className="text-sm font-bold text-text">
                Bulk Import Leads (Multi-CSV)
              </h3>
              <p className="text-[11px] text-text-muted">
                Queue and upload multiple RFC 4180 CSV files with automated scoring
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-text-muted hover:text-text hover:bg-surface focus-ring transition-colors"
            aria-label="Close dialog"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Error Banner */}
          {queueError && (
            <div className="rounded border border-border-strong bg-surface-raised p-3 text-text space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <span>!</span>
                <span>Import Notice</span>
              </div>
              <p className="text-text-secondary">{queueError}</p>
            </div>
          )}

          {/* Drag & Drop File Intake Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="rounded-md border border-dashed border-border-strong bg-surface-raised p-5 text-center hover:border-text-secondary transition-colors"
          >
            <svg className="mx-auto h-8 w-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="mt-2">
              <label
                htmlFor="bulk-csv-input"
                className="cursor-pointer font-bold text-xs text-text underline hover:text-text-secondary focus-ring rounded"
              >
                <span>Select multiple CSV files</span>
                <input
                  id="bulk-csv-input"
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".csv,text/csv"
                  onChange={handleFileInputChange}
                  disabled={isProcessing}
                  className="sr-only"
                />
              </label>
              <span className="text-text-muted"> or drag &amp; drop multiple files here</span>
            </div>
            <p className="mt-1 text-[11px] text-text-muted font-mono">
              RFC 4180 format • Up to 10 MB per file
            </p>
          </div>

          {/* Sample CSV Download Helper */}
          <div className="flex items-center justify-between border-t border-b border-border-subtle py-2 text-[11px]">
            <span className="text-text-muted">Expected 7-field structure</span>
            <button
              type="button"
              onClick={downloadSampleCsv}
              className="font-medium text-text hover:underline inline-flex items-center gap-1 focus-ring rounded"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download sample CSV</span>
            </button>
          </div>

          {/* Overall Batch Status Summary (when processing or completed) */}
          {(completedCount > 0 || totalRejectedRows > 0) && (
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="rounded border border-border bg-surface-raised p-2">
                <span className="block text-[10px] uppercase font-mono text-text-muted">Files</span>
                <span className="font-mono font-bold text-sm text-text">
                  {completedCount} / {fileQueue.length}
                </span>
              </div>
              <div className="rounded border border-border bg-surface-raised p-2">
                <span className="block text-[10px] uppercase font-mono text-text-muted">Imported</span>
                <span className="font-mono font-bold text-sm text-text">{totalImportedRows}</span>
              </div>
              <div className="rounded border border-border bg-surface-raised p-2">
                <span className="block text-[10px] uppercase font-mono text-text-muted">Rejected</span>
                <span className="font-mono font-bold text-sm text-text">{totalRejectedRows}</span>
              </div>
              <div className="rounded border border-border bg-surface-raised p-2">
                <span className="block text-[10px] uppercase font-mono text-text-muted">Failed Files</span>
                <span className="font-mono font-bold text-sm text-text">{failedCount}</span>
              </div>
            </div>
          )}

          {/* File Queue Section */}
          {fileQueue.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  File Queue ({fileQueue.length})
                </span>
                {!isProcessing && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-[11px] text-text-muted hover:text-text underline"
                  >
                    Clear Queue
                  </button>
                )}
              </div>

              <div className="divide-y divide-border border border-border rounded-md bg-surface overflow-hidden">
                {fileQueue.map((item, idx) => {
                  const isExpanded = expandedFileIdx === idx;
                  const hasDiagnostics = item.result?.rejected_rows?.length > 0;

                  return (
                    <div key={item.id} className="p-3 hover:bg-surface-raised/40 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        {/* File Name & Size */}
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="font-mono text-[10px] text-text-muted">#{idx + 1}</span>
                          <span className="font-mono text-xs font-semibold text-text truncate max-w-[200px] sm:max-w-xs">
                            {item.name}
                          </span>
                          <span className="font-mono text-[10px] text-text-muted shrink-0">
                            ({formatFileSize(item.size)})
                          </span>
                        </div>

                        {/* Status Badge & Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {item.status === 'pending' && (
                            <span className="border border-border text-text-muted px-2 py-0.5 rounded text-[10px] font-mono">
                              Pending
                            </span>
                          )}

                          {item.status === 'uploading' && (
                            <span className="inline-flex items-center gap-1 border border-border bg-surface-raised px-2 py-0.5 rounded text-[10px] font-mono text-text">
                              <svg className="h-3 w-3 animate-spin text-text" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span>Processing...</span>
                            </span>
                          )}

                          {item.status === 'done' && (
                            <span className="border border-border bg-surface-raised px-2 py-0.5 rounded text-[10px] font-mono text-text font-bold">
                              ✓ {item.result?.imported_count} imported
                              {item.result?.rejected_count > 0 && `, ${item.result?.rejected_count} rejected`}
                            </span>
                          )}

                          {item.status === 'invalid' && (
                            <span className="border border-border-strong bg-surface-raised px-2 py-0.5 rounded text-[10px] font-mono text-text">
                              ✕ {item.error}
                            </span>
                          )}

                          {item.status === 'error' && (
                            <span className="border border-border-strong bg-surface-raised px-2 py-0.5 rounded text-[10px] font-mono text-text">
                              ✕ {item.error}
                            </span>
                          )}

                          {/* Expand Diagnostics Button */}
                          {hasDiagnostics && (
                            <button
                              type="button"
                              onClick={() => setExpandedFileIdx(isExpanded ? null : idx)}
                              className="text-[10px] font-mono underline text-text-muted hover:text-text px-1"
                            >
                              {isExpanded ? 'Hide Errors' : `View ${item.result.rejected_rows.length} Errors`}
                            </button>
                          )}

                          {/* Remove Item */}
                          {!isProcessing && (
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(item.id)}
                              className="text-text-muted hover:text-text p-0.5 rounded"
                              aria-label={`Remove ${item.name}`}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expandable Per-Row Diagnostics for This File */}
                      {isExpanded && hasDiagnostics && (
                        <div className="mt-2.5 rounded border border-border bg-surface p-2 text-[11px] animate-fade-in">
                          <span className="font-bold text-text block mb-1">
                            Diagnostics for {item.name}:
                          </span>
                          <div className="max-h-32 overflow-y-auto">
                            <table className="min-w-full text-left text-[11px]">
                              <thead className="text-[10px] uppercase text-text-muted font-mono border-b border-border">
                                <tr>
                                  <th className="px-2 py-1">Row</th>
                                  <th className="px-2 py-1">Lead ID</th>
                                  <th className="px-2 py-1">Reason</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border-subtle">
                                {item.result.rejected_rows.map((rej, rIdx) => (
                                  <tr key={rIdx}>
                                    <td className="px-2 py-1 font-mono font-bold text-text">{rej.row_number}</td>
                                    <td className="px-2 py-1 font-mono text-text-secondary">{rej.lead_id || '—'}</td>
                                    <td className="px-2 py-1 text-text-muted">{rej.reason}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between border-t border-border bg-surface-raised px-5 py-3">
          <span className="text-[11px] font-mono text-text-muted">
            {pendingCount > 0 ? `${pendingCount} file(s) ready` : 'Queue empty or completed'}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="rounded-md border border-border bg-surface hover:bg-surface-hover text-text px-3 py-1.5 text-xs font-semibold focus-ring btn-interactive transition-colors disabled:opacity-50"
            >
              {completedCount > 0 && pendingCount === 0 ? 'Close' : 'Cancel'}
            </button>

            {pendingCount > 0 && (
              <button
                type="button"
                onClick={handleProcessQueue}
                disabled={isProcessing || pendingCount === 0}
                className="inline-flex items-center gap-1.5 rounded-md bg-accent text-accent-contrast hover:bg-accent-hover px-4 py-1.5 text-xs font-bold focus-ring btn-interactive transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <svg className="h-3.5 w-3.5 animate-spin text-accent-contrast" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>
                      Uploading {currentIndex >= 0 ? `#${currentIndex + 1}` : ''}...
                    </span>
                  </>
                ) : (
                  <span>Upload All Files ({pendingCount})</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
