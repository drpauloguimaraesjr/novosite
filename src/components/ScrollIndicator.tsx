"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function ScrollIndicator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const maskRef = useRef<HTMLSpanElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [textWidth, setTextWidth] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const squareSize = 14;

  // ---- Phrase cycling ----
  const phrases = ["ROLE PARA BAIXO", "PRESSIONE ESPAÇO", "PRESS SPACE"];
  const [phraseIdx, setPhraseIdx] = useState(0);
  const phrase = phrases[phraseIdx];

  // Update dimensions whenever phrase changes (text may have different width)
  useEffect(() => {
    const updateDimensions = () => {
      if (textRef.current) {
        setTextWidth(textRef.current.offsetWidth);
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [phrase]);

  // Theme detection (unchanged)
  useEffect(() => {
    const checkDarkTheme = () => {
      setIsDark(document.body.classList.contains("dark-theme"));
    };
    checkDarkTheme();
    const observer = new MutationObserver(checkDarkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Main animation – runs once per phrase, then switches phrase
  useEffect(() => {
    if (!squareRef.current || !maskRef.current || !textRef.current || textWidth === 0) return;

    const startX = -squareSize;
    const endX = textWidth + squareSize;
    const totalDistance = endX - startX;

    // Reset square position before each run
    gsap.set(squareRef.current, { x: startX });
    // Fade in text (smooth) at start of each cycle
    gsap.fromTo(
      [textRef.current, maskRef.current],
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power1.out" }
    );

    const tl = gsap.timeline({
      onComplete: () => {
        // Switch to next phrase when animation finishes
        setPhraseIdx((i) => (i + 1) % phrases.length);
      },
      defaults: { ease: "none" },
    });

    // Movement with custom ease – slow start, fast end (power4.in)
    tl.to(squareRef.current, {
      x: totalDistance,
      duration: 1.8,
      ease: "power4.in",
      onUpdate: function () {
        if (maskRef.current && squareRef.current && textRef.current) {
          const squareX = gsap.getProperty(squareRef.current, "x") as number;
          maskRef.current.style.left = `${-squareX}px`;
        }
      },
    });

    // Rotation (continuous) – keep same duration
    const rotationAnim = gsap.to(squareRef.current, {
      rotation: 360,
      duration: 1.8,
      repeat: -1,
      ease: "linear",
      transformOrigin: "center center",
    });

    // Pulse (scale) – subtle
    const pulseAnim = gsap.to(squareRef.current, {
      scale: 1.05,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    // Decorative line animation (once per cycle)
    if (lineRef.current) {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1.5, delay: 0.2, ease: "power3.inOut", transformOrigin: "left center" }
      );
    }

    return () => {
      tl.kill();
      rotationAnim.kill();
      pulseAnim.kill();
    };
  }, [textWidth, phraseIdx]);

  return (
    <div
      ref={containerRef}
      className="scroll-indicator-container"
      style={{
        position: "fixed",
        bottom: "40px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: "20px",
        pointerEvents: "none",
      }}
    >
      {/* Text container */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <span
          ref={textRef}
          className="sub-label"
          style={{
            color: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
            position: "relative",
            display: "inline-block",
            whiteSpace: "nowrap",
            zIndex: 1,
            transition: "color 0.3s ease",
          }}
        >
          {phrase}
        </span>
      </div>

      {/* Moving square with inverted text */}
      <div
        ref={squareRef}
        style={{
          position: "absolute",
          top: "50%",
          left: -squareSize,
          width: `${squareSize}px`,
          height: `${squareSize}px`,
          backgroundColor: isDark ? "#fff" : "#0d0202",
          transform: "translateY(-50%)",
          zIndex: 3,
          borderRadius: "2px",
          overflow: "hidden",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <span
          ref={maskRef}
          className="sub-label"
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            transform: "translateY(-50%)",
            color: isDark ? "#000" : "#fff",
            whiteSpace: "nowrap",
            mixBlendMode: "difference",
            pointerEvents: "none",
            textAlign: "center",
            padding: "0 20px",
          }}
        >
          {phrase}
        </span>
      </div>

      {/* Decorative line */}
      <div
        ref={lineRef}
        className="scroll-line"
        style={{
          width: "60px",
          height: "1px",
          backgroundColor: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
          transformOrigin: "left center",
          transition: "background-color 0.3s ease",
        }}
      />
    </div>
  );
}
