"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "@/lib/gsap/ScrollTrigger";
import { useContent } from "@/hooks/useContent";

export default function SocialReel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const siteData = useContent(); // Usar dados dinâmicos do admin

  useEffect(() => {
    setMounted(true);
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = document.querySelectorAll(".reel-card");
      if (cards.length > 0) {
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
      }
    }, containerRef);

    return () => ctx.revert();
  }, [siteData]);

  if (!mounted || !siteData?.socialReels) return null;

  return (
    <section ref={containerRef} style={{ padding: "20vh 40px", position: "relative", marginTop: "10vh", marginBottom: "10vh" }}>
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
        {siteData.socialReels.map((reel: any, idx: number) => (
          <a 
            key={idx} 
            href={reel.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="reel-card"
            data-cursor-text="PLAY"
            style={{ 
              aspectRatio: "9/16", 
              backgroundColor: "#111", 
              position: "relative",
              overflow: "hidden",
              textDecoration: "none",
              color: "white",
              borderRadius: "12px"
            }}
          >
            {/* Imagem de capa */}
            <div 
              style={{ 
                width: "100%", 
                height: "100%", 
                backgroundImage: reel.thumbnail ? `url(${reel.thumbnail})` : 'none',
                backgroundColor: reel.thumbnail ? 'transparent' : '#222',
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.8s ease"
              }} 
              className="reel-img"
            />
            
            {/* Overlay com informações no hover */}
            <div style={{ 
              position: "absolute", 
              inset: 0, 
              background: "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "25px",
              opacity: 0,
              transition: "opacity 0.4s ease"
            }} className="reel-overlay">
              
              {/* Badge do Instagram */}
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
                marginBottom: "12px"
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span style={{ 
                  fontSize: "0.7rem", 
                  fontWeight: 600, 
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  opacity: 0.8
                }}>
                  {reel.profile || "@drpauloguimaraesjr"}
                </span>
              </div>

              {/* Legenda da postagem */}
              {reel.caption && (
                <p style={{ 
                  fontSize: "0.95rem", 
                  fontWeight: 500, 
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}>
                  {reel.caption}
                </p>
              )}

              {/* Botão de ver */}
              <div style={{
                marginTop: "15px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.65rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                opacity: 0.7
              }}>
                <span>Ver no Instagram</span>
                <span>→</span>
              </div>
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
