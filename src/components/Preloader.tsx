"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { AnimatedLogo } from "./AnimatedLogo";

export default function Preloader() {
  const [percentage, setPercentage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setPercentage((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 15);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (percentage === 100 && mounted) {
      
      const tl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) containerRef.current.style.display = "none";
        }
      });

      tl.to(".preloader-content", {
        opacity: 0,
        y: -40,
        duration: 0.8,
        ease: "power3.inOut"
      })
      .to(containerRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut"
      }, "+=0.2");
    }
  }, [percentage, mounted]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#F8F6F2",
        zIndex: 20000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div className="preloader-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        
        {/* Logo Animado Pequeno (Substituindo a barra de loading) */}
        <AnimatedLogo size={240} speed={2} />

        <div style={{ position: "relative", overflow: "hidden", textAlign: "center" }}>
          <h2 style={{ fontSize: "0.9rem", letterSpacing: "0.2em", fontWeight: 500, margin: 0, color: "#000000" }}>
            DR. PAULO GUIMARÃES JR.
          </h2>
        </div>
        
        {/* Loading status opcional, bem sutil */}
        <div style={{ fontSize: "0.6rem", opacity: 0.3, letterSpacing: "0.1em", color: "#000000" }}>
          LOADING EXPERIENCE... {percentage}%
        </div>
      </div>
    </div>
  );
}
