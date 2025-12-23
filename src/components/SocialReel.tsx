"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "@/lib/gsap/ScrollTrigger";
import siteData from "@/data/content.json";

export default function SocialReel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".reel-card", {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (!mounted || !siteData.socialReels) return null;

  return (
    <section ref={containerRef} style={{ padding: "160px 40px", position: "relative" }}>
      <div style={{ marginBottom: "4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <span className="sub-label">[ SOCIAL INSIGHTS ]</span>
          <h2 style={{ fontSize: "4rem", marginTop: "1rem" }}>Instagram Reels</h2>
        </div>
        <a 
          href="https://www.instagram.com/drpauloguimaraesjr/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="nav-link"
          style={{ fontSize: "0.8rem" }}
        >
          FOLLOW @DRPAULOGUIMARAESJR —&gt;
        </a>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {siteData.socialReels.map((reel, idx) => (
          <a 
            key={idx} 
            href={reel.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="reel-card"
            data-cursor-text="PLAY"
            style={{ 
              aspectRatio: "9/16", 
              backgroundColor: "#eee", 
              position: "relative",
              overflow: "hidden",
              textDecoration: "none",
              color: "white"
            }}
          >
            <div 
              style={{ 
                width: "100%", 
                height: "100%", 
                backgroundImage: `url(${reel.thumbnail})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.8s ease"
              }} 
              className="reel-img"
            />
            <div style={{ 
              position: "absolute", 
              inset: 0, 
              background: "linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 50%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "30px",
              opacity: 0,
              transition: "opacity 0.4s ease"
            }} className="reel-overlay">
              <span className="sub-label" style={{ marginBottom: "10px", fontSize: "0.6rem" }}>RECENT REEL</span>
              <p style={{ fontSize: "1rem", fontWeight: "500", lineHeight: "1.2" }}>{reel.caption}</p>
            </div>
          </a>
        ))}
      </div>

      <style jsx>{`
        .reel-card:hover .reel-img {
          transform: scale(1.1);
        }
        .reel-card:hover .reel-overlay {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
