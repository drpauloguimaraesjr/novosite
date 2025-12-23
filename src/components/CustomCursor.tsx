"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState("");

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Follow mouse
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: "power3.out",
      });
    };

    const handleMouseEnter = (e: any) => {
      cursor.classList.add("active");
      const text = e.target.getAttribute("data-cursor-text");
      if (text) setCursorText(text);
    };

    const handleMouseLeave = () => {
      cursor.classList.remove("active");
      setCursorText("");
    };

    window.addEventListener("mousemove", onMouseMove);

    const updateInteractivity = () => {
      const interactives = document.querySelectorAll('a, button, .project-item, .reel-card');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    updateInteractivity();

    const observer = new MutationObserver(updateInteractivity);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor">
      <div className="custom-cursor-text">{cursorText || "VIEW"}</div>
    </div>
  );
}
