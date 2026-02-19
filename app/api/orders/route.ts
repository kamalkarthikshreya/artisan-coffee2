import { NextResponse } from 'next/server';
import { sendEmail, generateOrderConfirmationEmail } from '@/lib/email';


// Force Vercel Rebuild
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, customerName, email, deliveryAddress, city, postalCode, totalPrice } = body;

        // Validate required fields
        if (!items || !customerName || !email || !deliveryAddress) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Simulate database creation
        const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        // Send Email
        const emailHtml = generateOrderConfirmationEmail({
            orderId,
            customerName,
            items: items.map((i: { productName?: string; name?: string; quantity: number; price: string | number }) => ({
                name: i.productName || i.name || 'Coffee',
                quantity: i.quantity,
                price: typeof i.price === 'string' ? i.price : `$${i.price}`
            })),
            totalPrice: totalPrice,
            deliveryAddress: `${deliveryAddress}, ${city} ${postalCode}`,
            estimatedDelivery: '3-5 Business Days'
        });

        await sendEmail({
            to: email,
            subject: `Order Confirmation #${orderId}`,
            html: emailHtml
        });

        return NextResponse.json({
            success: true,
            order: {
                id: orderId,
                status: 'confirmed',
                total: totalPrice
            }
        });

    } catch (error) {
        console.error('Order creation failed:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
