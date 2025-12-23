"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "@/lib/gsap/ScrollTrigger";
import { SplitText } from "@/lib/gsap/SplitText";
import { ScrollSmoother } from "@/lib/gsap/ScrollSmoother";
import { DrawSVGPlugin } from "@/lib/gsap/DrawSVGPlugin";

export default function GSAPConfig() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Registrando todos os plugins premium que agora temos acesso
      gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother, DrawSVGPlugin);
      
      // Configurações globais opcionais
      gsap.defaults({ ease: "power2.out", duration: 0.8 });
    }
  }, []);

  return null;
}
