"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "@/lib/gsap/ScrollTrigger";
import Link from "next/link";
import { useContent } from "@/hooks/useContent";
import ProxyImage from "./ProxyImage";

interface Service {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  thumbnail?: string;
  slug: string;
}

export default function ServicesShowcase() {
  const siteData = useContent();
  const services: Service[] = siteData?.services || [];
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate service cards on scroll
      const cards = gsap.utils.toArray(".service-miniature-card");
      
      cards.forEach((card: any, index) => {
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
            once: true,
          }
        });

        // Parallax effect on image - Keep scrub for parallax
        const image = card.querySelector(".service-miniature-image");
        if (image) {
          gsap.to(image, {
            yPercent: -10,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            }
          });
        }
      });

      // Importante: Refresh após inicializar tudo
      ScrollTrigger.refresh();

      // Hover animation for cards
      cards.forEach((card: any) => {
        const imageContainer = card.querySelector(".service-miniature-image-container");
        const image = card.querySelector(".service-miniature-image");
        
        card.addEventListener("mouseenter", () => {
          gsap.to(image, {
            scale: 1.1,
            duration: 0.8,
            ease: "power3.out"
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(image, {
            scale: 1,
            duration: 0.8,
            ease: "power3.out"
          });
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="services" className="services-showcase">
      <div className="services-header">
        <span className="sub-label">[ PRINCIPAIS SERVIÇOS ]</span>
        <h2 className="services-title">
          Transforme sua saúde<br />
          com tratamentos integrados
        </h2>
      </div>

      {/* Grid de Miniaturas - Layout Compacto */}
      {services.length > 0 ? (
        <div className="services-miniatures-grid">
          {services.map((service, index) => (
          <Link 
            href={`/servicos/${service.slug}`} 
            key={service.id}
            className="service-miniature-card"
            data-cursor-text="EXPLORAR"
          >
            <div className="service-miniature-number">
              [{String(index + 1).padStart(2, '0')}]
            </div>
            
            <div className="service-miniature-image-container">
              <ProxyImage
                src={service.thumbnail || service.image}
                alt={service.title}
                className="service-miniature-image"
              />
            </div>

            <div className="service-miniature-content">
              <h3 className="service-miniature-title">{service.title}</h3>
              <p className="service-miniature-subtitle">{service.subtitle}</p>
            </div>
          </Link>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", opacity: 0.5, padding: "4rem 0" }}>
          Nenhum serviço disponível no momento.
        </p>
      )}
    </section>
  );
}

