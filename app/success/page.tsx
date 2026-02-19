'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import Link from 'next/link';
import { motion } from 'framer-motion';

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const { clearCart } = useCart();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        if (!sessionId) {
            setStatus('error');
            return;
        }

        async function verifyPayment() {
            try {
                const res = await fetch('/api/verify-stripe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId }),
                });

                if (res.ok) {
                    setStatus('success');
                    clearCart();
                } else {
                    setStatus('error');
                }
            } catch (err) {
                console.error(err);
                setStatus('error');
            }
        }

        verifyPayment();
    }, [sessionId, clearCart]);

    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-16 h-16 border-4 border-[#D4A574] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-[#C9B8A0]">Verifying your coffee order...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="text-center">
                <h1 className="text-4xl font-['Playfair_Display'] font-bold text-red-500 mb-4">Something went wrong</h1>
                <p className="text-[#C9B8A0] mb-8">We couldn't verify your payment. Please contact support.</p>
                <Link href="/checkout" className="text-[#D4A574] underline">Try Again</Link>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
        >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h1 className="text-5xl font-['Playfair_Display'] font-bold text-[#F5E6D3] mb-6">Order Confirmed!</h1>
            <p className="text-[#C9B8A0] text-lg mb-8 max-w-md mx-auto">
                Thank you for your purchase. We've sent a confirmation email with your order details.
            </p>
            <Link href="/">
                <button className="px-8 py-3 bg-gradient-to-r from-[#D4A574] to-[#B08968] text-[#1A0F0A] font-bold rounded-lg hover:shadow-lg transition-all">
                    Continue Shopping
                </button>
            </Link>
        </motion.div>
    );
}

export default function SuccessPage() {
    return (
        <main className="min-h-screen bg-[#1A0F0A] py-20 px-4 flex items-center justify-center">
            <Suspense fallback={<div>Loading...</div>}>
                <SuccessContent />
            </Suspense>
        </main>
    );
}
