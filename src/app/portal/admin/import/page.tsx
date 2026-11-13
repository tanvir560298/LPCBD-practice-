'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  ArrowRight,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { SYNTHETIC_BATCHES } from '@/lib/mockData';

interface CsvRow {
  studentCode: string;
  fullName: string;
  email: string;
  phone: string;
  status: 'valid' | 'duplicate' | 'missing_field' | 'invalid_email';
  errorDetails?: string;
}

const SAMPLE_CSV = `studentCode,fullName,email,phone
LPC-26-0201,Farhana Islam,farhana.i@sample.lpcbd,+880 1711-998877
LPC-26-0202,Mahir Faisal,mahir.f@sample.lpcbd,+880 1711-887766
LPC-26-0101,Tanzila Akhter,tanzila.a@sample.lpcbd,+880 1711-112233
,Nafis Hasan,nafis@sample.lpcbd,+880 1711-776655
LPC-26-0205,Sadnan Chowdhury,invalid-email-format,+880 1711-665544`;

export default function AdminCsvImportPage() {
  const [csvText, setCsvText] = useState(SAMPLE_CSV);
  const [selectedBatchId, setSelectedBatchId] = useState('batch-se-44');
  const [parsedRows, setParsedRows] = useState<CsvRow[]>([]);
  const [hasPreviewed, setHasPreviewed] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleValidateCsv = () => {
    const lines = csvText.trim().split('\n');
    if (lines.length <= 1) {
      alert('CSV is empty or missing data rows.');
      return;
    }

    const rows: CsvRow[] = [];
    const seenCodes = new Set<string>(['LPC-26-0101', 'LPC-26-0102']); // Simulating existing student database codes

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim());
      const [studentCode, fullName, email, phone] = parts;

      if (!studentCode || !fullName || !phone) {
        rows.push({
          studentCode: studentCode || '—',
          fullName: fullName || '—',
          email: email || '',
          phone: phone || '',
          status: 'missing_field',
          errorDetails: 'Missing required student code or full name',
        });
      } else if (seenCodes.has(studentCode)) {
        rows.push({
          studentCode,
          fullName,
          email,
          phone,
          status: 'duplicate',
          errorDetails: `Duplicate student code: ${studentCode} already exists in database`,
        });
      } else if (email && !email.includes('@')) {
        rows.push({
          studentCode,
          fullName,
          email,
          phone,
          status: 'invalid_email',
          errorDetails: 'Invalid email address syntax',
        });
      } else {
        seenCodes.add(studentCode);
        rows.push({
          studentCode,
          fullName,
          email,
          phone,
          status: 'valid',
        });
      }
    }

    setParsedRows(rows);
    setHasPreviewed(true);
    setImportSuccess(false);
  };

  const handleExecuteImport = () => {
    const validCount = parsedRows.filter((r) => r.status === 'valid').length;
    setImportSuccess(true);
  };

  const validCount = parsedRows.filter((r) => r.status === 'valid').length;
  const errorCount = parsedRows.filter((r) => r.status !== 'valid').length;

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Student Roster CSV Import & Validation</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Upload or paste student roster CSV with automatic duplicate detection, row-level validation, and target cohort enrollment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Upload className="w-5 h-5 text-lpc-navy-700" />
            <span>Paste / Upload CSV Data</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="batch-select">
              Enroll Into Target Batch
            </label>
            <select
              id="batch-select"
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
            >
              {SYNTHETIC_BATCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="csv-input">
              CSV Content (Headers: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">studentCode,fullName,email,phone</code>)
            </label>
            <textarea
              id="csv-input"
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-lpc-gold-500"
            />
          </div>

          <button
            type="button"
            onClick={handleValidateCsv}
            className="w-full py-2.5 bg-lpc-navy-800 hover:bg-lpc-navy-900 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
          >
            Validate & Preview Rows
          </button>
        </div>

        <div className="lg:col-span-6 space-y-4">
          {hasPreviewed && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Validation Summary</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                    {validCount} Valid Rows
                  </span>
                  {errorCount > 0 && (
                    <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 font-bold rounded-full">
                      {errorCount} Row Errors
                    </span>
                  )}
                </div>
              </div>

              {importSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 text-emerald-900">
                  <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold">Import Executed Successfully</h4>
                  <p className="text-xs text-emerald-700">
                    {validCount} students have been successfully registered and enrolled into the cohort.
                  </p>
                </div>
              ) : (
                <>
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl">
                    {parsedRows.map((row, idx) => (
                      <div key={idx} className="p-3 text-xs flex items-center justify-between gap-2">
                        <div>
                          <div className="font-bold text-slate-900">{row.fullName} ({row.studentCode})</div>
                          {row.errorDetails && (
                            <div className="text-[11px] text-rose-600 mt-0.5">{row.errorDetails}</div>
                          )}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          row.status === 'valid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {row.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleExecuteImport}
                    disabled={validCount === 0}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
                  >
                    Confirm Import of {validCount} Valid Students
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
