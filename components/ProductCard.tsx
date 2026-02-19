'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/CartContext';

interface Product {
    id: string;
    name: string;
    price: string;
    rating: number;
    description: string;
    image: string;
}

interface ProductCardProps {
    product: Product;
    index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
    const [showNotification, setShowNotification] = useState(false);
    const { addItem } = useCart();

    const handleAddToCart = () => {
        addItem(product, 1);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -8 }}
                className="h-full bg-[#3D2820]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#5A4034] hover:border-[#4F9C8F] transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#4F9C8F]/30 flex flex-col"
            >
                {/* Star Rating */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-[#FFD700] text-lg">★</span>
                    <span className="text-[#F5E6D3] font-semibold text-sm">{product.rating}</span>
                </div>

                {/* Coffee Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-48 sm:h-56 bg-gradient-to-br from-[#4F9C8F]/20 to-[#3D8B7F]/20 rounded-xl mb-6 overflow-hidden flex items-center justify-center"
                >
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={180}
                        height={180}
                        className="object-contain w-full h-full"
                        unoptimized
                        priority={index < 3}
                    />
                </motion.div>

                {/* Title & Description */}
                <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-['Playfair_Display'] font-bold text-[#F5E6D3] mb-2">
                        {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#C9B8A0] mb-6 min-h-[2.5rem] line-clamp-2 font-['Inter']">
                        {product.description}
                    </p>
                </div>

                {/* Price & Add Button */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#5A4034]/50">
                    <span className="text-2xl sm:text-3xl font-bold text-[#FFD700] font-['Inter']">
                        {product.price}
                    </span>
                    <motion.button
                        suppressHydrationWarning
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleAddToCart}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4F9C8F] to-[#3D8B7F] flex items-center justify-center hover:shadow-2xl hover:shadow-[#4F9C8F]/50 transition-all duration-300"
                        title="Add to cart"
                    >
                        <span className="text-white text-2xl font-bold">+</span>
                    </motion.button>
                </div>
            </motion.div>

            {/* Add to Cart Notification */}
            <AnimatePresence>
                {showNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg 
font-semibold shadow-lg z-40"
                    >
                        ✓ Added to cart!
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
