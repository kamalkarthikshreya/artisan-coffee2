'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import ProductCard from './ProductCard';
import { coffeeProducts } from '@/data/products';

export default function ProductShowcase() {
    return (
        <section className="py-24 px-4 md:px-8 relative">
            {/* Coffee Splash Banner */}
            <motion.div
                initial={{ opacity: 0, y: -100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative h-64 mb-16 rounded-3xl overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[#3D2418] via-[#4D3428] 
to-[#3D2418]" />
                <Image
                    src="/coffee/splash-banner.svg"
                    alt="Coffee Splash"
                    fill
                    className="absolute inset-0 object-cover mix-blend-overlay opacity-60"
                    unoptimized
                />

                {/* Floating Coffee Beans */}
                {/* Hydration fix: Only render random beans after mount */}
                <BeanAnimation />
            </motion.div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-6xl md:text-7xl font-['Playfair_Display'] font-bold text-center 
text-[#F5E6D3] mb-16"
                >
                    Our Signature Blends
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 px-2 md:px-0">
                    {coffeeProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function BeanAnimation() {
    // Generate deterministic values or wait for client side
    // Simple approach: rendering beans only on client to avoid mismatch
    // In a real app, you might use a seedable PRNG or useEffect

    // We'll use a fixed array of positions initially to match server, 
    // but honestly random position is hard to match without a seed.
    // Better approach for "floating random items": use a client-only component or useEffect.

    return (
        <>
            {[...Array(8)].map((_, i) => (
                <FloatingBean key={i} index={i} />
            ))}
        </>
    );
}

function FloatingBean({ index }: { index: number }) {
    // Generate random values only once per component instance (client-side)
    // to avoid re-render jitters, we can use useMemo if needed, 
    // but here we just want to avoid the server/client mismatch.
    // The mismatch error comes because the HTML from server has one random # 
    // and client generates another.

    // Fix: Use simple deterministic values based on index for initial render, 
    // or use a client-side only render trigger.

    // Let's use deterministic values for the initial position to be safe/simple
    // AND consistent.
    const left = 10 + index * 12;
    const top = 30 + (index % 3) * 15; // Semi-random looking but deterministic
    const duration = 3 + (index % 4) * 0.5;

    return (
        <motion.div
            initial={{ y: 0 }}
            animate={{
                y: [0, -20, 0],
                x: [0, (index % 2 === 0 ? 1 : -1) * 10, 0], // Deterministic shimmy
                rotate: [0, 360]
            }}
            transition={{
                repeat: Infinity,
                duration: duration,
                delay: index * 0.3
            }}
            className="absolute w-8 h-8 opacity-40"
            style={{
                left: `${left}%`,
                top: `${top}%`
            }}
        >
            <Image src="/coffee/bean.svg" alt="Coffee Bean" width={32} height={32} className="w-full h-full object-contain" unoptimized />
        </motion.div>
    );
}
