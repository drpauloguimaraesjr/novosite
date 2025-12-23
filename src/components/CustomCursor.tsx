"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const [cursorText, setCursorText] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Physics settings for that 'Pro' feel
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Secondary trail for depth
  const trailX = useSpring(mouseX, { damping: 40, stiffness: 150 });
  const trailY = useSpring(mouseY, { damping: 40, stiffness: 150 });

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveMouse);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    const handleMouseEnter = (e: any) => {
      setIsHovering(true);
      const text = e.currentTarget.getAttribute("data-cursor-text");
      if (text) setCursorText(text);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setCursorText("");
    };

    const updateInteractivity = () => {
      const interactives = document.querySelectorAll('a, button, .project-item, .reel-card, .interactive-grid-section button');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    updateInteractivity();
    const observer = new MutationObserver(updateInteractivity);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      observer.disconnect();
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
          mixBlendMode: isHovering ? "difference" : "normal",
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
              {cursorText || "VIEW"}
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
