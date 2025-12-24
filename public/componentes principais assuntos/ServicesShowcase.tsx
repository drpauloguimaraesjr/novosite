"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

interface Service {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  slug: string;
}

const services: Service[] = [
  {
    id: 1,
    title: "Check-up Premium",
    subtitle: "Conhecer seu corpo é o primeiro passo para transformá-lo",
    description: "Avaliação completa e personalizada que vai muito além dos exames convencionais. Análise integrada com InBody 770, teste de esforço e avaliação hormonal completa.",
    image: "/images/checkup-premium.jpg",
    slug: "checkup-premium"
  },
  {
    id: 2,
    title: "Reposição Hormonal",
    subtitle: "Quando os hormônios estão em desequilíbrio, sua vida inteira sofre",
    description: "Reposição hormonal personalizada que te devolve energia, disposição e qualidade de vida. Protocolo individualizado baseado em análise completa.",
    image: "/images/reposicao-hormonal.jpg",
    slug: "reposicao-hormonal"
  },
  {
    id: 3,
    title: "Emagrecimento",
    subtitle: "Dieta não funciona. Transformação funciona.",
    description: "Protocolo de emagrecimento integrado que combina ciência, nutrição e terapias avançadas. Investigamos as causas reais e criamos um plano personalizado.",
    image: "/images/emagrecimento.jpg",
    slug: "emagrecimento"
  },
  {
    id: 4,
    title: "Performance Esportiva",
    subtitle: "O acompanhamento médico é tão importante quanto o treino",
    description: "Consultoria integrada para otimização de performance, prevenção de lesões e conformidade WADA. Para atletas que buscam excelência.",
    image: "/images/performance-esportiva.jpg",
    slug: "performance-esportiva"
  },
  {
    id: 5,
    title: "Tratamento de Lipedema",
    subtitle: "Lipedema não é obesidade. É uma condição específica.",
    description: "Protocolo não cirúrgico que reduz dor, inchaço e melhora a qualidade de vida. Abordagem integrada com terapias injetáveis e nutrição anti-inflamatória.",
    image: "/images/lipedema.jpg",
    slug: "lipedema"
  },
  {
    id: 6,
    title: "Check-up para Casais",
    subtitle: "Antes de ter filhos, prepare seu corpo e sua saúde",
    description: "Avaliação integrada para casais que desejam conceber com saúde e segurança. Preparação completa para a jornada da parentalidade.",
    image: "/images/checkup-casais.jpg",
    slug: "checkup-casais"
  },
  {
    id: 7,
    title: "Preparação Cirúrgica",
    subtitle: "Prepare seu corpo para se recuperar melhor e mais rápido",
    description: "Protocolo pré e pós-cirúrgico que otimiza recuperação e reduz complicações. Sua recuperação começa semanas antes da cirurgia.",
    image: "/images/preparacao-cirurgica.jpg",
    slug: "preparacao-cirurgica"
  }
];

export default function ServicesShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate service cards on scroll
      const cards = gsap.utils.toArray(".service-card");
      
      cards.forEach((card: any, index) => {
        gsap.from(card, {
          y: 100,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          }
        });

        // Parallax effect on image
        const image = card.querySelector(".service-image");
        if (image) {
          gsap.to(image, {
            yPercent: -20,
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

      // Hover animation for cards
      cards.forEach((card: any) => {
        const image = card.querySelector(".service-image-container");
        
        card.addEventListener("mouseenter", () => {
          gsap.to(image, {
            scale: 1.05,
            duration: 0.6,
            ease: "power3.out"
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(image, {
            scale: 1,
            duration: 0.6,
            ease: "power3.out"
          });
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="services-showcase">
      <div className="services-header">
        <span className="sub-label">[ PRINCIPAIS SERVIÇOS ]</span>
        <h2 className="services-title">
          Transforme sua saúde<br />
          com tratamentos integrados
        </h2>
      </div>

      <div className="services-grid">
        {services.map((service, index) => (
          <Link 
            href={`/servicos/${service.slug}`} 
            key={service.id}
            className="service-card"
            data-cursor-text="SAIBA MAIS"
          >
            <div className="service-number">
              [{String(index + 1).padStart(2, '0')}]
            </div>
            
            <div className="service-image-container">
              <div 
                className="service-image"
                style={{ backgroundImage: `url(${service.image})` }}
              />
            </div>

            <div className="service-content">
              <h3 className="service-title">{service.title}</h3>
              <p className="service-subtitle">{service.subtitle}</p>
              <p className="service-description">{service.description}</p>
              
              <div className="service-cta">
                <span className="cta-text">Saiba mais</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10H16M16 10L10 4M16 10L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="services-footer">
        <Link href="/contato" className="contact-button">
          <span>Agende sua consulta</span>
          <div className="button-line" />
        </Link>
      </div>
    </section>
  );
}
