'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/CartContext';
import Image from 'next/image';

const ShoppingBagIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const XIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" /><path d="m6 6 18 18" />
  </svg>
);

export default function Header() {
  const { items, removeItem, total } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#1A0F0A]/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 md:w-10 md:h-10">
              {/* Simple text logo fallback if image missing */}
              <div className="w-full h-full bg-[#D4A574] rounded-full flex items-center justify-center font-bold text-[#1A0F0A]">
                A
              </div>
            </div>
            <span className="text-xl md:text-2xl font-['Playfair_Display'] font-bold text-[#F5E6D3]">
              Artisan Coffee
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-[#F5E6D3] hover:text-[#D4A574] transition-colors font-medium">
              Shop
            </Link>
            <Link href="/orders" className="text-[#F5E6D3] hover:text-[#D4A574] transition-colors font-medium">
              Orders
            </Link>
          </nav>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-[#F5E6D3] hover:text-[#D4A574] transition-colors"
          >
            <ShoppingBagIcon size={24} />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-[#4F9C8F] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
        </div>
      </motion.header>

      {/* Cart Sidebar Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#2D1810] z-50 shadow-2xl border-l border-[#5A4034] p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#F5E6D3]">Your Cart</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-[#C9B8A0] hover:text-white transition-colors"
                >
                  <XIcon size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6">
                {items.length === 0 ? (
                  <div className="text-center text-[#C9B8A0] mt-20">
                    <ShoppingBagIcon size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  items.map((item) => {
                    if (!item?.product) return null;
                    return (
                      <div key={item.product.id} className="flex gap-4 p-4 bg-[#3D2820]/50 rounded-lg border border-[#5A4034]/30">
                        <div className="relative w-20 h-20 bg-[#1A0F0A] rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-contain p-2"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#F5E6D3]">{item.product.name}</h3>
                          <p className="text-[#4F9C8F] font-bold">{item.product.price}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-[#C9B8A0]">Qty: {item.quantity}</span>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-red-400 hover:text-red-300 text-sm underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-[#5A4034]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[#C9B8A0]">Total</span>
                  <span className="text-2xl font-bold text-[#F5E6D3]">${total.toFixed(2)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className={`block w-full py-4 text-center rounded-lg font-bold transition-all ${items.length === 0
                    ? 'bg-[#5A4034] text-[#C9B8A0] cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#D4A574] to-[#B08968] text-[#1A0F0A] hover:shadow-lg hover:shadow-[#D4A574]/20'
                    }`}
                  style={{ pointerEvents: items.length === 0 ? 'none' : 'auto' }}
                >
                  Proceed to Checkout
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
