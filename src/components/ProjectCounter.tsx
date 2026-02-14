"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "@/lib/gsap/ScrollTrigger";

interface ProjectCounterProps {
  totalProjects?: number;
  label?: string;
}

/**
 * Contador de projetos animado estilo Eva Sanchez
 * Mostra "LABEL_XX/YY" onde XX muda com o scroll
 */
export default function ProjectCounter({ 
  totalProjects = 6, 
  label = "INSTITUTO MÉDICO 2025"
}: ProjectCounterProps) {
  const [currentProject, setCurrentProject] = useState(1);
  const counterRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Detectar qual seção está visível e atualizar o contador
    const sections = document.querySelectorAll("[data-project-index]");
    
    if (sections.length === 0) {
      // Se não há seções marcadas, usar scroll progress geral
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self: any) => {
          const progress = self.progress;
          const projectNumber = Math.min(
            totalProjects,
            Math.max(1, Math.ceil(progress * totalProjects))
          );
          setCurrentProject(projectNumber);
        }
      });
    } else {
      // Atualizar baseado nas seções marcadas
      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => setCurrentProject(index + 1),
          onEnterBack: () => setCurrentProject(index + 1),
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [totalProjects]);

  // Animação sutil quando o número muda
  useEffect(() => {
    if (numberRef.current) {
      gsap.fromTo(
        numberRef.current,
        { opacity: 0.5, y: -5 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [currentProject]);

  const formattedCurrent = String(currentProject).padStart(2, "0");
  const formattedTotal = String(totalProjects).padStart(2, "0");

  return (
    <div 
      ref={counterRef}
      className="project-counter"
      style={{
        fontFamily: "var(--font-main)",
        fontSize: "0.7rem",
        fontWeight: 400,
        letterSpacing: "0.05em",
        opacity: 0.7,
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span style={{ fontStyle: "italic" }}>[ {label} </span>
      <span 
        ref={numberRef}
        style={{ 
          fontWeight: 600,
          fontVariantNumeric: "tabular-nums" // Números monospace para não pular
        }}
      >
        {formattedCurrent}/{formattedTotal}
      </span>
      <span style={{ fontStyle: "italic" }}>]</span>
    </div>
  );
}
