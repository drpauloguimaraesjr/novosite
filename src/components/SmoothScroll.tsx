"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "@/lib/gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // ScrollTrigger needs to know about Lenis
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.8, // Aumentado para scroll mais "pesado" e luxuoso (estilo Eva Sanchez)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo out - suave no final
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8, // Reduzido para scroll mais controlado e suave
      touchMultiplier: 1.5, // Bom para mobile
      infinite: false,
      lerp: 0.1, // Interpolação linear - quanto menor, mais suave
    });

    lenisRef.current = lenis;

    // Sync ScrollTrigger with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return (
    <>
      {children}
    </>
  );
}
