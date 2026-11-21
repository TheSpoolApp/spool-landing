import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

const project = 'spool-a5020';
const { values } = parseArgs({ options: { previous: { type: 'string' }, save: { type: 'string' } } });
const token = process.env.GOOGLE_OAUTH_ACCESS_TOKEN ||
  execFileSync('gcloud', ['auth', 'print-access-token'], { encoding: 'utf8' }).trim();

async function queryStatistics(query) {
  const rows = [];
  let cursor;
  do {
    const body = { query: { ...query, limit: 250, ...(cursor && { startCursor: cursor }) } };
    const response = await fetch('https://datastore.googleapis.com/v1/projects/' + project + ':runQuery', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json', 'x-goog-user-project': project },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error('Statistics query failed: ' + response.status + ' ' + (await response.json()).error?.message);
    const { batch } = await response.json();
    rows.push(...(batch.entityResults || []).map(row => row.entity.properties));
    if (batch.moreResults === 'NO_MORE_RESULTS') break;
    if (!batch.endCursor || batch.endCursor === cursor) throw new Error('Statistics query cursor did not advance');
    cursor = batch.endCursor;
  } while (cursor);
  return rows;
}

function sizes(row) {
  return {
    documents: Number(row.count.integerValue),
    document_bytes: Number(row.entity_bytes.integerValue),
    automatic_index_bytes: Number(row.builtin_index_bytes.integerValue),
    composite_index_bytes: Number(row.composite_index_bytes.integerValue),
    total_bytes: Number(row.bytes.integerValue),
  };
}

const totals = await queryStatistics({ kind: [{ name: '__Stat_Total__' }] });
const latest = totals.sort((a, b) => Date.parse(b.timestamp.timestampValue) - Date.parse(a.timestamp.timestampValue))[0];
if (!latest) throw new Error('Google has not published a storage snapshot yet');
const timestamp = latest.timestamp.timestampValue;
const kinds = await queryStatistics({
  kind: [{ name: '__Stat_Kind__' }],
  filter: { propertyFilter: { property: { name: 'timestamp' }, op: 'EQUAL', value: { timestampValue: timestamp } } },
});
const collections = kinds.map(row => ({ name: row.kind_name.stringValue, ...sizes(row) }))
  .sort((a, b) => b.total_bytes - a.total_bytes);
const snapshot = { project, database: { name: '(default)', ...sizes(latest) }, statistics_timestamp_utc: timestamp, collection_groups: collections };
if (!collections.length) throw new Error('No collection statistics available for this snapshot');
const previous = values.previous && JSON.parse(readFileSync(values.previous, 'utf8'));
if (previous && (previous.project !== project || previous.database?.name !== '(default)' ||
    Date.parse(previous.statistics_timestamp_utc) > Date.parse(timestamp))) {
  throw new Error('Previous snapshot must be from this database and no newer than the current snapshot');
}
const old = new Map((previous?.collection_groups || []).map(row => [row.name, row]));
const mib = bytes => (bytes / 2 ** 20).toFixed(2);
console.log(project, '(default)', timestamp, '— database GiB', (snapshot.database.total_bytes / 2 ** 30).toFixed(3));
if (previous) console.log('Comparing with', previous.statistics_timestamp_utc);
console.table(collections.map(row => ({
  collection: row.name, documents: row.documents, data_MiB: mib(row.document_bytes),
  single_field_MiB: mib(row.automatic_index_bytes), composite_MiB: mib(row.composite_index_bytes),
  ...(previous && { change_MiB: old.has(row.name) ? mib(row.total_bytes - old.get(row.name).total_bytes) : 'new in statistics' }),
})));
if (previous) {
  const seen = new Set(collections.map(row => row.name));
  for (const name of old.keys()) if (!seen.has(name)) console.log('Missing in current statistics:', name);
}
if (values.save) writeFileSync(values.save, JSON.stringify(snapshot, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
