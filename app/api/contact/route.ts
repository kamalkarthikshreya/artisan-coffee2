import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, message } = body;

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Email to Admin
        await sendEmail({
            to: process.env.CONTACT_EMAIL || 'kamalkarthik88615@gmail.com', // Fallback to user email
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <h1>New Message</h1>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
        });

        // Confirmation Email to User
        await sendEmail({
            to: email,
            subject: 'We received your message!',
            html: `
                <h1>Thanks for reaching out!</h1>
                <p>Hi ${name},</p>
                <p>We've received your message and will get back to you shortly.</p>
                <br>
                <p>Best regards,</p>
                <p>Artisan Coffee Team</p>
            `,
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
