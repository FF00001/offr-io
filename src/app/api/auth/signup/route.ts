import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';
import { createSession } from '@/lib/session';
import { getInvitationByToken, markInvitationAsUsed } from '@/lib/db';
import { AccountType } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, accountType, name, invitationToken } = body;

    // Validate input
    if (!email || !password || !accountType || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['agent', 'enterprise'].includes(accountType)) {
      return NextResponse.json(
        { error: 'Invalid account type' },
        { status: 400 }
      );
    }

    // Check invitation token if provided
    let enterpriseId: string | undefined;
    if (invitationToken) {
      const invitation = await getInvitationByToken(invitationToken);
      if (!invitation) {
        return NextResponse.json(
          { error: 'Invalid invitation token' },
          { status: 400 }
        );
      }
      if (invitation.used) {
        return NextResponse.json(
          { error: 'Invitation token already used' },
          { status: 400 }
        );
      }
      if (invitation.email.toLowerCase() !== email.toLowerCase()) {
        return NextResponse.json(
          { error: 'Email does not match invitation' },
          { status: 400 }
        );
      }
      enterpriseId = invitation.enterpriseId;
      await markInvitationAsUsed(invitationToken);
    }

    // Register user
    const result = await registerUser(
      email,
      password,
      accountType as AccountType,
      name,
      enterpriseId
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Create session
    await createSession({
      id: result.user!.id,
      email: result.user!.email,
      accountType: result.user!.accountType,
      name: result.user!.name,
      enterpriseId: result.user!.enterpriseId,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: result.user!.id,
        email: result.user!.email,
        accountType: result.user!.accountType,
        name: result.user!.name,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
