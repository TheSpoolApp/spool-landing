"use client";
import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import useWeeklyUsage from '../hooks/useWeeklyUsage';
import './WeeklyUsagePage.css';

Chart.register(...registerables);
const COLORS = ['#747b86', '#2760bf', '#bf5c22'];
const LABELS = ['Active', 'Engaged', 'Power'];
const number = value => value == null ? '—' : value.toFixed(1);
const signed = value => value == null ? '—' : `${value > 0 ? '+' : ''}${value.toFixed(1)}`;

export default function WeeklyUsagePage({ user }) {
  const { report, loading, error, refresh } = useWeeklyUsage(user);
  const canvas = useRef(null);
  const primary = report?.cohorts[1];
  const thirdWeek = primary?.weeks[2];
  const interval = thirdWeek?.changeInterval;
  const hasData = report?.cohorts.some(cohort => cohort.users > 0);

  useEffect(() => {
    if (!canvas.current || !report || !hasData) return;
    const chart = new Chart(canvas.current, {
      type: 'line',
      data: {
        labels: [['Week 1', 'Days 1–7'], ['Week 2', 'Days 8–14'], ['Week 3', 'Days 15–21']],
        datasets: report.cohorts.map((cohort, index) => ({
          label: `${LABELS[index]} ≥${cohort.minActiveDays} ${cohort.minActiveDays === 1 ? 'day' : 'days'}/week · n=${cohort.users}`,
          data: cohort.weeks.map(week => week.meanMinutes),
          borderColor: COLORS[index], backgroundColor: COLORS[index],
          borderWidth: 3, pointRadius: 4, tension: 0, spanGaps: false,
        })),
      },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, padding: 18 } },
          tooltip: { callbacks: { label: item => `${item.dataset.label}: ${number(item.parsed.y)} min/day` } },
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Requested min/day' } },
          x: { grid: { display: false } },
        },
      },
    });
    return () => chart.destroy();
  }, [report, hasData]);

  return (
    <section className="weekly-usage" aria-labelledby="weekly-usage-title">
      <div className="weekly-heading">
        <div>
          <h2 id="weekly-usage-title">Weekly Usage</h2>
          <p>How requested access changes during the first three weeks of Spool use.</p>
        </div>
        <div className="weekly-refresh">
          <button className="btn-refresh" onClick={refresh} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh data'}
          </button>
          <span role="status">
            {report ? `Updated ${new Date(report.generatedAt).toLocaleString()}` : 'No report loaded yet'}
          </span>
        </div>
      </div>

      <p className="weekly-notice"><strong>Requested unlock time, not measured screen time.</strong> Downloads without excuse activity are excluded. Each line follows the same users through three completed weeks. This view uses full account history; dashboard date filters do not apply.</p>

      {error && <div className="weekly-error" role="alert">{error} {report && 'Showing the last successful report; the values below have not been refreshed.'}</div>}
      {!report && !error && <div className="weekly-empty" role="status">Loading the weekly report…</div>}

      {report && <>
        <div className="weekly-cards">
          <div><span>Consistently engaged users</span><strong>{primary.users}</strong><small>Excuses on ≥3 days in every week</small></div>
          <div><span>Week 1 → week 3</span><strong>{number(primary.weeks[0].meanMinutes)} → {number(thirdWeek.meanMinutes)}</strong><small>Average requested minutes / day</small></div>
          <div><span>Change in group average</span><strong>{thirdWeek.changePercent == null ? '—' : `${signed(thirdWeek.changePercent)}%`}</strong><small>{primary.users ? `${thirdWeek.usersDecreased} of ${primary.users} users requested less in week 3` : 'No qualifying users yet'}</small></div>
        </div>

        <div className="weekly-surface">
          <h3>Requested access by week</h3>
          <p>Activity thresholds apply in <strong>each</strong> week. Positive changes mean more requested time.</p>
          {hasData ? <div className="weekly-chart"><canvas ref={canvas} role="img" aria-label="Average requested unlock minutes per day across weeks one, two and three. Exact values and cohort sizes are in the table below." /></div>
            : <div className="weekly-empty">No users have three completed weeks with enough activity and complete duration records. Missing observations are not shown as zero usage.</div>}
          <div className="weekly-table-scroll" tabIndex={0} role="region" aria-label="Weekly usage comparison table">
            <table>
              <caption>Mean requested minutes per calendar day · fixed users within each row</caption>
              <thead><tr><th scope="col">Activity per week</th><th scope="col">Users</th><th scope="col">Week 1</th><th scope="col">Week 2</th><th scope="col">Week 3</th><th scope="col">W3 vs W1</th><th scope="col">Missing durations*</th></tr></thead>
              <tbody>{report.cohorts.map(cohort => <tr key={cohort.minActiveDays} className={cohort.minActiveDays === 3 ? 'weekly-primary-row' : ''}>
                <th scope="row">≥{cohort.minActiveDays} {cohort.minActiveDays === 1 ? 'day' : 'days'}{cohort.minActiveDays === 3 ? ' · primary' : ''}</th>
                <td>{cohort.users}</td>
                {cohort.weeks.map(week => <td key={week.week}>{number(week.meanMinutes)}</td>)}
                <td>{cohort.weeks[2].changePercent == null ? '—' : `${signed(cohort.weeks[2].changePercent)}%`}</td>
                <td>{cohort.missingDurationUsers}</td>
              </tr>)}</tbody>
            </table>
          </div>
          <p className="weekly-footnote">*Otherwise engaged users excluded because at least one excuse in their first three weeks lacks a valid duration.</p>
          {interval && <p className="weekly-interval">For the primary cohort, the paired week-3 change is <strong>{signed(thirdWeek.changeMinutes)} min/day</strong> (95% bootstrap interval: {signed(interval[0])} to {signed(interval[1])}). {interval[0] <= 0 && interval[1] >= 0 ? 'The interval includes no change.' : 'This interval describes sampling uncertainty, not a causal effect.'}</p>}
        </div>

        <details className="weekly-surface weekly-method">
          <summary>Who is included &amp; how this is calculated</summary>
          <p>{report.excuseRecords.toLocaleString()} excuse records scanned; {report.activeUsers.toLocaleString()} accounts with excuse records after excluding known team and sandbox accounts; {report.eligibleUsers.toLocaleString()} have three complete weeks and valid timestamps. {report.invalidTimestampUsers} accounts excluded for invalid or future timestamps.</p>
          <ul>
            <li>Weeks start on the UTC calendar day of each user’s first recorded excuse. Only full weeks ending by {new Date(report.observationCutoff).toLocaleDateString('en-US', { timeZone: 'UTC', dateStyle: 'medium' })}, 00:00 UTC, count.</li>
            <li>Require excuses on at least 1, 3, or 5 distinct days in every week, and a positive recorded duration for every excuse in those weeks. Unknown subscription environments are included; explicit sandbox accounts and known team IDs are excluded.</li>
            <li>Sum requested minutes per user per week, divide by seven calendar days, then average equally across users. Change percentages compare group means. Missing duration fields are never filled from lifetime totals.</li>
            <li>Confidence intervals resample users 2,000 times, keeping their weekly observations paired. Small cohorts remain uncertain.</li>
          </ul>
          <p>Week 1 is already during Spool use, not a pre-app baseline. Requiring later activity selects sustained users and can exclude people who stop needing unlocks. Requested time may differ from time actually used and excludes usage outside recorded unlocks. This does not establish a reduction in total screen time.</p>
          <p>Reports are reused for up to five minutes. Refresh data requests a fresh database snapshot; failed refreshes keep the last successful report visible.</p>
        </details>
      </>}
    </section>
  );
}
