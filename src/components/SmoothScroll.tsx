"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "@/lib/gsap/ScrollTrigger";
import { ScrollSmoother } from "@/lib/gsap/ScrollSmoother";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 1.5, // Intensidade do efeito "macio"
      effects: true, // Ativa efeitos de parallax automáticos
      normalizeScroll: true,
    });

    return () => {
      smoother.kill();
    };
  }, []);

  return (
    <div id="smooth-wrapper" ref={wrapperRef} style={{ width: "100%", overflow: "hidden" }}>
      <div id="smooth-content" ref={contentRef} style={{ position: "relative" }}>
        {children}
      </div>
    </div>
  );
}
