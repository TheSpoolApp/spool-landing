import test from 'node:test';
import assert from 'node:assert/strict';
import { completionSummary, dailyCompletion, passedPaywall, fetchAllSessionPages, reachedScreenNames, setupStatusLabel } from './onboardingMetrics.mjs';

test('a resumed or partially instrumented session never fabricates an opening view', () => {
  const resumed = { last_screen_name: 'journey_paywall', screens_completed: [
    { screen_name: 'personalized_plan' }, { screen_name: 'journey_paywall' },
    { screen_name: 'personalized_plan' },
  ] };
  assert.deepEqual([...reachedScreenNames(resumed)], ['personalized_plan', 'journey_paywall']);
  assert.deepEqual([...reachedScreenNames(resumed, 'welcome')], ['welcome', 'personalized_plan', 'journey_paywall']);
  assert.deepEqual([...reachedScreenNames({ last_screen_name: 'opening_carousel' })], ['opening_carousel']);
  assert.equal(reachedScreenNames({}).size, 0);
});

test('existing-account sign-in is distinct from successful onboarding activation', () => {
  const signIn = { status: 'existing_account_sign_in', dropped_off: true };
  assert.equal(setupStatusLabel(signIn), 'Existing account sign-in');
  assert.equal(completionSummary([signIn]).completed, 0);
  assert.equal(setupStatusLabel({ status: 'in_progress', dropped_off: true }), 'Unfinished');
  assert.equal(setupStatusLabel({ status: 'completed', dropped_off: false }), 'Completed');
  assert.equal(setupStatusLabel({ status: 'completed' }), 'Unknown');
});

test('only explicit false counts as completed; missing, null and malformed flags stay in denominator', () => {
  assert.deepEqual(completionSummary([{dropped_off:false}, {dropped_off:true}, {}, {dropped_off:null}, {dropped_off:0}]),
    {total:5, completed:1, unfinished:1, unknown:3, completionRate:'20.0'});
  assert.equal(completionSummary([]).completionRate, null);
});

test('period rate weights counts and reconciles daily totals, not arithmetic average of percentages', () => {
  const rows = [
    ...Array.from({length:10}, (_, i) => ({started_at:new Date(2026,8,23,12), dropped_off:i !== 0})),
    ...Array.from({length:90}, (_, i) => ({started_at:new Date(2026,8,24,12), dropped_off:i >= 18})),
  ];
  const summary=completionSummary(rows), daily=dailyCompletion(rows);
  assert.equal(summary.completionRate,'19.0'); // 19/100, not (10% + 20%)/2.
  assert.equal(daily.reduce((sum,r)=>sum+r.completed,0),summary.completed);
  assert.equal(daily.reduce((sum,r)=>sum+r.total,0),summary.total);
  assert.deepEqual(daily.map(r=>r.date),['2026-09-24','2026-09-23']);
});

test('reaching the final screen is not completion; passing paywall does not require finishing setup', () => {
  const order=['welcome','journey_paywall','create_account','blocking_confirmation'].map(name=>({name}));
  const s={last_screen_name:'create_account',dropped_off:true};
  assert.equal(passedPaywall(s,order,'journey_paywall'),true);
  assert.equal(completionSummary([s]).completed,0);
  assert.equal(passedPaywall({last_screen_name:'journey_paywall'},order,'journey_paywall'),false);
  assert.equal(completionSummary([{last_screen_name:'blocking_confirmation'}]).completed,0);
});

test('pagination retains sessions beyond 5,000 and fails rather than returning a partial sample', async () => {
  const docs=Array.from({length:6001},(_,i)=>({id:String(i),data:()=>({dropped_off:i>=5000})}));
  const load=(cursor,size)=>Promise.resolve(docs.slice(cursor?Number(cursor.id)+1:0,(cursor?Number(cursor.id)+1:0)+size));
  const rows=await fetchAllSessionPages(load);
  assert.equal(rows.length,6001);
  assert.equal(completionSummary(rows).completed,5000);
  await assert.rejects(fetchAllSessionPages(async cursor=>{if(cursor) throw new Error('network'); return docs.slice(0,1000);}));
  let current=true;
  assert.equal(await fetchAllSessionPages(async()=>{current=false;return docs.slice(0,1000);},()=>current),null);
});
