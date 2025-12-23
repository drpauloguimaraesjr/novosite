"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "@/lib/gsap/ScrollTrigger";
import Link from "next/link";
import Magnetic from "@/components/Magnetic";
import HorizontalScroll from "@/components/HorizontalScroll";
import Marquee from "@/components/Marquee";
import InteractiveGrid from "@/components/InteractiveGrid";
import TextMaskReveal from "@/components/TextMaskReveal";
import ContactSection from "@/components/ContactSection";
import SplitText from "@/components/SplitText";
import SocialReel from "@/components/SocialReel";

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
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 40px", position: "relative" }}>
        <div style={{ marginBottom: "2rem" }} data-speed="0.8">
          <span className="sub-label">[ {siteData.hero.sublabel} ]</span>
        </div>
        
        <h1 style={{ cursor: "default" }} data-speed={siteData.hero.settings.parallaxSpeed}>
          {titleLines.map((line, i) => (
            <div key={i} style={{ overflow: "hidden", display: "block" }}>
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

        {/* Scroll To Explore Indicator */}
        <div className="scroll-explore">
          <span className="sub-label">[ SCROLL TO EXPLORE ]</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* Project Index Section */}
      <section className="project-list">
        <div style={{ marginBottom: "6rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span className="sub-label">[ SELECTED SERVICES ]</span>
          <button className="bar-button" data-cursor-text="EXPLORE">
            <div className="bar-line" />
            <span className="bar-label">SEE ALL SERVICES</span>
          </button>
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
      <section className="about-section">
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

      <InteractiveGrid data={siteData.visualArchive} />

      <HorizontalScroll data={siteData.playground} />
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
