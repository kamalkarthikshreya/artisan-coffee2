import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, customer } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in checkout' }, { status: 400 });
        }

        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_test_...')) {
            throw new Error('Stripe Secret Key is missing or invalid in .env.local');
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
