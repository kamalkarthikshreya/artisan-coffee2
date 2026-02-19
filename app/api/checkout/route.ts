import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { sendEmail, generateOrderConfirmationEmail } from '@/lib/email';

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, customer } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in checkout' }, { status: 400 });
        }

        // Check for missing or placeholder keys - Enable Simulation Mode
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_test_...')) {
            console.warn('⚠️ Stripe Keys Incorrect - Using SIMULATION MODE');

            const mockOrderId = 'ORD-SIM-' + Math.random().toString(36).substr(2, 6).toUpperCase();
            const totalAmount = items.reduce((sum: number, item: any) => {
                const price = parseFloat(item.product.price.replace('$', ''));
                return sum + (price * item.quantity);
            }, 0);

            // Send Email Immediately in Simulation Mode
            // (Since we won't have a webhook or verify step to fetch data from Stripe)
            const emailHtml = generateOrderConfirmationEmail({
                orderId: mockOrderId,
                customerName: customer.name,
                items: items.map((item: any) => ({
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price
                })),
                totalPrice: totalAmount,
                deliveryAddress: `${customer.address}, ${customer.city} ${customer.zip}`,
                estimatedDelivery: '3-5 Business Days (Simulation)'
            });

            await sendEmail({
                to: customer.email,
                subject: `Order Confirmation #${mockOrderId} (Simulation)`,
                html: emailHtml
            });

            // Notify Merchant
            await sendEmail({
                to: process.env.CONTACT_EMAIL || process.env.GMAIL_USER || 'kamalkarthik88615@gmail.com',
                subject: `🔔 New Order Received: #${mockOrderId}`,
                html: `<p>You have received a new order from <strong>${customer.name}</strong>!</p>${emailHtml}`
            });

            // Return success URL with detailed mock session to allow verification to pass
            // We append a timestamp to ensure uniqueness
            return NextResponse.json({
                url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id=mock_${mockOrderId}_${Date.now()}`
            });
        }

        // Helper to format image URL for Stripe (must be absolute)
        const getAbsoluteImageUrl = (imagePath: string) => {
            if (imagePath.startsWith('http')) return imagePath;
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
            return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
        };

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map((item: any) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.product.name,
                        // Stripe requires valid public URLs. If localhost, we might need to skip images or use a placeholder
                        images: [getAbsoluteImageUrl(item.product.image)],
                    },
                    unit_amount: Math.round(parseFloat(item.product.price.replace('$', '')) * 100),
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
            customer_email: customer.email,
            metadata: {
                customer_name: customer.name,
                address: customer.address,
                city: customer.city,
                zip: customer.zip,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
