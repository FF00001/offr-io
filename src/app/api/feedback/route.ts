import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { feedback } = await request.json();

    if (!feedback || !feedback.trim()) {
      return NextResponse.json(
        { error: 'Feedback is required' },
        { status: 400 }
      );
    }

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'Offr.io Feedback <onboarding@resend.dev>',
      to: ['lucasdelaab@gmail.com'],
      subject: 'New Feedback from Offr.io',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Feedback Received</h2>
          <p style="color: #6b7280; margin-bottom: 20px;">
            A user has submitted feedback on Offr.io
          </p>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
            <p style="color: #111827; white-space: pre-wrap; margin: 0;">
              ${feedback}
            </p>
          </div>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
            Sent from Offr.io Feedback Form
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { error: 'Failed to send feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { error: 'Failed to process feedback' },
      { status: 500 }
    );
  }
}
