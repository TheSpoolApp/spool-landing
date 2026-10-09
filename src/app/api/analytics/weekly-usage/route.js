import { createWeeklyUsageHandler } from '../../../../lib/weeklyUsageServer.mjs';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const GET = createWeeklyUsageHandler();
