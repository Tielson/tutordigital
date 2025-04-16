import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { metadata } = await req.json()
  
  const client = await clerkClient()

  const user = await client.users.updateUser(userId, {
    publicMetadata: metadata
  })
  return NextResponse.json({ user })
}