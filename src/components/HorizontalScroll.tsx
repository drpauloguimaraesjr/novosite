"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "@/lib/gsap/ScrollTrigger";
export default function HorizontalScroll({ data }: { data: any[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  if (!data) return null;

  useEffect(() => {
    setMounted(true);
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      let scrollWidth = containerRef.current!.offsetWidth;
      let amountToScroll = scrollWidth - window.innerWidth;

      if (amountToScroll > 0) {
        gsap.to(containerRef.current, {
          x: -amountToScroll,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${amountToScroll * 1.5}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressBarRef.current) {
                gsap.to(progressBarRef.current, { scaleX: self.progress, duration: 0.1 });
              }
            }
          },
        });

        // Skew effect
        let proxy = { skew: 0 },
            skewSetter = gsap.quickSetter(".playground-card", "skewX", "deg"),
            clamp = gsap.utils.clamp(-15, 15);

        ScrollTrigger.create({
          onUpdate: (self: any) => {
            let skew = clamp(self.getVelocity() / -400);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {
                skew: 0,
                duration: 0.8,
                ease: "power3",
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew)
              });
            }
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!mounted) return null;

  return (
    <div ref={sectionRef} className="horizontal-scroll-section">
      <div className="sticky-container">
        <div style={{ position: "absolute", top: "120px", left: "40px", right: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", zIndex: 10 }}>
          <div>
            <span className="sub-label" style={{ opacity: 0.6 }}>[ PLAYGROUND & EXPERIMENTS ]</span>
            <h2 style={{ fontSize: "5rem", marginTop: "1rem" }}>Instituto Lab</h2>
          </div>
          <div style={{ width: "200px", height: "2px", backgroundColor: "rgba(255,255,255,0.1)", position: "relative" }}>
            <div 
              ref={progressBarRef}
              style={{ 
                position: "absolute", 
                top: 0, 
                left: 0, 
                width: "100%", 
                height: "100%", 
                backgroundColor: "#fff", 
                transformOrigin: "left center",
                scale: "0 1"
              }} 
            />
          </div>
        </div>

        <div ref={containerRef} className="scroll-content">
          {data.map((item: any, idx: number) => (
            <div key={idx} className="playground-card" data-cursor-text="EXPLORE">
              <div 
                className="playground-card-img" 
                style={{ backgroundImage: `url(${item.img})` }} 
              />
              <h3 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                {item.title}
              </h3>
              <p style={{ opacity: 0.7, fontSize: "1.1rem", lineHeight: "1.4" }}>{item.desc}</p>
              <div style={{ marginTop: "auto" }} className="sub-label">
                [ {String(idx + 1).padStart(2, '0')} / {String(data.length).padStart(2, '0')} ]
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
