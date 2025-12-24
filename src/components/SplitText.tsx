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

      // Entrance Animation - Apenas fade e scale, sem rotação
      gsap.fromTo(
        split.chars,
        { 
          opacity: 0,
          scale: 0.8
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.02,
          ease: "power3.out",
          delay: delay,
          scrollTrigger: trigger ? {
            trigger: textRef.current,
            start: "top 95%",
          } : null
        }
      );

      // Interactive Lens Effect - Estilo Eva Sanchez
      // Aplica efeito apenas nas letras que o cursor está realmente sobrepondo
      if (interactive) {
        const handleMouseMove = (e: MouseEvent) => {
          const letters = split.chars;
          const mouseX = e.clientX;
          const mouseY = e.clientY;
          
          letters.forEach((letter: HTMLElement) => {
            const rect = letter.getBoundingClientRect();
            
            // Verifica se o cursor está realmente sobre a letra
            const isOverLetter = (
              mouseX >= rect.left &&
              mouseX <= rect.right &&
              mouseY >= rect.top &&
              mouseY <= rect.bottom
            );
            
            if (isOverLetter) {
              // Calcula a distância do cursor até o centro da letra
              const letterCenterX = rect.left + rect.width / 2;
              const letterCenterY = rect.top + rect.height / 2;
              const distanceX = mouseX - letterCenterX;
              const distanceY = mouseY - letterCenterY;
              
              // Distância máxima para calcular a força do efeito (baseada no tamanho da letra)
              const maxDistance = Math.max(rect.width, rect.height) * 0.8;
              const distance = Math.hypot(distanceX, distanceY);
              
              // Força do efeito baseada na proximidade do centro da letra
              // Quanto mais próximo do centro, maior o efeito
              const power = Math.max(0, 1 - (distance / maxDistance));
              
              // Efeito de lente: zoom nas letras que o cursor está sobrepondo
              const scale = 1 + (power * 1.5); // Zoom mais pronunciado
              
              // Movimento suave em direção ao cursor
              const moveX = distanceX * power * 0.3;
              const moveY = distanceY * power * 0.3;
              
              gsap.to(letter, {
                scale: scale,
                x: moveX,
                y: moveY,
                duration: 0.3,
                ease: "power2.out",
                overwrite: true
              });
            } else {
              // Retorna ao estado normal suavemente quando o cursor não está sobre a letra
              gsap.to(letter, {
                scale: 1,
                x: 0,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
                overwrite: true
              });
            }
          });
        };

        // Adicionar listener no container do texto para melhor performance
        const container = containerRef.current || textRef.current;
        if (container) {
          container.addEventListener("mousemove", handleMouseMove);
          
          // Reset quando o mouse sai do container
          const handleMouseLeave = () => {
            split.chars.forEach((letter: HTMLElement) => {
              gsap.to(letter, {
                scale: 1,
                x: 0,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
                overwrite: true
              });
            });
          };
          
          container.addEventListener("mouseleave", handleMouseLeave);
          
          return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
          };
        }
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
        style={{ 
          display: "inline-block", 
          position: "relative",
          willChange: interactive ? "transform" : "auto"
        }}
      >
        {text}
      </div>
    </div>
  );
}
