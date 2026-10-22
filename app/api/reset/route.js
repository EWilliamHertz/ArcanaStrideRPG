import { NextResponse } from 'next/server';
const { resetSave } = require('../../../server/saveManager');

export async function POST() {
  const fresh = resetSave();
  return NextResponse.json(fresh);
}
