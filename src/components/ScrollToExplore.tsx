"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";

const SCRAMBLE_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789';

function useTextScramble(originalText: string) {
  const [displayText, setDisplayText] = useState(originalText);
  const [isHovering, setIsHovering] = useState(false);
  const frameRef = useRef<number>(0);

  const scramble = useCallback(() => {
    let iteration = 0;
    const maxIterations = originalText.length * 3;

    const animate = () => {
      setDisplayText(
        originalText
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === '[' || char === ']') return char;
            if (index < iteration / 3) return originalText[index];
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join('')
      );

      iteration++;
      if (iteration < maxIterations) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(originalText);
      }
    };

    animate();
  }, [originalText]);

  const handleMouseEnter = useCallback(() => {
    if (!isHovering) {
      setIsHovering(true);
      scramble();
    }
  }, [isHovering, scramble]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    setDisplayText(originalText);
  }, [originalText]);

  return { displayText, handleMouseEnter, handleMouseLeave };
}

export default function ScrollToExplore() {
  const { displayText, handleMouseEnter, handleMouseLeave } = useTextScramble(
    '[SCROLL TO EXPLORE]'
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      style={{
        position: "absolute",
        bottom: "40px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          color: "var(--text-color)",
          opacity: 0.6,
          cursor: "pointer",
          transition: "opacity 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
      >
        {displayText}
      </span>
    </motion.div>
  );
}

