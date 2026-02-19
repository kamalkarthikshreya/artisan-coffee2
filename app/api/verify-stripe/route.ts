import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { sendEmail, generateOrderConfirmationEmail } from '@/lib/email';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { sessionId } = await req.json();

        if (!sessionId) {
            return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
        }

        // SIMULATION MODE CHECK
        if (sessionId.startsWith('mock_')) {
            // Extract order ID from session string "mock_ORD-SIM-XXXXXX_TIMESTAMP"
            const parts = sessionId.split('_');
            const mockOrderId = parts[1] || 'ORD-SIM-TEST';

            // In simulation, the order is already saved as 'paid' in checkout/route.ts
            return NextResponse.json({ success: true, orderId: mockOrderId });
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
        const uniqueId = sessionId.slice(-8).toUpperCase();
        const orderId = 'ORD-' + uniqueId;
        const total = (session.amount_total || 0) / 100;

        // Update Order in MongoDB
        const updatedOrder = await Order.findOneAndUpdate(
            { stripeSessionId: sessionId },
            {
                status: 'paid',
                orderId: orderId // Update temporary pending ID to final ID
            },
            { new: true }
        );

        if (!updatedOrder) {
            console.warn('Order not found in DB for session:', sessionId);
            // Fallback: Create order if not exists (shouldn't happen with correct flow, but safe)
        }

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

        // Send Email to Customer
        await sendEmail({
            to: email,
            subject: `Order Confirmation #${orderId}`,
            html: emailHtml
        });

        // Send Email to Merchant
        await sendEmail({
            to: process.env.CONTACT_EMAIL || process.env.GMAIL_USER || 'kamalkarthik88615@gmail.com',
            subject: `🔔 New Order Received: #${orderId}`,
            html: `<p>You have received a new order from <strong>${customerName}</strong>!</p>${emailHtml}`
        });

        return NextResponse.json({ success: true, orderId });

    } catch (error) {
        console.error('Verification Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
