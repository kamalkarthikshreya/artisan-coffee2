import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { sendEmail, generateOrderConfirmationEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const { sessionId } = await req.json();

        if (!sessionId) {
            return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return NextResponse.json({ error: 'Payment not paid' }, { status: 400 });
        }

        // Retrieve line items
        const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);

        // Extract Data
        const customerName = session.metadata?.customer_name || session.customer_details?.name || 'Guest';
        const email = session.customer_details?.email || 'no-email@example.com';
        const address = session.metadata?.address || '';
        const city = session.metadata?.city || '';
        const zip = session.metadata?.zip || '';
        const orderId = 'ORD-' + sessionId.slice(-8).toUpperCase();
        const total = (session.amount_total || 0) / 100;

        // Generate Email
        const emailHtml = generateOrderConfirmationEmail({
            orderId,
            customerName,
            items: lineItems.data.map(item => ({
                name: item.description,
                quantity: item.quantity || 1,
                price: `$${((item.amount_total || 0) / 100).toFixed(2)}`
            })),
            totalPrice: total,
            deliveryAddress: `${address}, ${city} ${zip}`,
            estimatedDelivery: '3-5 Business Days'
        });

        // Send Email
        await sendEmail({
            to: email,
            subject: `Order Confirmation #${orderId}`,
            html: emailHtml
        });

        return NextResponse.json({ success: true, orderId });

    } catch (error) {
        console.error('Verification Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
