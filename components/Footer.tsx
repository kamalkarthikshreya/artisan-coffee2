'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <footer className="bg-[#0F0806] text-[#C9B8A0] py-16 border-t border-[#2D1810]">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-['Playfair_Display'] font-bold text-[#F5E6D3]">
                            Artisan Coffee
                        </h3>
                        <p className="text-sm leading-relaxed">
                            Crafting the perfect cup, one bean at a time. Experience the true essence of coffee.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-['Playfair_Display'] font-semibold text-[#F5E6D3]">
                            Explore
                        </h4>
                        <nav className="flex flex-col space-y-2">
                            <Link href="/" className="hover:text-[#D4A574] transition-colors">Home</Link>
                            <Link href="/about" className="hover:text-[#D4A574] transition-colors">Our Story</Link>
                            <Link href="/shop" className="hover:text-[#D4A574] transition-colors">Shop Coffee</Link>
                            <Link href="/locations" className="hover:text-[#D4A574] transition-colors">Locations</Link>
                        </nav>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-['Playfair_Display'] font-semibold text-[#F5E6D3]">
                            Visit Us
                        </h4>
                        <p className="text-sm leading-relaxed">
                            123 Coffee Lane<br />
                            Brewing District, NY 10012<br />
                            <br />
                            hello@artisancoffee.com<br />
                            +1 (555) 123-4567
                        </p>
                    </div>

                    {/* Newsletter Form */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-['Playfair_Display'] font-semibold text-[#F5E6D3]">
                            Stay Updated
                        </h4>
                        <p className="text-sm">Subscribe for latest blends and offers.</p>
                        <form className="flex flex-col space-y-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                suppressHydrationWarning
                                type="email"
                                placeholder="Enter your email"
                                className="bg-[#1A0F0A] border border-[#2D1810] rounded px-4 py-2 text-sm focus:outline-none focus:border-[#D4A574] transition-colors"
                            />
                            <button
                                suppressHydrationWarning
                                type="submit"
                                className="bg-[#D4A574] text-[#1A0F0A] font-bold py-2 rounded hover:bg-[#B08968] transition-colors text-sm"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-[#2D1810] flex flex-col md:flex-row justify-between items-center text-xs text-[#8A7A68]">
                    <p>&copy; {new Date().getFullYear()} Artisan Coffee. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-[#D4A574]">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-[#D4A574]">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
