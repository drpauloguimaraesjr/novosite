"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "@/lib/gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "@/lib/gsap/SplitText";

interface SplitTextProps {
  text: string;
  className?: string;
  trigger?: any;
  delay?: number;
  interactive?: boolean;
}

export default function SplitText({ text, className, trigger, delay = 0, interactive = false }: SplitTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, GSAPSplitText);
    
    if (!textRef.current) return;

    const ctx = gsap.context(() => {
      // @ts-ignore
      const split = new GSAPSplitText(textRef.current!, {
        type: "chars,words",
        charsClass: "letter",
      });

      // Entrance Animation
      gsap.fromTo(
        split.chars,
        { 
          y: "110%",
          rotateX: -90,
          opacity: 0 
        },
        {
          y: "0%",
          rotateX: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.03,
          ease: "power4.out",
          delay: delay,
          scrollTrigger: trigger ? {
            trigger: textRef.current,
            start: "top 95%",
          } : null
        }
      );

      // Interactive Lens Effect (Eva Sanchez Style)
      if (interactive) {
        const handleMouseMove = (e: MouseEvent) => {
          const letters = split.chars;
          letters.forEach((letter: HTMLElement) => {
            const rect = letter.getBoundingClientRect();
            const letterX = rect.left + rect.width / 2;
            const letterY = rect.top + rect.height / 2;
            
            const distance = Math.hypot(e.clientX - letterX, e.clientY - letterY);
            const maxDistance = 150;
            
            if (distance < maxDistance) {
              const power = (maxDistance - distance) / maxDistance;
              gsap.to(letter, {
                scale: 1 + (power * 0.5),
                y: -power * 20,
                rotateZ: power * 10 * (e.clientX < letterX ? -1 : 1),
                duration: 0.4,
                ease: "power2.out"
              });
            } else {
              gsap.to(letter, {
                scale: 1,
                y: 0,
                rotateZ: 0,
                duration: 0.6,
                ease: "power3.out"
              });
            }
          });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
      }
    }, textRef);

    return () => ctx.revert();
  }, [delay, trigger, text, interactive]);

  return (
    <div 
      ref={containerRef}
      style={{ display: "inline-block" }}
    >
      <div 
        ref={textRef} 
        className={className} 
        style={{ display: "inline-block", perspective: "1000px" }}
      >
        {text}
      </div>
    </div>
  );
}
