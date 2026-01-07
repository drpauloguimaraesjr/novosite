"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "@/lib/gsap/ScrollTrigger";
import Link from "next/link";
import Magnetic from "@/components/Magnetic";
import HorizontalScroll from "@/components/HorizontalScroll";
import InteractiveGrid from "@/components/InteractiveGrid";
import GalleryCarousel from "@/components/GalleryCarousel";
import TextMaskReveal from "@/components/TextMaskReveal";
import ContactSection from "@/components/ContactSection";
import SplitText from "@/components/SplitText";
import SocialReel from "@/components/SocialReel";
import ProcessTimeline from "@/components/ProcessTimeline";
import TypingAnimation from "@/components/TypingAnimation";
import FloatingCards from "@/components/FloatingCards";
import VerticalTimeline from "@/components/VerticalTimeline";
import Playground from "@/components/Playground";
import ScrollIndicator from "@/components/ScrollIndicator";
import ServicesShowcase from "@/components/ServicesShowcase";
import HeroCarousel from "@/components/HeroCarousel";

import { useContent } from "@/hooks/useContent";

export default function Home() {
  const siteData = useContent();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  console.log('[Home] Component rendered, siteData:', !!siteData);
  console.log('[Home] Projects count:', siteData?.projects?.length || 0);
  console.log('[Home] Visual archive count:', siteData?.visualArchive?.length || 0);
  console.log('[Home] Playground items:', siteData?.playground?.length || 0);

  useEffect(() => {
    console.log('[Home] Setting mounted to true');
    setMounted(true);
  }, []);

  // Navegação por tecla ESPAÇO - Scroll para próxima seção
  useEffect(() => {
    if (!mounted) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignorar se estiver digitando em um input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Verificar se a tecla pressionada é ESPAÇO
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault(); // Prevenir scroll padrão da página

        // Selecionar todas as seções principais
        const sections = Array.from(document.querySelectorAll("section")).filter((section) => {
          // Filtrar apenas seções visíveis e com conteúdo significativo
          const rect = section.getBoundingClientRect();
          return rect.height > 100; // Seções com pelo menos 100px de altura
        });

        if (sections.length === 0) return;

        const currentScroll = window.scrollY;
        const viewportHeight = window.innerHeight;
        const threshold = viewportHeight * 0.3; // 30% da viewport como threshold

        // Encontrar a próxima seção que está abaixo do threshold
        let nextSection: Element | null = null;

        for (const section of sections) {
          const rect = section.getBoundingClientRect();
          const sectionTop = window.scrollY + rect.top;

          // Se a seção está abaixo do threshold atual
          if (sectionTop > currentScroll + threshold) {
            nextSection = section;
            break;
          }
        }

        // Se não encontrou próxima seção, verificar se está no final
        if (!nextSection) {
          const lastSection = sections[sections.length - 1];
          const lastSectionBottom = window.scrollY + lastSection.getBoundingClientRect().bottom;

          // Se está próximo do final, voltar ao topo
          if (lastSectionBottom - currentScroll < viewportHeight * 1.5) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }

          // Caso contrário, ir para a última seção
          nextSection = lastSection;
        }

        if (nextSection) {
          nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [mounted]);

  useEffect(() => {
    // Wait for data and mounting
    if (!mounted || !siteData || !siteData.hero) return;

    console.log('[Home] Initializing animations...');
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Entrance Animation
      gsap.from(".scroll-line", {
        scaleY: 0,
        duration: 1.5,
        delay: 2,
        ease: "power4.inOut"
      });

      // Hero Pinning and Text Swap sequence
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 1,
        }
      });

      heroTl.to(".hero-content-1", {
        opacity: 0,
        scale: 0.95,
        y: -30,
        filter: "blur(10px)",
        pointerEvents: "none",
        duration: 1
      }, 0)
        .fromTo(".hero-content-2",
          { opacity: 0, scale: 1.05, y: 50, filter: "blur(10px)", pointerEvents: "none" },
          { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", pointerEvents: "all", duration: 1 },
          0
        );



      // Directional Reveal for project items (Left/Right)
      const projectItems = gsap.utils.toArray(".project-item") as HTMLElement[];
      if (projectItems.length > 0) {
        projectItems.forEach((item, i) => {
          // Odd: Left (-100), Even: Right (100)
          const xStart = i % 2 === 0 ? -100 : 100;

          gsap.fromTo(item,
            {
              opacity: 0,
              x: xStart
            },
            {
              opacity: 1,
              x: 0,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                once: true,
              }
            }
          );
        });
      }

      // Theme Toggle (Light to Dark on scroll)
      const aboutSection = document.querySelector(".about-section");
      if (aboutSection) {
        ScrollTrigger.create({
          trigger: aboutSection,
          start: "top 50%",
          onEnter: () => document.body.classList.add("dark-theme"),
          onLeaveBack: () => document.body.classList.remove("dark-theme"),
        });
      }

      const horizontalSection = document.querySelector(".horizontal-scroll-section");
      if (horizontalSection) {
        ScrollTrigger.create({
          trigger: horizontalSection,
          start: "top 50%",
          onEnter: () => document.body.classList.add("dark-theme"),
          onEnterBack: () => document.body.classList.add("dark-theme"),
        });
      }

      const contactSection = document.querySelector(".contact-section");
      if (contactSection) {
        ScrollTrigger.create({
          trigger: contactSection,
          start: "top 50%",
          onEnter: () => document.body.classList.add("dark-theme"),
        });
      }

      // Parallax Effect for elements with data-speed attribute
      const parallaxElements = document.querySelectorAll("[data-speed]");
      parallaxElements.forEach((element) => {
        const speed = parseFloat(element.getAttribute("data-speed") || "1");
        ScrollTrigger.create({
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self: any) => {
            const y = (1 - self.progress) * 100 * (speed - 1);
            gsap.set(element, { y: y });
          }
        });
      });

      // Sync ScrollTriggers after layout
      const refreshSignals = [200, 1000, 2500, 5000];
      refreshSignals.forEach(delay => {
        setTimeout(() => {
          console.log(`[Home] Triggering ScrollTrigger refresh (${delay}ms)`);
          ScrollTrigger.refresh();
        }, delay);
      });

    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [mounted, siteData]);

  useEffect(() => {
    if (mounted && siteData) {
      console.log('[Home] siteData updated, refreshing ScrollTrigger');
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
    }
  }, [siteData, mounted]);

  if (!mounted) return null;

  const titleLines = siteData.hero.title.split('\n');

  return (
    <div ref={containerRef}>
      {/* Background Grid Helper */}
      <div className="grid-overlay">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="grid-line" />
        ))}
      </div>

      {/* Hero Section - Pinned Transition */}
      <section className="hero-section" style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 clamp(20px, 4vw, 40px)",
        position: "relative",
        width: "100%",
        maxWidth: "100vw",
        overflow: "hidden"
      }}>

        {/* Helper for pinned content alignment */}
        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>

          {/* Content 1: Dr Paulo (Initial) */}
          <div className="hero-content-1" style={{ position: "relative", zIndex: 10, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", willChange: "transform, opacity" }}>
            <div style={{ marginBottom: "3rem", position: "relative", zIndex: 12 }}>
              <span className="sub-label">[ {siteData.hero.sublabel} ]</span>
            </div>

            <h1
              style={{
                cursor: "default",
                position: "relative",
                width: "100%",
                maxWidth: "100%",
                margin: 0,
                padding: 0,
                transform: "translateZ(0)",
                zIndex: 20,
              }}
              data-cursor-ignore="true"
            >
              {titleLines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    overflow: "visible",
                    display: "block",
                    position: "relative",
                    width: "100%",
                    whiteSpace: "nowrap"
                  }}
                >
                  <SplitText
                    text={line}
                    delay={1.5 + (i * 0.2)}
                    interactive={true}
                    className="title-line-inner"
                  />
                </div>
              ))}
            </h1>

            <div style={{ marginTop: "4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <p className="hero-desc">
                  {siteData.hero.description}
                </p>

                {/* Location Buttons - "Parte Inicial" Request */}
                <div style={{ display: "flex", gap: "15px", opacity: 0.8 }}>
                  <Magnetic>
                    <a href="https://www.google.com/maps/search/?api=1&query=Rua+Blumenau,+797+Joinville" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.75rem", textTransform: "uppercase", borderBottom: "1px solid rgba(0,0,0,0.2)", paddingBottom: "2px" }}>
                      Google Maps ↗
                    </a>
                  </Magnetic>
                  <Magnetic>
                    <a href="https://waze.com/ul?q=Rua+Blumenau,797,Joinville" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.75rem", textTransform: "uppercase", borderBottom: "1px solid rgba(0,0,0,0.2)", paddingBottom: "2px" }}>
                      Waze App ↗
                    </a>
                  </Magnetic>
                </div>
              </div>

              <div className="sub-label">[ {siteData.hero.edition} ]</div>
            </div>
          </div>

          {/* Content 2: Why Us (Hidden initially, Swap on scroll) */}
          <div id="why-us" className="hero-content-2" style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            opacity: 0,
            zIndex: 30,
            pointerEvents: "none",
            textAlign: "center",
          }}>
            <div style={{ marginBottom: "3rem" }}>
              <span className="sub-label">[ POR QUE SOMOS MUITO PROCURADOS ? ]</span>
            </div>
            <h2 style={{
              fontSize: "clamp(3rem, 7vw, 6rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: "1400px"
            }}>
              Transforme sua saúde <br />
              com tratamentos <br />
              integrados
            </h2>
          </div>

        </div>

        {/* Hero Carousel - Background */}
        {siteData.hero.heroImages && siteData.hero.heroImages.length > 0 && (
          <HeroCarousel
            images={siteData.hero.heroImages}
            settings={siteData.hero.carouselSettings || {}}
          />
        )}

        <ScrollIndicator />
      </section>

      {/* Services Showcase - Principais Serviços */}
      <ServicesShowcase />

      {/* Project Index Section */}
      <section className="project-list" style={{ marginTop: "20vh", marginBottom: "20vh" }}>
        <div style={{ marginBottom: "6rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span className="sub-label">[ SELECTED SERVICES ]</span>
          <Magnetic>
            <button className="bar-button" data-cursor-text="EXPLORE">
              <div className="bar-line" />
              <span className="bar-label">SEE ALL SERVICES</span>
            </button>
          </Magnetic>
        </div>

        {siteData.projects.map((project: any, idx: number) => (
          <div
            key={project.id}
            className="project-item-wrapper"
          >
            <Link
              href={`/project/${project.title.toLowerCase().replace(/ /g, "-")}`}
              className="project-item"
              data-cursor-text="VIEW"
            >
              <span className="id">[{String(idx + 1).padStart(3, '0')}]</span>
              <div className="title">
                {project.title}
              </div>
              <div className="category">{project.category}</div>
            </Link>
            {/* Descrição que expande no hover */}
            {project.description && (
              <div className="project-description">
                <p>{project.description}</p>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* About Section */}
      <section className="about-section" style={{ marginTop: "20vh", marginBottom: "20vh" }}>
        <div className="sub-label" style={{ color: "rgba(248, 246, 242, 0.5)", marginBottom: "3rem" }}>[ {siteData.about.label} ]</div>

        <TextMaskReveal phrase={siteData.about.phrase} />

        <div className="about-grid">
          <div className="about-description">
            <p data-lag={siteData.about.settings.lag}>{siteData.about.description}</p>
            <br />

          </div>
        </div>
      </section>

      <GalleryCarousel data={siteData.visualArchive} />

      {/* FloatingCards - Ocultado (fotos já estão no GalleryCarousel) */}
      <div style={{ display: "none" }}>
        <FloatingCards
          items={siteData.visualArchive.slice(0, 6).map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.cat,
            image: item.img,
            description: item.description || `Explore ${item.title}`
          }))}
          columns={3}
        />
      </div>

      {/* InteractiveGrid - Ocultado (fotos já estão no GalleryCarousel) */}
      <div style={{ display: "none" }}>
        <InteractiveGrid data={siteData.visualArchive} />
      </div>

      {/* VerticalTimeline - Alternativa ao HorizontalScroll */}
      <VerticalTimeline
        items={siteData.projects.map((project: any, index: number) => ({
          id: project.id,
          title: project.title,
          description: project.category,
          date: `2025 - ${String(index + 1).padStart(2, '0')}`,
          image: project.image,
          category: project.category
        }))}
        title="Nossos Serviços"
      />




      {/* Process Timeline Animation */}
      <ProcessTimeline />

      <SocialReel />
      <ContactSection />

      {/* Final Footer Section */}
      <footer style={{ padding: "40px", backgroundColor: "var(--text-color)", color: "var(--bg-color)" }}>
        <div style={{
          borderTop: "1px solid rgba(248, 246, 242, 0.1)",
          paddingTop: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "15px"
        }}>
          <div className="sub-label" style={{ opacity: 0.7 }}>© 2025 Todos os direitos reservados.</div>
          <div className="sub-label" style={{ fontSize: "0.65rem", opacity: 0.5 }}>
            P C GUIMARAES JUNIOR LTDA – CNPJ 14.705.723/0001-09
          </div>
          <div className="sub-label" style={{ fontSize: "0.65rem", opacity: 0.5 }}>
            Rua Blumenau, 797 – Joinville/SC
          </div>
          <div className="sub-label" style={{ fontSize: "0.65rem", opacity: 0.5 }}>
            contato@drpauloguimaraesjr.com.br
          </div>
          <div className="sub-label" style={{ fontSize: "0.7rem", opacity: 0.6, marginTop: "10px" }}>
            RT: CRM-SC 21698
          </div>
        </div>
      </footer>
    </div>
  );
}
