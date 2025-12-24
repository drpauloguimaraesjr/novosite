"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "@/lib/gsap/ScrollTrigger";
import Link from "next/link";
import SplitText from "@/components/SplitText";
import Magnetic from "@/components/Magnetic";
import { useContent } from "@/hooks/useContent";

export default function ServicePage() {
  const params = useParams();
  const siteData = useContent();
  const containerRef = useRef<HTMLDivElement>(null);
  const slug = params?.slug as string;

  const servicesData = siteData?.services || [];
  const service = servicesData.find((s: any) => s.slug === slug);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animação de entrada
      gsap.from(".service-page-content", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".service-page-content",
          start: "top 80%",
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (!service) {
    return (
      <div style={{ padding: "10vh 40px", textAlign: "center" }}>
        <h1>Serviço não encontrado</h1>
        <Link href="/" style={{ marginTop: "2rem", display: "inline-block" }}>
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ minHeight: "100vh", padding: "20vh 40px" }}>
      {/* Header */}
      <div style={{ marginBottom: "6rem" }}>
        <Link 
          href="/#services"
          data-cursor-text="VOLTAR"
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "0.5rem",
            marginBottom: "2rem",
            textDecoration: "none",
            color: "var(--text-color)",
            opacity: 0.6,
            transition: "opacity 0.3s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "0.6"}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Voltar aos serviços
        </Link>
        
        <span className="sub-label" style={{ display: "block", marginBottom: "1rem" }}>
          [ SERVIÇO ]
        </span>
        <h1 style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 400, lineHeight: 1.1, marginBottom: "1rem" }}>
          <SplitText text={service.title} delay={0.2} />
        </h1>
        <p style={{ fontSize: "clamp(1.25rem, 2vw, 1.5rem)", opacity: 0.7, maxWidth: "800px" }}>
          {service.subtitle}
        </p>
      </div>

      {/* Content */}
      <div className="service-page-content" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", marginBottom: "6rem" }}>
          {/* Image */}
          <div style={{ aspectRatio: "4/3", borderRadius: "8px", overflow: "hidden" }}>
            <img
              src={service.image}
              alt={service.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Description */}
          <div>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", marginBottom: "2rem", fontWeight: 500 }}>
              Sobre este serviço
            </h2>
            <p style={{ fontSize: "1.125rem", lineHeight: "1.8", opacity: 0.8, whiteSpace: "pre-line" }}>
              {service.fullDescription || service.description}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "4rem", borderTop: "1px solid rgba(0,0,0,0.1)" }}>
          <Magnetic>
            <Link 
              href="https://wa.me/5547992547770" 
              className="contact-button-bar"
              data-cursor-text="AGENDAR"
              style={{ textDecoration: "none" }}
            >
              <div className="bar-line" />
              <span className="bar-label">AGENDAR CONSULTA</span>
            </Link>
          </Magnetic>
        </div>
      </div>
    </div>
  );
}

