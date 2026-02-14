"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface TextMaskRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "left" | "right" | "up" | "down";
  duration?: number;
  trigger?: boolean;
  maskColor?: string;
}

/**
 * Text Mask Reveal - Estilo Eva Sanchez
 * Uma barra colorida passa DA ESQUERDA PARA DIREITA revelando o texto
 */
export default function TextMaskReveal({ 
  children,
  delay = 0,
  direction = "left",
  duration = 0.6,
  trigger = false,
  maskColor = "#000000"
}: TextMaskRevealProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (isRevealed) return;
    
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Inicializa overlay cobrindo tudo
    gsap.set(overlay, { xPercent: 0 });

    // Função para animar
    const reveal = () => {
      setIsRevealed(true);
      
      let toProps: gsap.TweenVars = {};
      
      switch (direction) {
        case "left":
          toProps = { xPercent: 100 }; // Sai pela direita
          break;
        case "right":
          toProps = { xPercent: -100 }; // Sai pela esquerda
          break;
        case "up":
          toProps = { yPercent: -100 }; // Sai por cima
          break;
        case "down":
          toProps = { yPercent: 100 }; // Sai por baixo
          break;
      }
      
      gsap.to(overlay, {
        ...toProps,
        duration: duration,
        ease: "power3.inOut",
      });
    };

    // Dispara após o delay
    const timer = setTimeout(reveal, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [delay, direction, duration, isRevealed]);

  return (
    <span 
      style={{
        position: "relative",
        display: "inline-block",
        overflow: "hidden",
      }}
    >
      {/* Texto - sempre renderizado */}
      <span style={{ 
        display: "inline-block",
        visibility: isRevealed ? "visible" : "visible", // Sempre visível
      }}>
        {children}
      </span>
      
      {/* Overlay/Mask - cor que combina com o fundo */}
      <span
        ref={overlayRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: maskColor,
          pointerEvents: "none",
        }}
      />
    </span>
  );
}
