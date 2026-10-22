import { NextResponse } from 'next/server';
const { writeSave } = require('../../../server/saveManager');

export async function POST(req) {
  try {
    const data = await req.json();
    writeSave(data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
