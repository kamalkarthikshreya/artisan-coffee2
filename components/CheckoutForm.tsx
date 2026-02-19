'use client';

import { useState } from 'react';
import { CartItem } from '@/context/CartContext';
import { motion } from 'framer-motion';

interface CheckoutFormProps {
  items: CartItem[];
}

export default function CheckoutForm({ items }: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: formData
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout failed:', data.error);
        alert('Checkout failed. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClasses = "w-full bg-[#1A0F0A] border border-white/10 rounded-lg px-4 py-3 text-amber-50 outline-none focus:border-[#D4A574] transition-colors placeholder:text-white/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
      <h2 className="text-2xl font-bold text-[#F5E6D3] mb-6 font-['Playfair_Display']">Shipping Details</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-[#D4A574] mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className={inputClasses}
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm text-[#D4A574] mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={inputClasses}
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm text-[#D4A574] mb-1">Street Address</label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            className={inputClasses}
            placeholder="123 Coffee Lane"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#D4A574] mb-1">City</label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className={inputClasses}
              placeholder="New York"
            />
          </div>
          <div>
            <label className="block text-sm text-[#D4A574] mb-1">ZIP Code</label>
            <input
              type="text"
              name="zip"
              required
              value={formData.zip}
              onChange={handleChange}
              className={inputClasses}
              placeholder="10001"
            />
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
        type="submit"
        className={`w-full py-4 mt-8 rounded-lg font-bold text-white text-lg transition-all
                    ${isLoading
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#D4A574] to-[#B08968] hover:shadow-lg hover:shadow-[#D4A574]/20'
          }`}
      >
        {isLoading ? 'Processing...' : 'Proceed to Payment'}
      </motion.button>
      <div className="text-center mt-4">
        <p className="text-xs text-white/40">Secure payment powered by Stripe</p>
      </div>
    </form>
  );
}
