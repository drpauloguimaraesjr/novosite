"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function Preloader() {
  const [percentage, setPercentage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  // Initial path for SSR - horizontal line (invisible)
  const initialPath = `M0 0 L2000 0 L2000 0 Q1000 0 0 0 Z`;

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
      const windowWidth = window.innerWidth;
      
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
      .to(pathRef.current, {
        attr: { d: `M0 0 L${windowWidth} 0 L${windowWidth} 0 Q${windowWidth/2} 0 0 0 Z` },
        duration: 1.2,
        ease: "power4.inOut"
      }, "+=0.1")
      .to(containerRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut"
      }, "<");
    }
  }, [percentage, mounted]);

  // Don't render complex SVG until mounted to avoid hydration mismatch
  const getPath = () => {
    if (!mounted) return initialPath;
    const w = window.innerWidth;
    const h = window.innerHeight;
    return `M0 0 L${w} 0 L${w} ${h} Q${w/2} ${h + 300} 0 ${h} Z`;
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "transparent",
        zIndex: 20000,
        overflow: "hidden"
      }}
    >
      <svg style={{ position: "absolute", top: 0, width: "100%", height: "100%" }}>
        <path 
          ref={pathRef} 
          fill="#F8F6F2" 
          d={getPath()}
        />
      </svg>

      <div className="preloader-content" style={{ position: "relative", zIndex: 1, color: "#000", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <h2 style={{ fontSize: "1.2rem", letterSpacing: "0.4em", fontWeight: 400, margin: 0 }}>DR. PAULO GUIMARÃES JR.</h2>
        </div>
        <div style={{ marginTop: "2rem", width: "160px", height: "1px", backgroundColor: "rgba(0, 0, 0, 0.1)" }}>
          <div style={{ width: `${percentage}%`, height: "100%", backgroundColor: "#000", transition: "width 0.1s linear" }} />
        </div>
        <div style={{ marginTop: "1rem", fontSize: "0.7rem", opacity: 0.4, letterSpacing: "0.1em" }}>LOADING EXPERIENCE</div>
      </div>
    </div>
  );
}
