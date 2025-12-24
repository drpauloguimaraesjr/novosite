"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "@/lib/gsap/ScrollTrigger";
import Link from "next/link";
import Magnetic from "@/components/Magnetic";
import HorizontalScroll from "@/components/HorizontalScroll";
import Marquee from "@/components/Marquee";
import InteractiveGrid from "@/components/InteractiveGrid";
import GalleryCarousel from "@/components/GalleryCarousel";
import TextMaskReveal from "@/components/TextMaskReveal";
import ContactSection from "@/components/ContactSection";
import SplitText from "@/components/SplitText";
import SocialReel from "@/components/SocialReel";
import TypingAnimation from "@/components/TypingAnimation";
import FloatingCards from "@/components/FloatingCards";
import VerticalTimeline from "@/components/VerticalTimeline";
import Playground from "@/components/Playground";
import ScrollIndicator from "@/components/ScrollIndicator";

import { useContent } from "@/hooks/useContent";

export default function Home() {
  const siteData = useContent();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !siteData) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Entrance Animation for the "Scroll to Explore" line
      gsap.from(".scroll-line", {
        scaleY: 0,
        duration: 1.5,
        delay: 2.5,
        ease: "power4.inOut"
      });

      // Reveal project list items
      const projectItems = document.querySelectorAll(".project-item");
      if (projectItems.length > 0) {
        gsap.from(projectItems, {
          y: 60,
          opacity: 0,
          stagger: 0.15,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".project-list",
            start: "top 85%",
          },
        });
      }

      // Theme Toggle (Light to Dark on scroll)
      if (document.querySelector(".about-section")) {
        ScrollTrigger.create({
          trigger: ".about-section",
          start: "top 50%",
          onEnter: () => document.body.classList.add("dark-theme"),
          onLeaveBack: () => document.body.classList.remove("dark-theme"),
        });
      }

      if (document.querySelector(".horizontal-scroll-section")) {
        ScrollTrigger.create({
          trigger: ".horizontal-scroll-section",
          start: "top 50%",
          onEnter: () => document.body.classList.add("dark-theme"),
          onEnterBack: () => document.body.classList.add("dark-theme"),
        });
      }

      if (document.querySelector(".contact-section")) {
        ScrollTrigger.create({
          trigger: ".contact-section",
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
          onUpdate: (self) => {
            const y = (1 - self.progress) * 100 * (speed - 1);
            gsap.set(element, { y: y });
          }
        });
      });

      // Project Preview Follow Mouse with Stacking Lag
      projectItems.forEach((item) => {
        const container = item.querySelector(".project-preview-container");
        const layers = item.querySelectorAll(".project-preview");
        
        item.addEventListener("mousemove", (e: any) => {
          const { clientX, clientY } = e;
          const { left, top } = item.getBoundingClientRect();
          
          const x = clientX - left;
          const y = clientY - top;

          gsap.to(container, {
            x: x - 200, 
            y: y - 125,
            duration: 0.8,
            ease: "power3.out",
            overwrite: "auto"
          });

          // Offset individual layers for the ghosting effect
          layers.forEach((layer, idx) => {
            if (idx === 0) return;
            gsap.to(layer, {
              x: (clientX - (window.innerWidth / 2)) * 0.05 * idx,
              y: (clientY - (window.innerHeight / 2)) * 0.05 * idx,
              duration: 1.2,
              ease: "power2.out",
              overwrite: "auto"
            });
          });
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, [mounted, siteData]);

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

      {/* Hero Section */}
      <section style={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        padding: "0 clamp(20px, 4vw, 40px)", 
        position: "relative",
        width: "100%",
        maxWidth: "100vw",
        overflow: "hidden"
      }}>
        <div style={{ marginBottom: "2rem", position: "relative" }} data-speed="0.8">
          <span className="sub-label">[ {siteData.hero.sublabel} ]</span>
        </div>
        
        <h1 style={{ 
          cursor: "default",
          position: "relative",
          width: "100%",
          maxWidth: "100%",
          margin: 0,
          padding: 0,
          transform: "translateZ(0)" // Force hardware acceleration
        }} data-speed={siteData.hero.settings.parallaxSpeed}>
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

        <div style={{ marginTop: "4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <p className="hero-desc" data-speed="0.9">
            {siteData.hero.description}
          </p>
          <div className="sub-label" data-speed="1.1">[ {siteData.hero.edition} ]</div>
        </div>

        {/* Scroll To Explore Indicator - Estilo Eva Sanchez */}
        <ScrollIndicator />
      </section>

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
          <Link 
            href={`/project/${project.title.toLowerCase().replace(/ /g, "-")}`} 
            key={project.id} 
            className="project-item"
            data-cursor-text="VIEW"
          >
            <span className="id">[{String(idx + 1).padStart(3, '0')}]</span>
            <div className="title">
              <SplitText text={project.title} trigger delay={0.1} />
            </div>
            <div className="category">{project.category}</div>
            
            {/* Sanchez Stacking Preview */}
            <div className="project-preview-container">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className={`project-preview ${i > 0 ? 'stack-layer' : ''}`}
                  style={{ 
                    backgroundImage: `url(${project.image})`,
                    backgroundPosition: project.settings.objectPosition || "center",
                    transform: `scale(${1 - i * 0.05}) translateY(${i * 10}px)`
                  }} 
                />
              ))}
            </div>
          </Link>
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
            <p data-lag={siteData.about.settings.lag + 0.1} style={{ fontSize: "1rem", opacity: 0.6 }}>{siteData.about.location}</p>
          </div>
        </div>
      </section>

      <GalleryCarousel data={siteData.visualArchive} />

      {/* FloatingCards - Alternativa ao InteractiveGrid */}
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

      <InteractiveGrid data={siteData.visualArchive} />

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

      {/* Playground - Estilo Eva Sanchez */}
      {siteData.playground && Array.isArray(siteData.playground) && siteData.playground.length > 0 && (
        <Playground 
          items={siteData.playground.map((item: any, index: number) => {
            // Verificar se já tem estrutura de playground ou é do formato antigo
            if (item.images && Array.isArray(item.images)) {
              return {
                id: item.id || item.number || `playground-${index}`,
                number: item.number || String(index + 1).padStart(3, '0'),
                title: item.title,
                description: item.description,
                images: item.images,
                category: item.category
              };
            } else {
              // Formato antigo - agrupar por categoria ou criar seções
              return {
                id: `playground-${index}`,
                number: String(index + 1).padStart(3, '0'),
                title: item.title,
                description: item.desc || item.description,
                images: [item.img].filter(Boolean),
                category: item.category || item.cat
              };
            }
          })}
          title="Playground"
        />
      )}

      {/* HorizontalScroll usa dados diferentes - manter compatibilidade */}
      {siteData.playground && siteData.playground.some((item: any) => item.img) && (
        <HorizontalScroll data={siteData.playground.filter((item: any) => item.img)} />
      )}
      <SocialReel />
      <Marquee />
      <ContactSection />

      {/* Final Footer Section */}
      <footer style={{ padding: "40px", backgroundColor: "var(--text-color)", color: "var(--bg-color)" }}>
        <div style={{ borderTop: "1px solid rgba(248, 246, 242, 0.1)", paddingTop: "40px", display: "flex", justifyContent: "space-between" }}>
          <div className="sub-label">© 2025 DESIGN HOUSE</div>
          <div className="sub-label">DESIGNED BY ES_STUDIO</div>
        </div>
      </footer>
    </div>
  );
}
