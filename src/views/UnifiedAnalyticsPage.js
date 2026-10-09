"use client";
import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import useFirebaseAuth from '../hooks/useFirebaseAuth';
import AgeCohortPage from './AgeCohortPage';
import AnalyticsPage from './AnalyticsPage';
import ChurnReportPage from './ChurnReportPage';
import ExcuseDataPage from './ExcuseDataPage';
import ReleasesPage from './ReleasesPage';
import WeeklyUsagePage from './WeeklyUsagePage';
import { DASHBOARD_EMAILS } from '../lib/analyticsAccess.mjs';
import {
  endOfLocalDay,
  formatLocalDate,
  normalizeDateInput,
  startOfLocalDay,
} from '../lib/dateRange.mjs';
import './AnalyticsPage.css';
import './UnifiedAnalyticsPage.css';

const TABS = [
  { id: 'age-cohort',  label: 'Customer Info' },
  { id: 'churn',       label: 'Churn Report' },
  { id: 'excuse-data', label: 'Excuse Data' },
  { id: 'weekly-usage', label: 'Weekly Usage' },
  { id: 'analytics',   label: 'Onboarding Funnel' },
  { id: 'releases',    label: 'Releases' },
];

const LIFETIME_START = '2024-01-01';

function UnifiedAnalyticsInner() {
  const { user, handleSignIn, handleSignOut } = useFirebaseAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const requestedTab = searchParams?.get('tab');
  const today = formatLocalDate(new Date());
  const initialFrom = normalizeDateInput(searchParams?.get('from'), LIFETIME_START);
  const initialTo = normalizeDateInput(searchParams?.get('to'), today);
  const [activeTab, setActiveTab] = useState(
    TABS.some(t => t.id === requestedTab) ? requestedTab : 'age-cohort'
  );

  const [dateFromStr, setDateFromStr] = useState(initialFrom);
  const [dateToStr, setDateToStr] = useState(initialTo);
  const [appliedFrom, setAppliedFrom] = useState(() => startOfLocalDay(initialFrom));
  const [appliedTo, setAppliedTo] = useState(() => endOfLocalDay(initialTo));

  const handleApply = () => {
    setAppliedFrom(startOfLocalDay(dateFromStr));
    setAppliedTo(endOfLocalDay(dateToStr));
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('from', dateFromStr);
    params.set('to', dateToStr);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleTabChange = (id) => {
    setActiveTab(id);
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('tab', id);
    params.set('from', formatLocalDate(appliedFrom));
    params.set('to', formatLocalDate(appliedTo));
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="analytics-page unified-analytics">
      <header className="analytics-header">
        <h1>Spool Admin Dashboard</h1>
        <div className="auth-section">
          {user ? (
            <>
              <span className="user-email">{user.email}</span>
              <button className="btn-logout" onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <button className="btn-login" onClick={handleSignIn}>Sign In</button>
          )}
        </div>
      </header>

      {!user ? (
        <div className="login-prompt">
          <p>Sign in with an authorized Google account to view the dashboard.</p>
        </div>
      ) : !DASHBOARD_EMAILS.includes((user.email || '').toLowerCase()) ? (
        <div className="login-prompt">
          <p>This account ({user.email}) is not authorized for the Spool dashboard.</p>
        </div>
      ) : (
        <>
          {!['releases', 'weekly-usage'].includes(activeTab) && (
          <div className="filters">
            <label>
              From:
              <input type="date" value={dateFromStr} onChange={e => setDateFromStr(e.target.value)} />
            </label>
            <label>
              To:
              <input type="date" value={dateToStr} onChange={e => setDateToStr(e.target.value)} />
            </label>
            <button className="btn-refresh" onClick={handleApply}>Apply</button>
          </div>
          )}

          <div className="unified-tabs">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`unified-tab ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => handleTabChange(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="unified-panel">
            {activeTab === 'age-cohort' && (
              <AgeCohortPage panelMode dateFrom={appliedFrom} dateTo={appliedTo} />
            )}
            {activeTab === 'churn' && (
              <ChurnReportPage panelMode dateFrom={appliedFrom} dateTo={appliedTo} />
            )}
            {activeTab === 'excuse-data' && (
              <ExcuseDataPage panelMode dateFrom={appliedFrom} dateTo={appliedTo} />
            )}
            {activeTab === 'weekly-usage' && <WeeklyUsagePage key={user.uid} user={user} />}
            {activeTab === 'analytics' && (
              <AnalyticsPage panelMode dateFrom={appliedFrom} dateTo={appliedTo} />
            )}
            {activeTab === 'releases' && <ReleasesPage />}
          </div>
        </>
      )}
    </div>
  );
}

export default function UnifiedAnalyticsPage() {
  // useSearchParams requires a Suspense boundary above it during render in Next 16.
  return (
    <Suspense fallback={<div className="analytics-page"><div className="loading">Loading dashboard…</div></div>}>
      <UnifiedAnalyticsInner />
    </Suspense>
  );
}
