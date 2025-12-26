"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProxyImage from "./ProxyImage";

interface CarouselSettings {
  displayTime?: number;        // tempo em ms que cada imagem fica visível
  transitionDuration?: number; // duração da transição em segundos
  transitionEffect?: string;   // "fade" | "slide" | "zoom" | "fadeZoom"
  movementIntensity?: number;  // intensidade do movimento (0-30)
}

interface HeroCarouselProps {
  images: string[];
  settings?: CarouselSettings;
}

export default function HeroCarousel({ images, settings = {} }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Default values
  const displayTime = settings.displayTime || 4000;
  const transitionDuration = settings.transitionDuration || 0.6;
  const transitionEffect = settings.transitionEffect || "fade";
  const movementIntensity = settings.movementIntensity || 15;

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (!images || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, displayTime);

    return () => clearInterval(timer);
  }, [images, displayTime]);

  // Don't show on mobile or if no images
  if (isMobile || !images || images.length === 0) {
    return null;
  }

  // Direção alternada: par = direita, ímpar = esquerda
  const moveDirection = currentIndex % 2 === 0 ? movementIntensity : -movementIntensity;

  // Define animation variants based on transition effect
  const getAnimationProps = () => {
    switch (transitionEffect) {
      case "slide":
        return {
          initial: { opacity: 0, x: 100 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -100 },
          transition: {
            opacity: { duration: transitionDuration, ease: "easeInOut" as const },
            x: { duration: transitionDuration, ease: "easeOut" as const }
          }
        };
      case "zoom":
        return {
          initial: { opacity: 0, scale: 1.2 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.9 },
          transition: {
            opacity: { duration: transitionDuration, ease: "easeInOut" as const },
            scale: { duration: transitionDuration * 1.5, ease: "easeOut" as const }
          }
        };
      case "fadeZoom":
        return {
          initial: { opacity: 0, scale: 1.08, x: -moveDirection },
          animate: { opacity: 1, scale: 1, x: moveDirection },
          exit: { opacity: 0, scale: 1.02 },
          transition: {
            opacity: { duration: transitionDuration, ease: "easeInOut" as const },
            scale: { duration: 5, ease: "easeOut" as const },
            x: { duration: 5, ease: "easeOut" as const }
          }
        };
      case "fade":
      default:
        return {
          initial: { opacity: 0, scale: 1.08, x: -moveDirection },
          animate: { opacity: 1, scale: 1, x: moveDirection },
          exit: { opacity: 0, scale: 1.02 },
          transition: {
            opacity: { duration: transitionDuration, ease: "easeInOut" as const },
            scale: { duration: 5, ease: "easeOut" as const },
            x: { duration: 5, ease: "easeOut" as const }
          }
        };
    }
  };

  const animProps = getAnimationProps();

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
        zIndex: 1, // Background layer - text will be above
      }}
    >
      {/* Gradiente esfumaçado na borda esquerda */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "180px",
          background: "linear-gradient(to right, var(--bg-color) 0%, var(--bg-color) 30%, transparent 100%)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      {/* Container das imagens */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={animProps.initial}
          animate={animProps.animate}
          exit={animProps.exit}
          transition={animProps.transition}
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

