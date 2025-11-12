import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { createInvitation } from '@/lib/db';
import { generateInvitationToken } from '@/lib/auth';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// POST - Send invitation to agent
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only enterprises can invite agents
    if (session.accountType !== 'enterprise') {
      return NextResponse.json(
        { error: 'Only enterprises can invite agents' },
        { status: 403 }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate invitation token
    const token = generateInvitationToken();

    // Create invitation
    const invitation = {
      id: token,
      enterpriseId: session.id,
      email: email.toLowerCase(),
      token,
      used: false,
      createdAt: new Date().toISOString(),
    };

    await createInvitation(invitation);

    // Send invitation email
    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/signup?token=${token}`;

    try {
      await resend.emails.send({
        from: 'Offr.io <onboarding@resend.dev>',
        to: [email],
        subject: `${session.name} invited you to join Offr.io`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(to right, #2563eb, #9333ea); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 32px;">Offr.io</h1>
              </div>
              
              <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
                <h2 style="color: #111827; margin-top: 0;">You've been invited!</h2>
                
                <p style="color: #4b5563; font-size: 16px;">
                  <strong>${session.name}</strong> has invited you to join their team on Offr.io.
                </p>
                
                <p style="color: #4b5563; font-size: 16px;">
                  Offr.io helps craftsmen and contractors generate professional quotes in minutes.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${invitationUrl}" style="background-color: #2563eb; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; display: inline-block;">
                    Accept Invitation
                  </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                  Or copy and paste this URL into your browser:<br>
                  <a href="${invitationUrl}" style="color: #2563eb; word-break: break-all;">${invitationUrl}</a>
                </p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                
                <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                  If you didn't expect this invitation, you can safely ignore this email.
                </p>
              </div>
            </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError);
      // Continue anyway - invitation is created
    }

    return NextResponse.json({ success: true, invitationUrl });
  } catch (error) {
    console.error('Invitation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
