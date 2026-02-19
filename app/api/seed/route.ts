import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { coffeeProducts } from '@/data/products';

export async function GET() {
    try {
        await dbConnect();

        // Clear existing products to avoid duplicates
        await Product.deleteMany({});

        // Insert new products
        await Product.insertMany(coffeeProducts);

        return NextResponse.json({
            message: 'Database seeded successfully',
            products: coffeeProducts
        });
    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}
