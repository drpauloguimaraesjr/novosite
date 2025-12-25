"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "@/lib/gsap/ScrollTrigger";
import ProxyImage from "./ProxyImage";

export default function InteractiveGrid({ data }: { data: any[] }) {
  const sectionRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("ALL");

  if (!data) return null;

  // Extract unique categories
  const categories = ["ALL", ...Array.from(new Set(data.map(item => item.cat.toUpperCase())))];
  
  const filteredData = activeCategory === "ALL" 
    ? data 
    : data.filter(item => item.cat.toUpperCase() === activeCategory);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Refresh ScrollTrigger when filter changes
    ScrollTrigger.refresh();

    const ctx = gsap.context(() => {
      const items = document.querySelectorAll('.grid-item');
      
      items.forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 90%",
          onEnter: () => item.classList.add("in-view"),
          once: true
        });

        // 3D Tilt on Hover logic remains the same...
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [activeCategory]);

  return (
    <section ref={sectionRef} className="interactive-grid-section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "6rem" }}>
        <div>
          <span className="sub-label">[ VISUAL ARCHIVE ]</span>
          <div style={{ display: "flex", gap: "20px", marginTop: "2rem" }}>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  color: activeCategory === cat ? "var(--text-color)" : "rgba(0,0,0,0.3)",
                  cursor: "pointer",
                  transition: "color 0.3s ease"
                }}
              >
                [ {cat === "ALL" ? "TODOS" : cat} ]
              </button>
            ))}
          </div>
        </div>
        
        <button className="bar-button" data-cursor-text="EXPAND">
          <div className="bar-line" />
          <span className="bar-label">VIEW ALL ARCHIVE</span>
        </button>
      </div>

      <div className="interactive-grid">
        {filteredData.map((item: any) => (
          <div 
            key={item.id} 
            className={`grid-item grid-item-${item.id} in-view ${item.settings.size ? `span-${item.settings.size === 'small' ? '4' : item.settings.size === 'large' ? '8' : item.settings.size === 'full' ? '12' : '6'}` : 'span-6'}`}
            data-speed={item.settings.speed}
            onMouseMove={(e) => {
              const el = e.currentTarget;
              const layers = el.querySelectorAll('.stack-layer');
              const { left, top, width, height } = el.getBoundingClientRect();
              const x = (e.clientX - left) / width - 0.5;
              const y = (e.clientY - top) / height - 0.5;

              layers.forEach((layer, idx) => {
                gsap.to(layer, {
                  x: x * (30 + idx * 20),
                  y: y * (30 + idx * 20),
                  duration: 0.8,
                  ease: "power2.out"
                });
              });
            }}
            onMouseLeave={(e) => {
              const layers = e.currentTarget.querySelectorAll('.stack-layer');
              layers.forEach((layer) => {
                gsap.to(layer, { x: 0, y: 0, duration: 1.2, ease: "power3.out" });
              });
            }}
          >
            <div className="grid-item-inner" style={{ overflow: "hidden", height: "100%", width: "100%", position: "relative" }}>
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className="stack-layer" 
                  style={{ 
                    backgroundImage: `url(${item.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: item.settings.position || "center",
                    scale: 1.1 + (i * 0.05)
                  }} 
                />
              ))}
              
              <ProxyImage 
                src={item.img} 
                alt={item.title} 
                className="grid-item-img"
                style={{ 
                  width: "120%", 
                  height: "120%", 
                  objectFit: "cover", 
                  margin: "-10%",
                  objectPosition: item.settings.position
                }} 
              />
            </div>
            <div className="grid-item-overlay">
              <span className="sub-label" style={{ color: "white", opacity: 0.7 }}>{item.cat}</span>
              <h4 style={{ fontSize: "1.2rem", marginTop: "0.5rem", color: "white" }}>
                {item.title}
              </h4>
              {item.description && (
                <p style={{ 
                  fontSize: "0.75rem", 
                  marginTop: "1rem", 
                  color: "white", 
                  opacity: 0.6, 
                  lineHeight: "1.6",
                  fontWeight: 400,
                  maxWidth: "90%"
                }}>
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
