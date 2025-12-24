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

    // Animação do quadrado com curva de aceleração/desaceleração
    // power2.inOut = velocidade menor nas extremidades, maior no meio
    const animation = gsap.to(squareRef.current, {
      x: totalDistance,
      duration: 6,
      repeat: -1,
      ease: "power2.inOut", // Velocidade menor nas extremidades, maior no meio
      onUpdate: function() {
        if (maskRef.current && squareRef.current && textRef.current) {
          // Posição atual do quadrado em relação ao container
          const squareX = gsap.getProperty(squareRef.current, "x") as number;
          
          // Posição do quadrado relativa ao texto (o texto começa em 0)
          const squareRelativeLeft = squareX - squareSize / 2;
          const squareRelativeRight = squareX + squareSize / 2;
          
          // Verifica se o quadrado está sobrepondo o texto
          if (squareRelativeRight >= 0 && squareRelativeLeft <= textWidth) {
            // Calcula a interseção entre o quadrado e o texto
            const intersectionStart = Math.max(0, squareRelativeLeft);
            const intersectionEnd = Math.min(textWidth, squareRelativeRight);
            
            // Aplica o clipPath para revelar apenas a parte onde o quadrado está
            // clipPath: inset(top right bottom left)
            maskRef.current.style.clipPath = `inset(0 ${textWidth - intersectionEnd}px 0 ${intersectionStart}px)`;
            maskRef.current.style.opacity = "1";
          } else {
            // Esconde o texto invertido quando o quadrado não está sobre ele
            maskRef.current.style.clipPath = "inset(0 100% 0 0)";
            maskRef.current.style.opacity = "0";
          }
        }
      }
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
      animation.kill();
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

        {/* Texto invertido com máscara que segue o quadrado */}
        {/* No modo claro: branco sobre fundo preto do quadrado */}
        {/* No modo escuro: preto sobre fundo branco do quadrado */}
        <span
          ref={maskRef}
          className="sub-label"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            color: isDark ? "#000" : "#fff",
            display: "inline-block",
            whiteSpace: "nowrap",
            mixBlendMode: isDark ? "normal" : "difference",
            zIndex: 2,
            clipPath: "inset(0 100% 0 0)",
            opacity: 0,
            transition: "opacity 0.2s ease, color 0.3s ease"
          }}
        >
          [ SCROLL TO EXPLORE ]
        </span>
      </div>

      {/* Quadrado que caminha apenas pelo texto */}
      {/* No modo claro: preto */}
      {/* No modo escuro: branco */}
      <div
        ref={squareRef}
        style={{
          position: "absolute",
          top: "50%",
          left: -squareSize,
          width: `${squareSize}px`,
          height: `${squareSize}px`,
          backgroundColor: isDark ? "#fff" : "#000",
          transform: "translateY(-50%)",
          zIndex: 3,
          borderRadius: "2px",
          transition: "background-color 0.3s ease"
        }}
      />

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

