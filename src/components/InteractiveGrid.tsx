"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "@/lib/gsap/ScrollTrigger";
export default function InteractiveGrid({ data }: { data: any[] }) {
  const sectionRef = useRef(null);

  if (!data) return null;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Reveal animation using Intersection Observer via ScrollTrigger
      const items = document.querySelectorAll('.grid-item');
      
      items.forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 90%",
          onEnter: () => item.classList.add("in-view"),
          once: true
        });

        // 3D Tilt on Hover
        const img = item.querySelector('img');
        const overlay = item.querySelector('.grid-item-overlay');

        item.addEventListener('mousemove', (e: any) => {
          const { left, top, width, height } = item.getBoundingClientRect();
          const x = (e.clientX - left) / width - 0.5;
          const y = (e.clientY - top) / height - 0.5;

          gsap.to(img, {
            x: x * 40,
            y: y * 40,
            scale: 1.25,
            rotateX: -y * 15,
            rotateY: x * 15,
            duration: 0.8,
            ease: "power2.out"
          });

          gsap.to(overlay, {
            x: x * 20,
            y: y * 20,
            duration: 0.8,
            ease: "power2.out"
          });
        });

        item.addEventListener('mouseleave', () => {
          gsap.to(img, {
            x: 0,
            y: 0,
            scale: 1.15,
            rotateX: 0,
            rotateY: 0,
            duration: 1.2,
            ease: "power3.out"
          });
          gsap.to(overlay, {
            x: 0,
            y: 0,
            duration: 1.2,
            ease: "power3.out"
          });
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="interactive-grid-section">
      <div style={{ marginBottom: "4rem" }}>
        <span className="sub-label">[ VISUAL ARCHIVE ]</span>
      </div>
      <div className="interactive-grid">
        {data.map((item: any) => (
          <div 
            key={item.id} 
            className={`grid-item grid-item-${item.id} ${item.settings.size ? `span-${item.settings.size === 'small' ? '4' : item.settings.size === 'large' ? '8' : item.settings.size === 'full' ? '12' : '6'}` : 'span-6'}`}
            data-speed={item.settings.speed}
            onMouseMove={(e) => {
              const item = e.currentTarget;
              const layers = item.querySelectorAll('.stack-layer');
              const { left, top, width, height } = item.getBoundingClientRect();
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
              {/* Stack Layers for the Ghosting effect */}
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
              
              <img 
                src={item.img} 
                alt={item.title} 
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
