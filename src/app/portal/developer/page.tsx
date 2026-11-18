'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Code2,
  Terminal,
  Activity,
  Server,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Play,
  UserCheck,
  ExternalLink,
  Laptop,
  Check,
} from 'lucide-react';
import { usePortal } from '@/components/portal/PortalContext';
import {
  SYNTHETIC_USERS,
  SYNTHETIC_BATCHES,
  SYNTHETIC_CLASS_SESSIONS,
  SYNTHETIC_STUDENTS,
  SYNTHETIC_COURSES,
  SYNTHETIC_BRANCHES,
} from '@/lib/mockData';
import { adminBatches, adminSessions, adminEnrollments } from '@/lib/adminStore';

interface ApiCheckStatus {
  endpoint: string;
  name: string;
  status: 'idle' | 'testing' | 'pass' | 'fail';
  code?: number;
  latency?: number;
  message?: string;
}

export default function DeveloperPortalPage() {
  const router = useRouter();
  const { actor, setActor } = usePortal();

  const [activeTab, setActiveTab] = useState<'architecture' | 'api-matrix' | 'personas' | 'stores'>('architecture');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [apiChecks, setApiChecks] = useState<ApiCheckStatus[]>([
    {
      endpoint: '/api/portal/sessions/sess-today-01/attendance',
      name: 'Session Attendance Endpoint',
      status: 'idle',
    },
    {
      endpoint: '/api/events',
      name: 'Public & Academic Events API',
      status: 'idle',
    },
    {
      endpoint: '/api/student/session',
      name: 'Student Demo Session API',
      status: 'idle',
    },
  ]);

  const runApiTest = async (index: number) => {
    const target = apiChecks[index];
    setApiChecks((prev) =>
      prev.map((c, i) => (i === index ? { ...c, status: 'testing' } : c))
    );

    const startTime = performance.now();
    try {
      const res = await fetch(target.endpoint, { cache: 'no-store' });
      const duration = Math.round(performance.now() - startTime);
      setApiChecks((prev) =>
        prev.map((c, i) =>
          i === index
            ? {
                ...c,
                status: res.ok ? 'pass' : 'fail',
                code: res.status,
                latency: duration,
                message: res.ok
                  ? `HTTP ${res.status} OK (${duration}ms)`
                  : `HTTP ${res.status} Error (${duration}ms)`,
              }
            : c
        )
      );
    } catch (err: unknown) {
      const duration = Math.round(performance.now() - startTime);
      setApiChecks((prev) =>
        prev.map((c, i) =>
          i === index
            ? {
                ...c,
                status: 'fail',
                latency: duration,
                message: err instanceof Error ? err.message : 'Network Failure',
              }
            : c
        )
      );
    }
  };

  const runAllApiTests = async () => {
    for (let i = 0; i < apiChecks.length; i++) {
      await runApiTest(i);
    }
  };

  const handleImpersonate = (userId: string) => {
    setActor(userId);
    if (typeof document !== 'undefined') {
      document.cookie = `lpc_demo_user=${userId}; path=/; SameSite=Lax`;
    }
  };

  const clearDemoDrafts = () => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('lpc_'))
        .forEach((k) => localStorage.removeItem(k));
      alert('Local storage LPC cache and drafts reset successfully.');
    } catch {
      alert('Could not access localStorage.');
    }
  };

  return (
    <div className="pt-page space-y-6">
      {/* Page Header */}
      <div className="pt-page-heading">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-indigo-100 text-indigo-900 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              Web Developer Console
            </span>
            <span className="text-xs text-slate-500 font-mono">v1.4.0 · App Router</span>
          </div>
          <h1 className="mt-1">System Architecture &amp; Developer Tools</h1>
          <p>
            Welcome, <strong>Tanvir Ahmad</strong>. Inspect system internals, simulate user personas, verify API boundaries, and validate production security.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearDemoDrafts}
            className="pt-button-secondary text-xs"
            title="Clear all browser local storage draft keys for LPC"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Local Drafts</span>
          </button>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Auth Mode</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base font-bold text-slate-900">Isolated Demo Mode</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Fail-closed production ready</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Framework</span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-base font-bold text-slate-900">Next.js 14 + React 18</div>
          <div className="text-[11px] text-slate-500 mt-0.5">App Router · TypeScript 5.6</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Timezone</span>
            <Server className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-base font-bold text-slate-900">Asia/Dhaka (BST)</div>
          <div className="text-[11px] text-slate-500 mt-0.5">UTC+06:00 Normalized</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Active Actor</span>
            <UserCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-base font-bold text-slate-900 truncate">{actor.fullName}</div>
          <div className="text-[11px] text-purple-700 uppercase font-semibold mt-0.5">
            Role: {actor.role}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-4 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('architecture')}
          className={`pb-3 px-1 border-b-2 transition-colors ${
            activeTab === 'architecture'
              ? 'border-lpc-navy-900 text-lpc-navy-950 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          System Architecture
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('api-matrix')}
          className={`pb-3 px-1 border-b-2 transition-colors ${
            activeTab === 'api-matrix'
              ? 'border-lpc-navy-900 text-lpc-navy-950 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          API Health Matrix
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('personas')}
          className={`pb-3 px-1 border-b-2 transition-colors ${
            activeTab === 'personas'
              ? 'border-lpc-navy-900 text-lpc-navy-950 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Role Simulator &amp; Personas
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('stores')}
          className={`pb-3 px-1 border-b-2 transition-colors ${
            activeTab === 'stores'
              ? 'border-lpc-navy-900 text-lpc-navy-950 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Data Store Statistics
        </button>
      </div>

      {/* Tab 1: System Architecture */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-lpc-navy-800" />
              Role-Based Architecture &amp; Security Boundary
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              LPC Bangladesh implements a modern institutional portal with five primary roles and fail-closed security guarantees:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60">
                <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5 mb-1">
                  <span>👨‍🏫 Teacher / Faculty</span>
                </div>
                <p className="text-[11px] text-blue-900">
                  Scoped strictly to their assigned course sessions. Mark live student attendance, generate draft speaking assessments, and assign batch tasks.
                </p>
                <div className="mt-2 text-[10px] font-mono text-blue-800">Route: /portal</div>
              </div>

              <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/60">
                <div className="text-xs font-bold text-purple-950 flex items-center gap-1.5 mb-1">
                  <span>🛡️ Institutional Administrator</span>
                </div>
                <p className="text-[11px] text-purple-900">
                  Global institutional authority. Create cohort batches, schedule class sessions, assign instructors, enroll students, and manage faculty credentials.
                </p>
                <div className="mt-2 text-[10px] font-mono text-purple-800">Route: /portal/admin</div>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60">
                <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5 mb-1">
                  <span>🏢 Branch Coordinator</span>
                </div>
                <p className="text-[11px] text-amber-900">
                  Campus-level oversight (Dhaka, Chattogram, Rajshahi, Cox&apos;s Bazar). Audit attendance submission across all batches in their assigned branch.
                </p>
                <div className="mt-2 text-[10px] font-mono text-amber-800">Route: /portal (branch-scoped)</div>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60">
                <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 mb-1">
                  <span>🎓 Student</span>
                </div>
                <p className="text-[11px] text-emerald-900">
                  Access enrolled batch schedule, view real-time attendance percentage, receive batch-specific academic program notices, and track speaking scores.
                </p>
                <div className="mt-2 text-[10px] font-mono text-emerald-800">Route: /student/dashboard</div>
              </div>

              <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/60">
                <div className="text-xs font-bold text-indigo-950 flex items-center gap-1.5 mb-1">
                  <span>💻 Web Developer (Tanvir)</span>
                </div>
                <p className="text-[11px] text-indigo-900">
                  Superuser access to test API endpoints, switch personas in real-time, inspect server environment, and review fail-closed security policies.
                </p>
                <div className="mt-2 text-[10px] font-mono text-indigo-800">Route: /portal/developer</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-lpc-navy-800" />
              Security Specifications &amp; Quality Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">Fail-Closed Verification</div>
                <ul className="space-y-1.5 text-slate-600">
                  <li>• Server enforces identity from verified headers/cookies (never trusting client payload)</li>
                  <li>• Missing Supabase credentials in production immediately trigger HTTP 503</li>
                  <li>• Cancelled class sessions strictly reject attendance submissions with HTTP 422</li>
                  <li>• Deactivated faculty accounts are immediately rejected with HTTP 403</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">Automated Vitest Test Suite</div>
                <ul className="space-y-1.5 text-slate-600">
                  <li>• 9 Test Files / 48 Automated Unit &amp; Integration Tests</li>
                  <li>• Covers concurrency, role scopes, redirects, rate limiting, and attendance</li>
                  <li>• Fast in-memory execution (~1.1 seconds)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: API Health Matrix */}
      {activeTab === 'api-matrix' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">API Health &amp; Endpoint Monitor</h2>
              <p className="text-xs text-slate-500">Live test internal portal and public API routes</p>
            </div>
            <button
              type="button"
              onClick={runAllApiTests}
              className="pt-button text-xs flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Ping All Endpoints</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {apiChecks.map((item, idx) => (
              <div key={item.endpoint} className="p-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>{item.name}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.endpoint}
                    </span>
                  </div>
                  {item.message && (
                    <div
                      className={`text-xs font-mono ${
                        item.status === 'pass' ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {item.message}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {item.status === 'testing' && (
                    <span className="text-xs text-slate-500 animate-pulse">Testing...</span>
                  )}
                  {item.status === 'pass' && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Passed
                    </span>
                  )}
                  {item.status === 'fail' && (
                    <span className="flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-md border border-rose-200">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Failed
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => runApiTest(idx)}
                    className="pt-button-secondary text-xs"
                  >
                    Ping
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Role Simulator */}
      {activeTab === 'personas' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Persona Impersonation Matrix</h2>
            <p className="text-xs text-slate-500">
              Switch identity with 1-click to simulate real-world behavior and test role boundaries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SYNTHETIC_USERS.map((u) => {
              const isCurrent = actor.id === u.id;
              return (
                <div
                  key={u.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <span>{u.fullName}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">{u.email}</div>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'coordinator'
                          ? 'bg-amber-100 text-amber-800'
                          : u.role === 'developer'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-slate-600">
                    <strong>Branches:</strong> {u.assignedBranchIds.join(', ')}
                    {u.accountStatus === 'disabled' && (
                      <span className="ml-2 font-bold text-rose-600">[DEACTIVATED ACCOUNT]</span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400 font-mono">ID: {u.id}</span>
                    <button
                      type="button"
                      disabled={isCurrent}
                      onClick={() => handleImpersonate(u.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                        isCurrent
                          ? 'bg-indigo-100 text-indigo-700 cursor-default'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {isCurrent ? 'Current Persona' : 'Impersonate Persona'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Stores */}
      {activeTab === 'stores' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Synthetic Data Store Inventory</h2>
            <p className="text-xs text-slate-500">Live record counts loaded into memory</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div className="text-2xl font-bold text-slate-900">{SYNTHETIC_COURSES.length}</div>
              <div className="text-xs text-slate-500 mt-1">Courses</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div className="text-2xl font-bold text-slate-900">{adminBatches.length}</div>
              <div className="text-xs text-slate-500 mt-1">Batches</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div className="text-2xl font-bold text-slate-900">{adminSessions.length}</div>
              <div className="text-xs text-slate-500 mt-1">Sessions</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div className="text-2xl font-bold text-slate-900">{SYNTHETIC_STUDENTS.length}</div>
              <div className="text-xs text-slate-500 mt-1">Students</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div className="text-2xl font-bold text-slate-900">{SYNTHETIC_BRANCHES.length}</div>
              <div className="text-xs text-slate-500 mt-1">Branches</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div className="text-2xl font-bold text-slate-900">{SYNTHETIC_USERS.length}</div>
              <div className="text-xs text-slate-500 mt-1">Staff Users</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
