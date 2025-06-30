// File: src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

// In-memory store for demo—swap out for your real DB logic
let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' },
];

export async function GET(req: NextRequest) {
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, role } = await req.json();
    const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = { id: newId, name, email, role };
    users.push(newUser);
    return NextResponse.json(newUser, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
