'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    city: '',
    postalCode: '',
    notes: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#1A0F0A] py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-['Playfair_Display'] font-bold text-[#F5E6D3] mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-[#C9B8A0] text-lg mb-8">
            Add some delicious coffee to your cart before checkout.
          </p>
          <Link href="/">
            <button className="px-8 py-3 bg-gradient-to-r from-[#4F9C8F] to-[#3D8B7F] text-white font-bold rounded-lg">
              Back to Shop
            </button>
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const orderData = {
        ...formData,
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalPrice: parseFloat(total.toFixed(2)),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      await response.json();
      setMessageType('success');
      setMessage('Order placed successfully!');
      clearCart();

      setTimeout(() => {
        window.location.href = '/orders';
      }, 2000);
    } catch (error) {
      setMessageType('error');
      setMessage(error instanceof Error ? error.message : 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#1A0F0A] py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-[#4F9C8F] hover:text-[#F5E6D3] mb-6 inline-block transition-colors">
          ← Back to Home
        </Link>

        <h1 className="text-5xl font-['Playfair_Display'] font-bold text-[#F5E6D3] mb-12">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 order-1 lg:order-2 h-fit sticky top-24 bg-[#3D2820] rounded-xl p-8 border border-[#5A4034]"
          >
            <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#F5E6D3] mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-[#5A4034]">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <div>
                    <p className="text-[#F5E6D3] font-semibold text-sm">{item.product.name}</p>
                    <p className="text-[#C9B8A0] text-xs">x {item.quantity}</p>
                  </div>
                  <p className="text-[#FFD700] font-bold text-sm">
                    ${(parseFloat(item.product.price.replace('$', '')) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-[#C9B8A0] text-sm">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#C9B8A0] text-sm">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="border-t border-[#5A4034] pt-3 flex justify-between">
                <span className="text-[#F5E6D3] font-bold">Total:</span>
                <span className="text-[#FFD700] text-xl font-bold">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 order-2 lg:order-1"
          >
            <form onSubmit={handleSubmit} className="space-y-6 bg-[#3D2820] rounded-xl p-8 border border-[#5A4034]">
              <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#F5E6D3] mb-6">
                Delivery Information
              </h2>
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-bold text-[#F5E6D3] mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="customerName"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    className="px-4 py-3 bg-[#2D1810] border border-[#5A4034] rounded-lg text-[#F5E6D3] placeholder-[#8B7660]/50 focus:outline-none focus:border-[#4F9C8F] transition-colors"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="px-4 py-3 bg-[#2D1810] border border-[#5A4034] rounded-lg text-[#F5E6D3] placeholder-[#8B7660]/50 focus:outline-none focus:border-[#4F9C8F] transition-colors"
                    required
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 mt-4 bg-[#2D1810] border border-[#5A4034] rounded-lg text-[#F5E6D3] placeholder-[#8B7660]/50 focus:outline-none focus:border-[#4F9C8F] transition-colors"
                  required
                />
              </div>

              {/* Delivery Info */}
              <div>
                <h3 className="text-lg font-bold text-[#F5E6D3] mb-4">Delivery Address</h3>
                <input
                  type="text"
                  placeholder="Street Address"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, deliveryAddress: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#2D1810] border border-[#5A4034] rounded-lg text-[#F5E6D3] placeholder-[#8B7660]/50 focus:outline-none focus:border-[#4F9C8F] transition-colors mb-4"
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    name="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="px-4 py-3 bg-[#2D1810] border border-[#5A4034] rounded-lg text-[#F5E6D3] placeholder-[#8B7660]/50 focus:outline-none focus:border-[#4F9C8F] transition-colors"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    className="px-4 py-3 bg-[#2D1810] border border-[#5A4034] rounded-lg text-[#F5E6D3] placeholder-[#8B7660]/50 focus:outline-none focus:border-[#4F9C8F] transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <h3 className="text-lg font-bold text-[#F5E6D3] mb-4">Special Requests</h3>
                <textarea
                  placeholder="Any special instructions or notes..."
                  name="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#2D1810] border border-[#5A4034] rounded-lg text-[#F5E6D3] placeholder-[#8B7660]/50 focus:outline-none focus:border-[#4F9C8F] transition-colors resize-none h-20"
                />
              </div>

              {/* Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border ${messageType === 'success'
                      ? 'bg-green-900/30 border-green-600 text-green-200'
                      : 'bg-red-900/30 border-red-600 text-red-200'
                    }`}
                >
                  {messageType === 'success' ? '✓' : '✗'} {message}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-[#4F9C8F] to-[#3D8B7F] text-white font-bold text-lg rounded-lg hover:shadow-2xl hover:shadow-[#4F9C8F]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
