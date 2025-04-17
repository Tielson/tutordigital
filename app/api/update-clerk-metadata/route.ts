import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { publicMetadata } = await req.json()
  
  const client = await clerkClient()

  const user = await client.users.updateUser(userId, {
    publicMetadata
  })
  return NextResponse.json({ user })
}