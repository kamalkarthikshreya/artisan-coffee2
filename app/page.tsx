'use client';

import HeroCanvasAnimation from '@/components/HeroCanvasAnimation';
import ProductShowcase from '@/components/ProductShowcase';
import FeatureSection from '@/components/FeatureSection';
import FinalCTA from '@/components/FinalCTA';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  return (
    <main className="bg-[#1A0F0A] overflow-hidden">
      {/* Video Hero Section */}
      <HeroCanvasAnimation />

      {/* Product Showcase */}
      <ProductShowcase />

      {/* Features Section */}
      <FeatureSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Final CTA */}
      <FinalCTA />
    </main>
  );
}
