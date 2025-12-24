"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "@/lib/gsap/ScrollTrigger";
import Link from "next/link";
import SplitText from "@/components/SplitText";
import Magnetic from "@/components/Magnetic";
import { useContent } from "@/hooks/useContent";
  {
    id: 1,
    title: "Check-up Premium",
    subtitle: "Conhecer seu corpo é o primeiro passo para transformá-lo",
    description: "Avaliação completa e personalizada que vai muito além dos exames convencionais. Análise integrada com InBody 770, teste de esforço e avaliação hormonal completa.",
    image: "/images/clinic/0Y7A0247.jpg",
    slug: "checkup-premium",
    fullDescription: `
      O Check-up Premium é uma avaliação médica completa e personalizada que vai muito além dos exames convencionais. 

      Nossa abordagem integrada combina:
      • Análise de composição corporal com InBody 770
      • Teste de esforço cardiopulmonar
      • Avaliação hormonal completa
      • Análise metabólica avançada
      • Rastreamento de marcadores de saúde

      Este protocolo permite identificar desequilíbrios antes que se tornem problemas, oferecendo uma visão completa do seu estado de saúde atual.
    `
  },
  {
    id: 2,
    title: "Reposição Hormonal",
    subtitle: "Quando os hormônios estão em desequilíbrio, sua vida inteira sofre",
    description: "Reposição hormonal personalizada que te devolve energia, disposição e qualidade de vida. Protocolo individualizado baseado em análise completa.",
    image: "/images/clinic/0Y7A0248.jpg",
    slug: "reposicao-hormonal",
    fullDescription: `
      A Reposição Hormonal é um tratamento personalizado que restaura o equilíbrio hormonal, devolvendo energia, disposição e qualidade de vida.

      Nosso protocolo inclui:
      • Análise hormonal completa (testosterona, estrogênio, progesterona, cortisol, etc.)
      • Protocolo individualizado baseado no seu perfil único
      • Acompanhamento regular e ajustes quando necessário
      • Otimização de energia, libido e bem-estar geral

      Quando os hormônios estão equilibrados, você sente a diferença em todos os aspectos da sua vida.
    `
  },
  {
    id: 3,
    title: "Emagrecimento",
    subtitle: "Dieta não funciona. Transformação funciona.",
    description: "Protocolo de emagrecimento integrado que combina ciência, nutrição e terapias avançadas. Investigamos as causas reais e criamos um plano personalizado.",
    image: "/images/clinic/0Y7A0250.jpg",
    slug: "emagrecimento",
    fullDescription: `
      Nosso protocolo de emagrecimento vai muito além de dietas restritivas. Investigamos as causas reais do ganho de peso e criamos um plano personalizado que funciona.

      Abordagem integrada:
      • Análise metabólica completa
      • Protocolos injetáveis personalizados
      • Acompanhamento nutricional especializado
      • Suporte psicológico e mudança de hábitos
      • Terapias complementares quando necessário

      Transformação real acontece quando tratamos a causa, não apenas os sintomas.
    `
  },
  {
    id: 4,
    title: "Performance Esportiva",
    subtitle: "O acompanhamento médico é tão importante quanto o treino",
    description: "Consultoria integrada para otimização de performance, prevenção de lesões e conformidade WADA. Para atletas que buscam excelência.",
    image: "/images/clinic/0Y7A0269.jpg",
    slug: "performance-esportiva",
    fullDescription: `
      Para atletas que buscam excelência, oferecemos consultoria integrada que otimiza performance, previne lesões e garante conformidade com regulamentações WADA.

      Nossos serviços incluem:
      • Otimização hormonal para performance
      • Análise de composição corporal
      • Protocolos de recuperação acelerada
      • Suplementação estratégica e legal
      • Prevenção de lesões e reabilitação

      O acompanhamento médico é tão importante quanto o treino quando você busca resultados de elite.
    `
  },
  {
    id: 5,
    title: "Tratamento de Lipedema",
    subtitle: "Lipedema não é obesidade. É uma condição específica.",
    description: "Protocolo não cirúrgico que reduz dor, inchaço e melhora a qualidade de vida. Abordagem integrada com terapias injetáveis e nutrição anti-inflamatória.",
    image: "/images/clinic/0Y7A0271.jpg",
    slug: "lipedema",
    fullDescription: `
      Lipedema não é obesidade. É uma condição específica que requer tratamento especializado. Nosso protocolo não cirúrgico reduz dor, inchaço e melhora significativamente a qualidade de vida.

      Tratamento integrado:
      • Terapias injetáveis específicas para lipedema
      • Nutrição anti-inflamatória personalizada
      • Protocolos de drenagem linfática
      • Acompanhamento multidisciplinar
      • Redução de sintomas e melhora da mobilidade

      Entendemos que lipedema é uma condição médica real que merece tratamento adequado e compaixão.
    `
  },
  {
    id: 6,
    title: "Check-up para Casais",
    subtitle: "Antes de ter filhos, prepare seu corpo e sua saúde",
    description: "Avaliação integrada para casais que desejam conceber com saúde e segurança. Preparação completa para a jornada da parentalidade.",
    image: "/images/clinic/0Y7A0277.jpg",
    slug: "checkup-casais",
    fullDescription: `
      Antes de ter filhos, prepare seu corpo e sua saúde. Oferecemos avaliação integrada para casais que desejam conceber com saúde e segurança.

      Preparação completa inclui:
      • Avaliação hormonal completa (ambos os parceiros)
      • Análise de fertilidade
      • Otimização nutricional pré-concepção
      • Rastreamento de doenças genéticas
      • Preparação física e mental

      A jornada da parentalidade começa muito antes da concepção. Prepare-se adequadamente.
    `
  },
  {
    id: 7,
    title: "Preparação Cirúrgica",
    subtitle: "Prepare seu corpo para se recuperar melhor e mais rápido",
    description: "Protocolo pré e pós-cirúrgico que otimiza recuperação e reduz complicações. Sua recuperação começa semanas antes da cirurgia.",
    image: "/images/clinic/0Y7A0280.jpg",
    slug: "preparacao-cirurgica",
    fullDescription: `
      Sua recuperação começa semanas antes da cirurgia. Nosso protocolo pré e pós-cirúrgico otimiza a recuperação e reduz significativamente as complicações.

      Protocolo completo:
      • Otimização pré-cirúrgica (nutrição, suplementação, condicionamento)
      • Protocolos pós-cirúrgicos para recuperação acelerada
      • Controle de inflamação e dor
      • Prevenção de infecções
      • Acompanhamento multidisciplinar

      Prepare seu corpo adequadamente e sua recuperação será mais rápida e suave.
    `
  }
];

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

