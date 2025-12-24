"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Reduzir a intensidade do movimento e aplicar suavização
    const distance = Math.hypot(middleX, middleY);
    const maxDistance = Math.max(width, height) * 0.5;
    const intensity = Math.min(distance / maxDistance, 1) * 0.3; // Reduzido de 0.4 para 0.3
    
    setPosition({ 
      x: middleX * intensity, 
      y: middleY * intensity 
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.div
      style={{ position: "relative" }}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x, y }}
      transition={{ 
        type: "spring", 
        stiffness: 50, // Reduzido de 150 para 50 (mais suave)
        damping: 25, // Aumentado de 15 para 25 (menos oscilação)
        mass: 0.5 // Aumentado de 0.1 para 0.5 (mais inércia suave)
      }}
    >
      {children}
    </motion.div>
  );
}
