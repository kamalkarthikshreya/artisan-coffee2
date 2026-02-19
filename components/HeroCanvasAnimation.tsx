'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroCanvasAnimation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Animation State
    const [activeTextIndex, setActiveTextIndex] = useState(0);

    // Loading State
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);

    // Simulated Loading Progress (since video loads in streams)
    useEffect(() => {
        if (videoLoaded) {
            const timer = setTimeout(() => setLoadProgress(100), 0);
            return () => clearTimeout(timer);
        }

        const interval = setInterval(() => {
            setLoadProgress(prev => {
                if (prev >= 90) return prev; // Stall at 90 until loaded
                return prev + 10;
            });
        }, 200);

        return () => clearInterval(interval);
    }, [videoLoaded]);

    const handleVideoLoad = () => {
        setVideoLoaded(true);
    };

    const handleVideoError = () => {
        console.warn("Video failed to load: hero-coffee.mp4 not found or format unsupported.");
        // Dismiss loader anyway so user can see the fallback content
        setVideoLoaded(true);
    };

    // Text cycling logic
    useEffect(() => {
        if (!videoLoaded) return;

        // Change text every 4 seconds for better readability
        const textInterval = setInterval(() => {
            setActiveTextIndex(prev => (prev + 1) % 4);
        }, 4000);

        return () => clearInterval(textInterval);
    }, [videoLoaded]);

    // Scroll opacity for fade out
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start']
    });

    const opacityResults = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // Text overlay animations - simplified
    const renderText = (index: number, title: string, subtitle: string, isButton = false) => (
        <motion.div
            key={`text-${index}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{
                opacity: activeTextIndex === index ? 1 : 0,
                y: activeTextIndex === index ? 0 : 30,
                pointerEvents: activeTextIndex === index ? 'auto' : 'none'
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`absolute px-4 text-center ${index === 1 || index === 2 ? 'max-w-4xl px-8 md:px-16' : ''}`}
        >
            <h1 className={`${index === 0 ? 'text-7xl md:text-9xl' : index === 3 ? 'text-6xl md:text-8xl' : 'text-5xl md:text-7xl'} 
                font-['Playfair_Display'] font-bold tracking-tight text-amber-50 drop-shadow-2xl mb-4`}>
                {title}
            </h1>
            {!isButton ? (
                <p className="font-['Inter'] text-xl md:text-2xl text-amber-100/90 drop-shadow-lg font-light tracking-wide">
                    {subtitle}
                </p>
            ) : (
                <motion.button
                    suppressHydrationWarning
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 rounded-full bg-gradient-to-r from-[#4F9C8F] to-[#3D8B7F] px-10 py-5 text-xl font-semibold text-white shadow-2xl hover:shadow-[#4F9C8F]/40 transition-shadow"
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                >
                    Explore Collection ↓
                </motion.button>
            )}
        </motion.div>
    );

    return (
        <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#1A0F0A]">
            {/* Loading Screen */}
            {!videoLoaded && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#1A0F0A]">
                    <div className="mb-4 h-2 w-64 overflow-hidden rounded-full bg-amber-900/30">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#D4A574] to-[#4F9C8F]"
                            initial={{ width: '0%' }}
                            animate={{ width: `${loadProgress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <p className="font-['Inter'] text-lg text-amber-100/70 tracking-widest uppercase text-xs">
                        Brewing...
                    </p>
                </div>
            )}

            <motion.div
                style={{ opacity: opacityResults }}
                className={`relative h-full w-full transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            >
                {/* Video Background */}
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onCanPlayThrough={handleVideoLoad}
                    onError={handleVideoError}
                    className="absolute inset-0 h-full w-full object-cover md:object-cover sm:object-cover mobile-video-fix"
                    poster="/coffee/hero-placeholder.svg"
                    style={{ objectPosition: 'center' }}
                >
                    <source src="/video/hero-coffee.mp4" type="video/mp4" />
                    {/* Fallback for older browsers */}
                    Your browser does not support the video tag.
                </video>

                {/* Overlay Gradient for Text Readability */}
                <div className="absolute inset-0 bg-black/20" />

                {/* Text Overlays - Auto Cycling */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {renderText(0, "Experience Coffee", "Where every sip defies gravity")}
                    {renderText(1, "Crafted to Perfection", "From bean to cup, excellence floats in every drop")}
                    {renderText(2, "Anti-Gravity Flavor", "Defying expectations, elevating taste beyond limits")}
                    {renderText(3, "Discover Your Blend", "", true)}
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: videoLoaded ? 1 : 0 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
                >
                    <p className="text-white/60 text-xs font-['Inter'] tracking-[0.2em] uppercase">
                        Scroll to Explore
                    </p>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="w-6 h-10 border border-white/30 rounded-full flex items-start justify-center p-2 backdrop-blur-sm"
                    >
                        <div className="w-1 h-2 bg-white/80 rounded-full" />
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
