'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ContactSection() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStatus('success');
        setIsSubmitting(false);
    }

    return (
        <section className="py-24 px-4 md:px-8 bg-[#150a06] relative overflow-hidden" id="contact">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-5 bg-[url('/noise.png')] mix-blend-overlay"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-[#F5E6D3] mb-6">
                        Get in Touch
                    </h2>
                    <p className="text-[#C9B8A0] max-w-2xl mx-auto">
                        Have questions about our blends? Want to partner with us? We'd love to hear from you.
                    </p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="bg-[#1A0F0A] p-8 md:p-12 rounded-2xl border border-[#2D1810]"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-[#C9B8A0] mb-2">Name</label>
                            <input
                                suppressHydrationWarning
                                type="text"
                                id="name"
                                required
                                className="w-full bg-[#0F0806] border border-[#2D1810] rounded-lg px-4 py-3 text-[#F5E6D3] focus:outline-none focus:border-[#D4A574] transition-colors"
                                placeholder="Your Name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#C9B8A0] mb-2">Email</label>
                            <input
                                suppressHydrationWarning
                                type="email"
                                id="email"
                                required
                                className="w-full bg-[#0F0806] border border-[#2D1810] rounded-lg px-4 py-3 text-[#F5E6D3] focus:outline-none focus:border-[#D4A574] transition-colors"
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <label htmlFor="message" className="block text-sm font-medium text-[#C9B8A0] mb-2">Message</label>
                        <textarea
                            suppressHydrationWarning
                            id="message"
                            rows={4}
                            required
                            className="w-full bg-[#0F0806] border border-[#2D1810] rounded-lg px-4 py-3 text-[#F5E6D3] focus:outline-none focus:border-[#D4A574] transition-colors"
                            placeholder="How can we help you?"
                        ></textarea>
                    </div>

                    <button
                        suppressHydrationWarning
                        type="submit"
                        disabled={isSubmitting || status === 'success'}
                        className={`w-full py-4 rounded-lg font-bold text-[#1A0F0A] transition-all ${status === 'success'
                            ? 'bg-green-500 cursor-default'
                            : 'bg-gradient-to-r from-[#D4A574] to-[#B08968] hover:shadow-lg hover:shadow-[#D4A574]/20'
                            }`}
                    >
                        {isSubmitting ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
                    </button>
                </motion.form>
            </div>
        </section>
    );
}
