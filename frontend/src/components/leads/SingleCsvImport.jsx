import React, { useState, useRef } from 'react';
import { importLeadsCsvApi, downloadSampleCsv } from '../../services/leadApi';

/**
 * Single CSV Import Button & Confirmation Modal
 *
 * Implements Task 1 requirements:
 * - Native hidden file input (<input type="file" accept=".csv,text/csv">, single select)
 * - Confirmation panel with file name & size before upload
 * - Client-side validation: .csv only, <= 10MB, non-empty
 * - POST /leads/import with loading spinner
 * - Results summary (X imported, Y failed) with expandable list of failed rows
 * - "Download sample CSV" link
 * - Keyboard accessible with aria-labels and visible focus rings
 */
export default function SingleCsvImport({ onImportSuccess, className = '' }) {
  const fileInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [isFailedRowsExpanded, setIsFailedRowsExpanded] = useState(true);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadError(null);
    setImportResult(null);

    // Client-side validation: accepts .csv extension or any CSV/spreadsheet/text MIME type
    const fileName = (file.name || '').toLowerCase();
    const isCsvExtension = fileName.endsWith('.csv') || fileName.endsWith('.tsv') || fileName.endsWith('.txt');
    const isCsvMime = !file.type ||
      file.type.includes('csv') ||
      file.type.includes('excel') ||
      file.type.includes('plain') ||
      file.type.includes('text') ||
      file.type.includes('octet-stream');

    if (!isCsvExtension && !isCsvMime) {
      setValidationError('Invalid file type: Please select a valid CSV file (.csv).');
      setIsOpen(true);
      return;
    }

    if (file.size === 0) {
      setValidationError('Selected file is empty (0 bytes). Please select a valid CSV file containing lead records.');
      setIsOpen(true);
      return;
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_SIZE) {
      setValidationError(`File size exceeds 10 MB limit (${formatFileSize(file.size)}). Please reduce the file size.`);
      setIsOpen(true);
      return;
    }

    setValidationError(null);
    setIsOpen(true);
  };

  const handleImport = async () => {
    if (!selectedFile || validationError) return;

    setIsUploading(true);
    setUploadError(null);
    setImportResult(null);

    try {
      const result = await importLeadsCsvApi(selectedFile);
      setImportResult(result);
      if (onImportSuccess) {
        onImportSuccess(result);
      }
    } catch (err) {
      setUploadError(err.message || 'CSV Import failed. Please verify the file formatting.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedFile(null);
    setValidationError(null);
    setUploadError(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* Hidden Native File Input: Broad CSV and text support across Windows, Mac, and Linux */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv, .CSV, text/csv, application/vnd.ms-excel, text/plain, application/csv, text/x-csv, application/x-csv, text/comma-separated-values, text/x-comma-separated-values, application/octet-stream"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleFileChange}
      />

      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleButtonClick}
        className={`inline-flex items-center gap-1.5 rounded-md border border-border bg-surface text-text hover:bg-surface-hover px-3 py-1.5 text-xs font-semibold focus-ring btn-interactive transition-colors ${className}`}
        aria-label="Import single CSV file"
        title="Import a single CSV file directly"
      >
        <svg className="h-3.5 w-3.5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <span>Import CSV</span>
      </button>

      {/* Confirmation & Status Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="single-csv-modal-title"
        >
          <div
            className="relative my-6 w-full max-w-md rounded-lg bg-surface border border-border shadow-2xl overflow-hidden transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border bg-surface-raised px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-text bg-surface border border-border px-1.5 py-0.5 rounded">
                  CSV
                </span>
                <h3 id="single-csv-modal-title" className="text-sm font-bold text-text">
                  Import CSV File
                </h3>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded p-1 text-text-muted hover:text-text hover:bg-surface focus-ring transition-colors"
                aria-label="Close dialog"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Validation Error */}
              {validationError && (
                <div className="rounded border border-border-strong bg-surface-raised p-3 text-text space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>✕</span>
                    <span>Validation Error</span>
                  </div>
                  <p className="text-text-secondary">{validationError}</p>
                </div>
              )}

              {/* Upload Network/API Error */}
              {uploadError && (
                <div className="rounded border border-border-strong bg-surface-raised p-3 text-text space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>!</span>
                    <span>Upload Failed</span>
                  </div>
                  <p className="text-text-secondary">{uploadError}</p>
                </div>
              )}

              {/* File Information Card (Before Import) */}
              {!importResult && selectedFile && !validationError && (
                <div className="rounded border border-border bg-surface-raised p-3.5 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                    Selected File for Triage
                  </span>
                  <div className="flex items-center justify-between gap-2 border-b border-border-subtle pb-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <svg className="h-4 w-4 text-text shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-mono text-xs font-semibold text-text truncate">
                        {selectedFile.name}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-text-muted shrink-0">
                      {formatFileSize(selectedFile.size)}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    Upon confirmation, every row will be ingested, verified, and scored by the machine learning priority model.
                  </p>
                </div>
              )}

              {/* Import Results View */}
              {importResult && (
                <div className="space-y-3.5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-text">
                      <span>✓</span>
                      <span>Import Completed</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImportResult(null);
                        setSelectedFile(null);
                        handleButtonClick();
                      }}
                      className="text-[11px] text-text-muted hover:text-text underline"
                    >
                      Import Another
                    </button>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded border border-border bg-surface-raised p-2">
                      <span className="block text-[10px] uppercase font-mono text-text-muted">Total</span>
                      <span className="font-mono font-bold text-base text-text">{importResult.total_rows}</span>
                    </div>
                    <div className="rounded border border-border bg-surface-raised p-2">
                      <span className="block text-[10px] uppercase font-mono text-text-muted">Imported</span>
                      <span className="font-mono font-bold text-base text-text">{importResult.imported_count}</span>
                    </div>
                    <div className="rounded border border-border bg-surface-raised p-2">
                      <span className="block text-[10px] uppercase font-mono text-text-muted">Rejected</span>
                      <span className="font-mono font-bold text-base text-text">{importResult.rejected_count}</span>
                    </div>
                  </div>

                  {/* Expandable Failed Rows Section */}
                  {importResult.rejected_rows && importResult.rejected_rows.length > 0 && (
                    <div className="rounded border border-border bg-surface-raised overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setIsFailedRowsExpanded(!isFailedRowsExpanded)}
                        className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-bold text-text bg-surface-raised hover:bg-surface-hover border-b border-border transition-colors text-left"
                      >
                        <span className="flex items-center gap-1.5">
                          <span>!</span>
                          <span>Failed Rows Diagnostics ({importResult.rejected_rows.length})</span>
                        </span>
                        <span>{isFailedRowsExpanded ? '▲' : '▼'}</span>
                      </button>

                      {isFailedRowsExpanded && (
                        <div className="max-h-40 overflow-y-auto divide-y divide-border-subtle bg-surface">
                          <table className="min-w-full text-left text-[11px]">
                            <thead className="bg-surface-raised text-text-muted text-[10px] uppercase font-mono">
                              <tr>
                                <th className="px-2.5 py-1">Row</th>
                                <th className="px-2.5 py-1">Lead ID</th>
                                <th className="px-2.5 py-1">Reason</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                              {importResult.rejected_rows.map((row, idx) => (
                                <tr key={idx} className="hover:bg-surface-raised/50">
                                  <td className="px-2.5 py-1 font-mono font-bold text-text">{row.row_number}</td>
                                  <td className="px-2.5 py-1 font-mono text-text-secondary">{row.lead_id || '—'}</td>
                                  <td className="px-2.5 py-1 text-text-muted">{row.reason}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Sample CSV Download Helper */}
              <div className="flex items-center justify-between pt-1 border-t border-border-subtle text-[11px]">
                <span className="text-text-muted">Need the proper format?</span>
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
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-end gap-2 border-t border-border bg-surface-raised px-5 py-3">
              {importResult ? (
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-md bg-accent text-accent-contrast hover:bg-accent-hover px-4 py-1.5 text-xs font-bold focus-ring btn-interactive transition-colors"
                >
                  Done
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isUploading}
                    className="rounded-md border border-border bg-surface hover:bg-surface-hover text-text px-3 py-1.5 text-xs font-semibold focus-ring btn-interactive transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleImport}
                    disabled={isUploading || !selectedFile || !!validationError}
                    className="inline-flex items-center gap-1.5 rounded-md bg-accent text-accent-contrast hover:bg-accent-hover px-4 py-1.5 text-xs font-bold focus-ring btn-interactive transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <>
                        <svg className="h-3.5 w-3.5 animate-spin text-accent-contrast" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Importing Leads...</span>
                      </>
                    ) : (
                      <span>Import</span>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
