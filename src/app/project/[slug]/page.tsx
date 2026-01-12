"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Magnetic from "@/components/Magnetic";
import Link from "next/link";
import { endocrinologia_clinica } from "@/data/projects/endocrinologia-clinica";
import { protocolos_injetaveis } from "@/data/projects/protocolos-injetaveis";

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

    // Sections reveal
    gsap.utils.toArray(".reveal-section").forEach((section: any) => {
      gsap.from(section, {
        y: 60,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 90%",
        }
      });
    });
  }, []);

  const decodedSlug = decodeURIComponent(params.slug);
  
  // Mapping of projects
  const projectMap: Record<string, any> = {
    "endocrinologia-clinica": endocrinologia_clinica,
    "endocrinologia-clínica": endocrinologia_clinica,
    "protocolos-injetaveis": protocolos_injetaveis,
    "protocolos-injetáveis": protocolos_injetaveis
  };

  const project = projectMap[decodedSlug] || projectMap[params.slug];
  const projectName = project ? project.title : (params?.slug ? params.slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Projeto");

  if (!mounted) return null;

  return (
    <div ref={containerRef} style={{ padding: "0 40px" }}>
      {/* Project Hero */}
      <section style={{ minHeight: "85vh", display: "flex", flexDirection: "column", justifyContent: "end", paddingBottom: "10vh" }}>
        <div className="sub-label" style={{ marginBottom: "2rem" }}>[ {project ? (project.category as string).toUpperCase() : "PROJECT"} / {project ? project.year : "2025"} ]</div>
        <h1 className="case-study-title" style={{ fontSize: "clamp(3rem, 6.5vw, 8rem)", maxWidth: "1500px" }}>
          {project ? project.fullTitle : projectName}
        </h1>
        
        <div className="case-study-grid" style={{ marginTop: "4rem" }}>
          <div className="case-study-meta" style={{ gridColumn: "1 / span 3" }}>
            <span className="sub-label" style={{ display: "block", marginBottom: "1rem" }}>Services</span>
            <p>{project ? project.services.join(" / ") : "Art Direction / Web Design"}</p>
          </div>
          <div className="case-study-meta" style={{ gridColumn: "4 / span 3" }}>
            <span className="sub-label" style={{ display: "block", marginBottom: "1rem" }}>Focus</span>
            <p>{project ? "Integrated Health / Performance" : "Digital Experience"}</p>
          </div>
          <div className="case-study-meta" style={{ gridColumn: "9 / span 4" }}>
            <p style={{ fontSize: "1.4rem", lineHeight: "1.4", fontWeight: 400, opacity: 0.7 }}>
              {project ? project.intro : "Uma imersão profunda na intersecção entre o design minimalista suíço e a interatividade digital de alta performance."}
            </p>
          </div>
        </div>
      </section>

      {/* Main Project Image */}
      {project && project.image && (
        <div className="reveal-section" style={{ width: "100%", height: "80vh", overflow: "hidden", marginBottom: "15vh" }}>
          <img 
            src={project.image} 
            alt={project.title} 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
        </div>
      )}

      {/* Structured Content for Projects */}
      {project && (
        <div className="project-detail-content" style={{ marginTop: "10vh" }}>
          {project.sections.map((section: any, idx: number) => {
            if (section.type === "content-block") {
              return (
                <div key={idx} className="reveal-section" style={{ marginBottom: "12vh", maxWidth: "1200px" }}>
                  <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 500, marginBottom: "3rem", letterSpacing: "-0.02em" }}>
                    {section.title}
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {section.paragraphs?.map((p: string, pIdx: number) => (
                      <p key={pIdx} style={{ fontSize: "1.25rem", lineHeight: "1.7", opacity: 0.8, fontWeight: 400 }}>
                        {p}
                      </p>
                    ))}
                  </div>
                  {section.list && (
                    <div style={{ marginTop: "4rem", borderLeft: "1px dotted rgba(0,0,0,0.2)", paddingLeft: "3rem" }}>
                      {section.list.map((item: any, lIdx: number) => (
                        <div key={lIdx} style={{ marginBottom: "2.5rem" }}>
                          <span className="sub-label" style={{ color: "var(--accent-blue)", opacity: 1, display: "block", marginBottom: "1rem" }}>
                            {lIdx + 1}. {item.label}
                          </span>
                          <p style={{ fontSize: "1.1rem", lineHeight: "1.6", opacity: 0.7 }}>{item.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if (section.type === "highlight-block") {
              return (
                <div key={idx} className="reveal-section" style={{ 
                  marginBottom: "12vh", 
                  padding: "4rem", 
                  backgroundColor: "rgba(0,102,255,0.03)", 
                  borderLeft: "4px solid var(--accent-blue)",
                  maxWidth: "1100px" 
                }}>
                  <span className="sub-label" style={{ display: "block", marginBottom: "2rem", color: "var(--accent-blue)", opacity: 1 }}>{section.title}</span>
                  <p style={{ fontSize: "1.8rem", lineHeight: "1.4", fontWeight: 400, letterSpacing: "-0.01em" }}>{section.content}</p>
                </div>
              );
            }

            if (section.type === "table") {
              return (
                <div key={idx} className="reveal-section" style={{ marginBottom: "12vh" }}>
                  <div className="sub-label" style={{ marginBottom: "2rem" }}>[ {section.title?.toUpperCase()} ]</div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                          {section.headers?.map((h: string, hIdx: number) => (
                            <th key={hIdx} style={{ padding: "1.5rem 1rem", fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 600, opacity: 0.5 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.rows?.map((row: string[], rIdx: number) => (
                          <tr key={rIdx} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                            {row.map((cell: string, cIdx: number) => (
                              <td key={cIdx} style={{ padding: "2rem 1rem", fontSize: "1.1rem", fontWeight: cIdx === 0 ? 500 : 400 }}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            }

            if (section.type === "case-studies") {
              return (
                <div key={idx} className="reveal-section" style={{ marginBottom: "12vh" }}>
                  <div className="sub-label" style={{ marginBottom: "4rem" }}>[ {section.title?.toUpperCase()} ]</div>
                  <div className="case-study-grid" style={{ gap: "4rem" }}>
                    {section.items?.map((item: any, sIdx: number) => (
                      <div key={sIdx} style={{ gridColumn: sIdx === 0 ? "1 / span 6" : "7 / span 6", padding: "3rem", border: "1px solid rgba(0,0,0,0.05)", borderRadius: "8px" }}>
                        <span className="sub-label" style={{ marginBottom: "1rem", display: "block" }}>{item.label}</span>
                        <h3 style={{ fontSize: "1.8rem", marginBottom: "2rem" }}>{item.subtitle}</h3>
                        <div style={{ fontSize: "1.05rem", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                          <div>
                            <span style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>Apresentação:</span>
                            <span style={{ opacity: 0.7 }}>{item.presentation}</span>
                          </div>
                          <div>
                            <span style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>Conduta:</span>
                            <span style={{ opacity: 0.7 }}>{item.approach}</span>
                          </div>
                          <div style={{ color: "var(--accent-blue)" }}>
                            <span style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>Resultado:</span>
                            <span>{item.results}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (section.type === "references") {
              return (
                <div key={idx} className="reveal-section" style={{ marginBottom: "12vh", borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "4rem" }}>
                  <div className="sub-label" style={{ marginBottom: "2rem" }}>[ REFERÊNCIAS BIBLIOGRÁFICAS ]</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                    {section.items?.map((item: string, rIdx: number) => (
                      <p key={rIdx} style={{ fontSize: "0.85rem", lineHeight: "1.5", opacity: 0.4 }}>{item}</p>
                    ))}
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      )}

      {/* Default Visual Elements for other projects */}
      {!project && (
        <>
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
        </>
      )}

      {/* Next Project Footer */}
      <section style={{ padding: "160px 0", borderTop: "1px solid rgba(0,0,0,0.1)", textAlign: "center" }}>
        <div className="sub-label" style={{ marginBottom: "2rem" }}>Next Project</div>
        <Magnetic>
          <Link href="/" style={{ fontSize: "8vw", textTransform: "uppercase", fontWeight: 700, textDecoration: "none", color: "inherit", letterSpacing: "-0.04em", display: "inline-block" }}>
             BACK TO INDEX
          </Link>
        </Magnetic>
      </section>

      <footer style={{ paddingBottom: "40px" }}>
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "40px", display: "flex", justifyContent: "space-between" }}>
          <div className="sub-label">© 2025 INSTITUTO DR. PAULO GUIMARÃES JR.</div>
          <Magnetic>
            <Link href="/" className="sub-label" style={{ textDecoration: "none", cursor: "pointer" }}>[ BACK TO INDEX ]</Link>
          </Magnetic>
        </div>
      </footer>
    </div>
  );
}
