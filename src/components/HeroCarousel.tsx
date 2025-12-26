"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProxyImage from "./ProxyImage";

interface HeroCarouselProps {
  images: string[];
  interval?: number; // tempo entre slides em ms
}

export default function HeroCarousel({ images, interval = 5000 }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    if (!images || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
        width: "45%",
        height: "70%",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Gradiente esfumaçado na borda esquerda */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "150px",
          background: "linear-gradient(to right, var(--bg-color) 0%, var(--bg-color) 20%, transparent 100%)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      {/* Container das imagens */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: [0, -10, 0], // movimento sutil horizontal
          }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{
            opacity: { duration: 1.2, ease: "easeInOut" },
            scale: { duration: 8, ease: "easeOut" },
            x: { duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
          }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <ProxyImage
            src={images[currentIndex]}
            alt={`Hero slide ${currentIndex + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Indicadores de slide (pontos) */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          display: "flex",
          gap: "8px",
          zIndex: 20,
        }}
      >
        {images.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: idx === currentIndex ? "var(--text-color)" : "rgba(0,0,0,0.3)",
              transition: "background-color 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
