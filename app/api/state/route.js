import { NextResponse } from 'next/server';
const { loadSave } = require('../../../server/saveManager');

export const dynamic = 'force-dynamic';

export async function GET() {
  const save = loadSave();
  return NextResponse.json(save, {
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}
