"use client";

import { useState, useRef } from "react";

// ============================================
// EFEITO DE SCRAMBLE NOS LINKS
// ============================================
const useTextScramble = (originalText: string) => {
  const [displayText, setDisplayText] = useState(originalText);
  const [isHovering, setIsHovering] = useState(false);
  const frameRef = useRef<number>(0);
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789';

  const scramble = () => {
    let iteration = 0;
    const maxIterations = originalText.length * 3;

    const animate = () => {
      setDisplayText(
        originalText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / 3) return originalText[index];
            return chars[Math.floor(Math.random() * chars.length)];
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
  };

  const handleMouseEnter = () => {
    if (!isHovering) {
      setIsHovering(true);
      scramble();
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    setDisplayText(originalText);
  };

  return { displayText, handleMouseEnter, handleMouseLeave };
};

// ============================================
// COMPONENTE SCRAMBLE LINK
// ============================================
export default function ScrambleLink({
  text,
  href = '#',
  className = ''
}: {
  text: string;
  href?: string;
  className?: string;
}) {
  const { displayText, handleMouseEnter, handleMouseLeave } = useTextScramble(text);

  return (
    <a
      href={href}
      className={`scramble-link ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </a>
  );
}
