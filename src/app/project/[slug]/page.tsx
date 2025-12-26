"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Magnetic from "@/components/Magnetic";
import Link from "next/link";

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Initial reveal
    gsap.fromTo(
      ".case-study-title",
      { y: 150, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.8, ease: "power4.out", delay: 0.3 }
    );

    // Metadata reveal
    gsap.from(".case-study-meta", {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.8
    });

    // Image reveals on scroll
    gsap.utils.toArray(".case-study-image-container").forEach((img: any) => {
      gsap.from(img, {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.5,
        ease: "power4.inOut",
        scrollTrigger: {
          trigger: img,
          start: "top 85%",
        }
      });
    });
  }, []);

  const projectName = params?.slug ? params.slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Projeto";

  return (
    <div ref={containerRef} style={{ padding: "0 40px" }}>
      {/* Project Hero */}
      <section style={{ minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "end", paddingBottom: "10vh" }}>
        <div className="sub-label" style={{ marginBottom: "2rem" }}>[ PROJECT / 2025 ]</div>
        <h1 className="case-study-title">{projectName}</h1>
        
        <div className="case-study-grid">
          <div className="case-study-meta" style={{ gridColumn: "1 / span 3" }}>
            <span className="sub-label" style={{ display: "block", marginBottom: "1rem" }}>Services</span>
            <p>Art Direction<br />Web Design<br />Interactive Dev</p>
          </div>
          <div className="case-study-meta" style={{ gridColumn: "4 / span 3" }}>
            <span className="sub-label" style={{ display: "block", marginBottom: "1rem" }}>Platform</span>
            <p>Ecosystem<br />Desktop / Mobile</p>
          </div>
          <div className="case-study-meta" style={{ gridColumn: "9 / span 4" }}>
            <p style={{ fontSize: "1.5rem", lineHeight: "1.4", fontWeight: 500 }}>
              Uma imersão profunda na intersecção entre o design minimalista suíço e a interatividade digital de alta performance.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Media Section */}
      <div className="case-study-image-container">
        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000" alt="Detail 1" />
      </div>

      <div className="case-study-grid" style={{ marginBottom: "160px" }}>
        <div className="case-study-image-container" style={{ gridColumn: "1 / span 6", aspectRatio: "4/5", margin: 0 }}>
          <img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1000" alt="Detail 2" />
        </div>
        <div className="case-study-image-container" style={{ gridColumn: "8 / span 5", aspectRatio: "4/5", margin: "160px 0 0" }}>
          <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000" alt="Detail 3" />
        </div>
      </div>

      {/* Next Project Footer */}
      <section style={{ padding: "160px 0", borderTop: "1px solid rgba(0,0,0,0.1)", textAlign: "center" }}>
        <div className="sub-label" style={{ marginBottom: "2rem" }}>Next Project</div>
        <Magnetic>
          <Link href="/" style={{ fontSize: "8vw", textTransform: "uppercase", fontWeight: 700, textDecoration: "none", color: "inherit", letterSpacing: "-0.04em", display: "inline-block" }}>
             MINIMAL STUDIO
          </Link>
        </Magnetic>
      </section>

      <footer style={{ paddingBottom: "40px" }}>
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "40px", display: "flex", justifyContent: "space-between" }}>
          <div className="sub-label">© 2025 DESIGN HOUSE</div>
          <Magnetic>
            <Link href="/" className="sub-label" style={{ textDecoration: "none", cursor: "pointer" }}>[ BACK TO INDEX ]</Link>
          </Magnetic>
        </div>
      </footer>
    </div>
  );
}
