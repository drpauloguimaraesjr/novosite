"use client";

import { useState, useRef, useCallback } from "react";

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
            if (char === ' ') return ' ';
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

interface ScrambleLinkProps {
  href: string;
  label: string;
  className?: string;
  cursorText?: string;
}

export default function ScrambleLink({ href, label, className = "nav-link", cursorText = "VIEW" }: ScrambleLinkProps) {
  const { displayText, handleMouseEnter, handleMouseLeave } = useTextScramble(label);

  return (
    <a
      href={href}
      className={className}
      data-cursor-text={cursorText}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </a>
  );
}
