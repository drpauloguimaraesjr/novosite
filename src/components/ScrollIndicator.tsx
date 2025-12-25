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

  useEffect(() => {
    const updateDimensions = () => {
      if (textRef.current) {
        setTextWidth(textRef.current.offsetWidth);
      }
    };

    const checkDarkTheme = () => {
      setIsDark(document.body.classList.contains("dark-theme"));
    };

    updateDimensions();
    checkDarkTheme();
    
    window.addEventListener("resize", updateDimensions);
    
    // Observar mudanças no tema
    const observer = new MutationObserver(checkDarkTheme);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => {
      window.removeEventListener("resize", updateDimensions);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!squareRef.current || !maskRef.current || !textRef.current || textWidth === 0) return;

    // O quadrado percorre APENAS do início ao fim do texto (do "[" ao "]")
    // Começa antes do texto e termina depois do texto
    const startX = -squareSize;
    const endX = textWidth + squareSize;
    const totalDistance = endX - startX;

    // Timeline para animações sincronizadas (movimento + rotação + pulsação)
    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: "none" }
    });

    // Animação principal de movimento com curva cubic-bezier similar ao CSS original
    // cubic-bezier(0.128, 1.000, 1.000, 1.000) ≈ power4.out no GSAP
    tl.to(squareRef.current, {
      x: totalDistance,
      duration: 1.8,
      ease: "power4.out",
      onUpdate: function() {
        if (maskRef.current && squareRef.current && textRef.current) {
          // Posição atual do quadrado
          const squareX = gsap.getProperty(squareRef.current, "x") as number;
          
          // O texto dentro do quadrado precisa se mover na direção oposta
          // para ficar alinhado com o texto base atrás
          // Compensar: posição do texto base (0) - posição atual do quadrado
          maskRef.current.style.left = `${-squareX}px`;
        }
      }
    });

    // Animação de rotação 360° sincronizada com o movimento
    const rotationAnim = gsap.to(squareRef.current, {
      rotation: 360,
      duration: 1.8,
      repeat: -1,
      ease: "linear",
      transformOrigin: "center center"
    });

    // Animação de pulsação sutil (escala)
    const pulseAnim = gsap.to(squareRef.current, {
      scale: 1.05,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    // Animação da linha decorativa
    if (lineRef.current) {
      gsap.fromTo(lineRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        { 
          scaleX: 1, 
          duration: 1.5, 
          delay: 1, 
          ease: "power3.inOut",
          transformOrigin: "left center"
        }
      );
    }

    return () => {
      tl.kill();
      rotationAnim.kill();
      pulseAnim.kill();
    };
  }, [textWidth]);

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
        pointerEvents: "none"
      }}
    >
      {/* Container do texto com efeito */}
      <div
        style={{
          position: "relative",
          display: "inline-block"
        }}
      >
        {/* Texto base - muda de cor baseado no tema */}
        <span 
          ref={textRef}
          className="sub-label"
          style={{
            color: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
            position: "relative",
            display: "inline-block",
            whiteSpace: "nowrap",
            zIndex: 1,
            transition: "color 0.3s ease"
          }}
        >
          [ SCROLL TO EXPLORE ]
        </span>
      </div>

      {/* Quadrado que caminha pelo texto com texto invertido DENTRO */}
      {/* Seguindo a estrutura CSS original: o texto fica dentro do quadrado */}
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
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
        }}
      >
        {/* Texto invertido dentro do quadrado */}
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
            padding: "0 20px"
          }}
        >
          [ SCROLL TO EXPLORE ]
        </span>
      </div>

      {/* Linha decorativa */}
      <div 
        ref={lineRef}
        className="scroll-line"
        style={{
          width: "60px",
          height: "1px",
          backgroundColor: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
          transformOrigin: "left center",
          transition: "background-color 0.3s ease"
        }}
      />
    </div>
  );
}

