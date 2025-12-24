"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const [cursorText, setCursorText] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Physics settings - Velocidade mais rápida (stiffness maior, damping menor)
  const springConfig = { damping: 15, stiffness: 400, mass: 0.3 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Secondary trail for depth - Mais rápido também
  const trailX = useSpring(mouseX, { damping: 25, stiffness: 250 });
  const trailY = useSpring(mouseY, { damping: 25, stiffness: 250 });

  useEffect(() => {
    console.log('[CustomCursor] Component mounted');
    
    // NÃO esconder cursor padrão - deixar ambos visíveis
    // document.body.style.cursor = 'none';
    
    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveMouse);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // Usar event delegation para melhor performance e detecção mais confiável
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      // Ignorar elementos marcados com data-cursor-ignore
      if (target.closest('[data-cursor-ignore="true"]')) {
        console.log('[CustomCursor] Ignoring element with data-cursor-ignore:', target.tagName, target.className);
        setIsHovering(false);
        setCursorText("");
        return;
      }
      
      // Buscar o atributo data-cursor-text no elemento atual ou em seus pais
      let element: HTMLElement | null = target;
      let text = null;
      
      while (element && !text) {
        // Ignorar elementos com data-cursor-ignore
        if (element.getAttribute("data-cursor-ignore") === "true") {
          break;
        }
        
        text = element.getAttribute("data-cursor-text");
        if (text) break;
        element = element.parentElement;
      }
      
      // Só mostrar texto se encontrar explicitamente data-cursor-text
      if (text) {
        console.log('[CustomCursor] Found cursor text:', text, 'on element:', target.tagName, target.className);
        setIsHovering(true);
        setCursorText(text);
      } else {
        // Para elementos interativos sem data-cursor-text, mostrar "VIEW" apenas se não houver data-cursor-ignore
        const hasIgnore = target.closest('[data-cursor-ignore]');
        if (!hasIgnore && (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button'))) {
          console.log('[CustomCursor] Interactive element detected:', target.tagName, target.className);
          setIsHovering(true);
          setCursorText("VIEW");
        } else {
          // Se não encontrar texto válido, não mostrar nada
          setIsHovering(false);
          setCursorText("");
        }
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
      setCursorText("");
    };

    // Usar event delegation no document para capturar todos os eventos
    // Usar capture phase para garantir que capturamos antes de outros handlers
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mouseout', handleMouseOut, true);

    return () => {
      console.log('[CustomCursor] Component unmounting, cleaning up listeners');
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('mouseout', handleMouseOut, true);
      // document.body.style.cursor = '';
    };
  }, []);

  return (
    <>
      {/* Primary Cursor - The Action Pointer */}
      <motion.div
        className="custom-cursor-pro"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? "rgba(255, 255, 255, 1)" : "rgba(0, 0, 0, 1)",
          mixBlendMode: isHovering ? "difference" : "difference", // Sempre usar difference para visibilidade
          opacity: 1, // Garantir que sempre está visível
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <AnimatePresence>
          {isHovering && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="cursor-label"
              style={{
                color: "black",
                fontSize: "3px",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase"
              }}
            >
              {cursorText}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Secondary Trail - The Liquid Feel */}
      <motion.div
        className="cursor-trail"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 0 : 0.4,
          opacity: isHovering ? 0 : 0.3,
        }}
      />
    </>
  );
}
