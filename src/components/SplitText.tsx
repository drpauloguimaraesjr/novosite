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
    console.log('[SplitText] Component mounted, text:', text, 'interactive:', interactive);
    
    gsap.registerPlugin(ScrollTrigger, GSAPSplitText);
    
    if (!textRef.current) {
      console.warn('[SplitText] textRef.current is null');
      return;
    }

    const ctx = gsap.context(() => {
      let split: any;
      // @ts-ignore
      split = new GSAPSplitText(textRef.current!, {
        type: "chars,words",
        charsClass: "letter",
      });
      
      console.log('[SplitText] Split created, chars count:', split.chars?.length || 0);

      // Entrance Animation - Apenas fade e scale, sem rotação
      // IMPORTANTE: Garantir que após a animação, a opacidade sempre fique em 1
      gsap.fromTo(
        split.chars,
        { 
          opacity: 0,
          scale: 0.8,
          y: 20
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          stagger: 0.02,
          ease: "power3.out",
          delay: delay,
          scrollTrigger: trigger ? {
            trigger: textRef.current,
            start: "top 95%",
            onEnter: () => console.log('[SplitText] Animation triggered by scroll'),
            once: true // Garantir que só rode uma vez e fique visível
          } : null,
          onComplete: () => {
            console.log('[SplitText] Animation complete');
            // Garantir que todas as letras tenham opacidade 1 após animação
            gsap.set(split.chars, { opacity: 1, clearProps: "transform" });
          }
        }
      );

      // Interactive Lens Effect - Estilo Eva Sanchez
      // Aplica efeito apenas na letra mais próxima do cursor DENTRO deste componente específico
      if (interactive) {
        const handleMouseMove = (e: MouseEvent) => {
          // Verificar se o mouse está realmente sobre o container deste SplitText
          const container = containerRef.current || textRef.current;
          if (!container) {
            console.warn('[SplitText] Container not found');
            return;
          }
          
          const containerRect = container.getBoundingClientRect();
          const mouseX = e.clientX;
          const mouseY = e.clientY;
          
          // Verificar se o cursor está dentro dos limites do container (com margem de erro)
          const padding = 30; // Margem para detectar quando está próximo
          const isInsideContainer = (
            mouseX >= containerRect.left - padding &&
            mouseX <= containerRect.right + padding &&
            mouseY >= containerRect.top - padding &&
            mouseY <= containerRect.bottom + padding
          );
          
          // Se não estiver dentro do container, resetar todas as letras e sair
          if (!isInsideContainer) {
            split.chars.forEach((letter: HTMLElement) => {
              gsap.to(letter, {
                scale: 1,
                x: 0,
                y: 0,
                textShadow: "none",
                opacity: 1, // GARANTIR que a opacidade sempre fique em 1
                duration: 0.4,
                ease: "power2.out",
                overwrite: true
              });
            });
            return;
          }
          
          // Filtrar apenas letras visíveis deste SplitText
          const letters: HTMLElement[] = split.chars.filter((letter: HTMLElement) => {
            // Filtrar apenas letras visíveis (não espaços ou caracteres invisíveis)
            const text = letter.textContent?.trim() || '';
            const rect = letter.getBoundingClientRect();
            return text.length > 0 && rect.width > 0 && rect.height > 0;
          }) as HTMLElement[];
          
          if (letters.length === 0) {
            console.warn('[SplitText] No visible letters found');
            return;
          }
          
          // Encontrar a letra mais próxima do cursor DENTRO deste container
          let closestLetter: HTMLElement | null = null;
          let minDistance = Infinity;
          
          letters.forEach((letter) => {
            const letterElement = letter as HTMLElement;
            const rect = letterElement.getBoundingClientRect();
            
            // Verificar se o cursor está sobre a letra
            const isOverLetter = (
              mouseX >= rect.left &&
              mouseX <= rect.right &&
              mouseY >= rect.top &&
              mouseY <= rect.bottom
            );
            
            if (isOverLetter) {
              // Se o cursor está sobre a letra, calcular distância do centro
              const centerX = rect.left + rect.width / 2;
              const centerY = rect.top + rect.height / 2;
              const distance = Math.hypot(mouseX - centerX, mouseY - centerY);
              
              // Priorizar letras que o cursor está sobrepondo diretamente
              if (distance < minDistance) {
                minDistance = distance;
                closestLetter = letterElement;
              }
            } else {
              // Se não está sobre a letra, calcular distância até a borda mais próxima
              const closestX = Math.max(rect.left, Math.min(mouseX, rect.right));
              const closestY = Math.max(rect.top, Math.min(mouseY, rect.bottom));
              const distance = Math.hypot(mouseX - closestX, mouseY - closestY);
              
              // Só considerar se estiver muito próximo (dentro de 50px)
              if (distance < 50 && distance < minDistance) {
                minDistance = distance;
                closestLetter = letterElement;
              }
            }
          });
          
          // Aplicar efeito apenas na letra mais próxima DENTRO deste container
          if (closestLetter) {
            const letterElement = closestLetter as HTMLElement;
            console.log('[SplitText] Closest letter:', letterElement.textContent, 'distance:', minDistance.toFixed(2));
          }
          
          letters.forEach((letter) => {
            const letterElement = letter as HTMLElement;
            const rect = letterElement.getBoundingClientRect();
            const letterCenterX = rect.left + rect.width / 2;
            const letterCenterY = rect.top + rect.height / 2;
            
            // Calculate vector from char center to mouse
            const dx = letterCenterX - mouseX;
            const dy = letterCenterY - mouseY;
            const dist = Math.hypot(dx, dy);
            
            // Shadow Logic:
            // Shadow falls opposite to light (Cursor). 
            // If Cursor is Left of Char (dx > 0), Shadow should be Right (positive x).
            // Distance factor: 0.05 (Subtle)
            const shadowX = dx * 0.08;
            const shadowY = dy * 0.08;
            // Blur increases with distance? Or decreases?
            // "Sombra diminuisse" -> Maybe fade out or shrink?
            // Let's keep it subtle: Blur proportional to distance but capped.
            const blur = Math.min(dist * 0.04, 4);
            const shadowColor = "rgba(0,0,0,0.15)"; // Very subtle shadow
            const dynamicShadow = `${shadowX}px ${shadowY}px ${blur}px ${shadowColor}`;

            if (letterElement === closestLetter) {
              const maxDistance = Math.max(rect.width, rect.height) * 1.2;
              
              // Força do efeito baseada na proximidade
              const power = Math.max(0, 1 - (dist / maxDistance));
              
              // Efeito de lente: zoom na letra mais próxima
              // Reduzido drasticamente para evitar efeito "tremendo" ou exagerado (User Request: "muito sensivel")
              const scale = 1 + (power * 0.15); 
              
              const existingMoveX = (mouseX - letterCenterX) * power * 0.1;
              const existingMoveY = (mouseY - letterCenterY) * power * 0.1;
              
              gsap.to(letterElement, {
                scale: scale,
                x: existingMoveX,
                y: existingMoveY,
                textShadow: dynamicShadow,
                opacity: 1, 
                duration: 0.3,
                ease: "power2.out",
                overwrite: true
              });
            } else {
              // Retorna ao estado normal (scale 1) mas com SOMBRA dinâmica
              gsap.to(letterElement, {
                scale: 1,
                x: 0,
                y: 0,
                textShadow: dynamicShadow,
                opacity: 1, 
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
          console.log('[SplitText] Adding mouse listeners to container');
          // Adicionar listener no window para garantir captura (apenas um listener)
          window.addEventListener("mousemove", handleMouseMove);
          
          // Reset quando o mouse sai do container
          const handleMouseLeave = () => {
            console.log('[SplitText] Mouse left container, resetting letters');
            split.chars.forEach((letter: HTMLElement) => {
              gsap.to(letter, {
                scale: 1,
                x: 0,
                y: 0,
                textShadow: "none",
                opacity: 1, // GARANTIR que a opacidade sempre fique em 1
                duration: 0.4,
                ease: "power2.out",
                overwrite: true
              });
            });
          };
          
          container.addEventListener("mouseleave", handleMouseLeave);
          
          // Cleanup function
          return () => {
            console.log('[SplitText] Cleaning up listeners');
            window.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
            // Resetar todas as letras ao desmontar
            if (split && split.chars) {
              split.chars.forEach((letter: HTMLElement) => {
                gsap.to(letter, {
                  scale: 1,
                  x: 0,
                  y: 0,
                  opacity: 1, // GARANTIR que a opacidade sempre fique em 1
                  duration: 0.2,
                  ease: "power2.out",
                  overwrite: true
                });
              });
            }
          };
        } else {
          console.warn('[SplitText] Container not found, cannot add listeners');
        }
      }
      
      // Cleanup do contexto GSAP
      return () => {
        ctx.revert();
      };
    }, textRef);
  }, [delay, trigger, text, interactive]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        display: "inline-block",
        pointerEvents: "auto"
      }}
      data-cursor-ignore="true"
    >
      <div 
        ref={textRef} 
        className={className} 
        style={{ 
          display: "inline-block", 
          position: "relative",
          willChange: interactive ? "transform" : "auto",
          pointerEvents: "auto"
        }}
      >
        {text}
      </div>
    </div>
  );
}
