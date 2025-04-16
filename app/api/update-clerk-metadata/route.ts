import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  console.log('POST /api/update-clerk-metadata called');

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { metadata } = await req.json()
  console.log(metadata);
  
  const client = await clerkClient()
  console.log('Updating user metadata:', metadata)
  console.log('User ID:', userId)

  const user = await client.users.updateUser(userId, {
    publicMetadata: metadata
  })
  console.log("Metadados atualizados no Clerk:", user.publicMetadata);
  return NextResponse.json({ user })
}