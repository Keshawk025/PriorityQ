import React, { useState, useRef } from 'react';
import { importLeadsCsvApi } from '../../services/leadApi';

export default function CsvImportModal({ isOpen, onClose, onImportSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.csv')) {
        setErrorMsg('Please select a valid CSV file (.csv).');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setErrorMsg(null);
      setImportResult(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select a CSV file to upload.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    setImportResult(null);

    try {
      const result = await importLeadsCsvApi(selectedFile);
      setImportResult(result);
      if (onImportSuccess) {
        onImportSuccess(result);
      }
    } catch (err) {
      setErrorMsg(err.message || 'CSV Import failed. Please check file formatting.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setErrorMsg(null);
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto backdrop-blur-xs transition-colors"
      onClick={onClose}
    >
      <div
        className="relative my-6 w-full max-w-lg rounded-md bg-white dark:bg-[#162032] border border-[#DCE4EE] dark:border-[#26354D] shadow-xl overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#DCE4EE] dark:border-[#26354D] bg-[#F3F6FA] dark:bg-[#0F172A] px-5 py-3 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#173B67] dark:bg-[#3678D4] text-white font-medium text-xs shadow-xs">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#173B67] dark:text-[#F8FAFC]">Bulk Import Leads via CSV</h3>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Automated RFC 4180 validation &amp; priority classification</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E9EFF8] dark:hover:bg-[#1E293B] hover:text-[#172438] dark:hover:text-[#F8FAFC] transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {/* Error Alert */}
          {errorMsg && (
            <div className="rounded border border-[#FCA5A5] dark:border-red-800 bg-[#FEF2F2] dark:bg-red-950/40 p-3 text-xs text-[#DC2626] dark:text-red-400 flex items-start gap-2">
              <svg className="h-4 w-4 shrink-0 text-[#DC2626] dark:text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold">Import Error</p>
                <p className="mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Import Result Summary */}
          {importResult && (
            <div className="rounded border border-[#DCE4EE] dark:border-[#26354D] bg-[#F3F6FA] dark:bg-[#0F172A] p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#173B67] dark:text-[#F8FAFC]">
                  Import Summary
                </h4>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-semibold text-[#3678D4] dark:text-[#60A5FA] hover:text-[#2A62B6] dark:hover:text-[#93C5FD] underline"
                >
                  Upload Another File
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded bg-white dark:bg-[#162032] p-2 border border-[#DCE4EE] dark:border-[#26354D]">
                  <span className="text-[#64748B] dark:text-[#94A3B8] block text-[10px] uppercase font-mono">Total Rows</span>
                  <span className="font-mono font-bold text-sm text-[#172438] dark:text-[#F8FAFC]">{importResult.total_rows}</span>
                </div>
                <div className="rounded bg-[#ECFDF5] dark:bg-[#064E3B]/30 p-2 border border-[#6EE7B7] dark:border-[#059669]/50">
                  <span className="text-[#059669] dark:text-[#34D399] block text-[10px] uppercase font-mono font-bold">Imported</span>
                  <span className="font-mono font-bold text-sm text-[#059669] dark:text-[#34D399]">{importResult.imported_count}</span>
                </div>
                <div className="rounded bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 p-2 border border-[#FCA5A5] dark:border-[#DC2626]/50">
                  <span className="text-[#DC2626] dark:text-[#F87171] block text-[10px] uppercase font-mono font-bold">Rejected</span>
                  <span className="font-mono font-bold text-sm text-[#DC2626] dark:text-[#F87171]">{importResult.rejected_count}</span>
                </div>
              </div>

              {/* Rejected Rows Table */}
              {importResult.rejected_rows && importResult.rejected_rows.length > 0 && (
                <div className="mt-2.5">
                  <span className="text-[11px] font-bold text-[#DC2626] dark:text-[#F87171] block uppercase mb-1">
                    Rejected Rows ({importResult.rejected_rows.length})
                  </span>
                  <div className="max-h-36 overflow-y-auto rounded border border-[#FCA5A5] dark:border-red-800 bg-white dark:bg-[#162032]">
                    <table className="min-w-full text-left text-[11px]">
                      <thead className="bg-[#FEF2F2] dark:bg-red-950/40 text-[#DC2626] dark:text-red-400 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="px-2.5 py-1">Row</th>
                          <th className="px-2.5 py-1">Lead ID</th>
                          <th className="px-2.5 py-1">Reason</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#FCA5A5]/30 dark:divide-red-800/30">
                        {importResult.rejected_rows.map((rej, idx) => (
                          <tr key={idx} className="hover:bg-[#FEF2F2]/40 dark:hover:bg-red-950/20">
                            <td className="px-2.5 py-1 font-mono font-bold text-[#172438] dark:text-[#F8FAFC]">{rej.row_number}</td>
                            <td className="px-2.5 py-1 font-mono font-medium text-[#172438] dark:text-[#F8FAFC]">{rej.lead_id || '—'}</td>
                            <td className="px-2.5 py-1 text-[#64748B] dark:text-[#94A3B8]">{rej.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload Form */}
          {!importResult && (
            <form onSubmit={handleUpload} className="space-y-3">
              <div className="rounded border border-dashed border-slate-300 dark:border-slate-700 p-5 text-center hover:border-slate-400 dark:hover:border-slate-500 transition-colors bg-slate-50/50 dark:bg-[#0F172A]/50">
                <svg className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div className="mt-2">
                  <label htmlFor="csv-file-input" className="cursor-pointer font-medium text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    <span>Click to browse</span>
                    <input
                      id="csv-file-input"
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="sr-only"
                    />
                  </label>
                  <span className="text-xs text-slate-500 dark:text-slate-400"> or drag and drop CSV file</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500 font-mono">Standard CSV format (max 10MB)</p>

                {selectedFile && (
                  <div className="mt-2.5 inline-flex items-center gap-2 rounded border border-slate-200 dark:border-[#26354D] bg-white dark:bg-[#1E293B] px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-200">
                    <svg className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>

              {/* Required Columns Guide */}
              <div className="rounded border border-slate-200 dark:border-[#26354D] bg-slate-50 dark:bg-[#0F172A] p-2.5 text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[10px] uppercase tracking-wider mb-1">
                  Required CSV Headers
                </span>
                <p className="font-mono text-[11px] text-slate-800 dark:text-slate-200 bg-white dark:bg-[#162032] p-1.5 rounded border border-slate-200 dark:border-[#26354D] overflow-x-auto">
                  lead_id, source, customer_type, vehicle, part_needed, estimated_order_value_inr, message
                </p>
                <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                  * If a <code className="font-mono text-slate-700 dark:text-slate-300">priority</code> column is present in the file, it is automatically re-scored by the system to maintain consistent priority standards.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isUploading}
                  className="rounded border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] px-3 py-1.5 text-xs font-semibold text-[#172438] dark:text-[#F8FAFC] hover:bg-[#E9EFF8] dark:hover:bg-[#1E293B] disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="flex items-center gap-1.5 rounded bg-[#3678D4] hover:bg-[#2A62B6] px-3.5 py-1.5 text-xs font-bold text-white shadow-btn btn-interactive focus-ring disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700 transition-colors"
                >
                  {isUploading ? (
                    <>
                      <svg className="h-3.5 w-3.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Processing Leads...</span>
                    </>
                  ) : (
                    <span>Upload &amp; Process CSV</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        {importResult && (
          <div className="flex justify-end border-t border-[#DCE4EE] dark:border-[#26354D] bg-[#F3F6FA] dark:bg-[#0F172A] px-5 py-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-[#3678D4] hover:bg-[#2A62B6] px-4 py-1 text-xs font-bold text-white shadow-btn btn-interactive"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
