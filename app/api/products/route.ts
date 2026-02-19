import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { coffeeProducts } from '@/data/products';

export async function GET() {
    try {
        await dbConnect();
        const products = await Product.find({});

        // Fallback to static data if DB is empty or connection fails (robustness)
        if (!products || products.length === 0) {
            return NextResponse.json(coffeeProducts);
        }

        return NextResponse.json(products);
    } catch (error) {
        console.error('Failed to fetch products:', error);
        // Fallback to static data
        return NextResponse.json(coffeeProducts);
    }
}
