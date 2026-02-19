import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    // Redirect to orders API for now since we are using manual checkout
    // This ensures backward compatibility if any component calls /api/checkout
    return NextResponse.redirect(new URL('/api/orders', req.url));
}
