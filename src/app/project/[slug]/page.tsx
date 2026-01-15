"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Magnetic from "@/components/Magnetic";
import Link from "next/link";
import { useContent } from "@/hooks/useContent";
import { useScrollAnimations } from "@/hooks/useScrollAnimations";
import MistBackground from "@/components/MistBackground";
import { endocrinologia_clinica } from "@/data/projects/endocrinologia-clinica";
import { protocolos_injetaveis } from "@/data/projects/protocolos-injetaveis";
import { implantes_hormonais } from "@/data/projects/implantes-hormonais";



export default function ProjectDetail() {
  const params = useParams();
  const slug = params?.slug as string || "";
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  
  // Get site content from content.json (editable via admin)
  const siteData = useContent();

  // Use the advanced scroll animations hook
  useScrollAnimations(containerRef);

  useEffect(() => {
    setMounted(true);
    gsap.registerPlugin(ScrollTrigger);

    // Initial reveal animation for hero elements
    gsap.fromTo(
      ".case-study-title",
      { y: 150, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.8, ease: "power4.out", delay: 0.3 }
    );

    // Metadata reveal with stagger
    gsap.from(".case-study-meta", {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.8
    });

    // Hero background fade in
    gsap.fromTo(
      ".hero-bg-container",
      { opacity: 0, scale: 1.1 },
      { opacity: 0.45, scale: 1, duration: 2, ease: "power2.out", delay: 0.5 }
    );
  }, []);

  const decodedSlug = decodeURIComponent(slug);
  // Clean slug - remove any trailing special characters like **
  const cleanSlug = decodedSlug.replace(/[*]+$/, '').replace(/[*]+$/, '');
  
  // Mapping of projects (static content)
  const projectMap: Record<string, any> = {
    "endocrinologia-clinica": endocrinologia_clinica,
    "endocrinologia-clínica": endocrinologia_clinica,
    "protocolos-injetaveis": protocolos_injetaveis,
    "protocolos-injetáveis": protocolos_injetaveis,
    "implantes-hormonais": implantes_hormonais,
    "implantes-hormonais**": implantes_hormonais
  };

  const project = projectMap[cleanSlug] || projectMap[decodedSlug] || projectMap[slug];
  const projectName = project ? project.title : (slug ? slug.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Projeto");

  // Find matching project from content.json to get the admin-editable image
  const contentProject = siteData?.projects?.find((p: any) => {
    const projectSlug = p.title?.toLowerCase().replace(/ /g, "-");
    return projectSlug === cleanSlug || projectSlug === decodedSlug;
  });
  
  // Use image from content.json (admin-editable) if available, otherwise fallback to static data
  const projectImage = contentProject?.image || project?.image;

  // Debug log
  useEffect(() => {
    console.log("[ProjectDetail] Slug:", slug, "Decoded:", decodedSlug, "Project found:", !!project, "Content image:", contentProject?.image);
  }, [slug, decodedSlug, project, contentProject]);

  if (!mounted) return null;



  return (
    <>
      {/* Mist Background with scroll-controlled opacity (green tones) */}
      <MistBackground scrollControlled={true} />
      
      <div ref={containerRef} style={{ padding: "0 40px" }}>
      {/* Immersive Project Hero */}
      <section className="project-detail-hero">
        {projectImage && (
          <div className="hero-bg-container">
            <img src={projectImage} alt="" />
          </div>
        )}

        <div className="hero-content-wrapper">
          <div className="sub-label" style={{ marginBottom: "2rem", opacity: 0.8 }}>
            [ {project ? (project.category as string).toUpperCase() : "PROJECT"} / {project ? project.year : "2025"} ]
          </div>
          <h1 className="case-study-title">
            {project ? project.fullTitle : projectName}
          </h1>
          
          <div className="case-study-grid" style={{ marginTop: "4rem" }}>
            <div className="case-study-meta" style={{ gridColumn: "1 / span 3" }}>
              <span className="sub-label" style={{ display: "block", marginBottom: "1rem" }}>Services</span>
              <p style={{ fontWeight: 500 }}>{project ? project.services.join(" / ") : "Art Direction / Web Design"}</p>
            </div>
            <div className="case-study-meta" style={{ gridColumn: "4 / span 3" }}>
              <span className="sub-label" style={{ display: "block", marginBottom: "1rem" }}>Focus</span>
              <p style={{ fontWeight: 500 }}>{project ? "Integrated Health / Performance" : "Digital Experience"}</p>
            </div>
            <div className="case-study-meta" style={{ gridColumn: "9 / span 4" }}>
              <p style={{ fontSize: "1.3rem", lineHeight: "1.5", fontWeight: 400, opacity: 0.8 }}>
                {project ? project.intro : "Uma imersão profunda na intersecção entre o design minimalista suíço e a interatividade digital de alta performance."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Content for Projects - Premium Design */}
      {project && (
        <div className="project-detail-content" style={{ marginTop: "10vh" }}>
          {project.sections.map((section: any, idx: number) => {
            if (section.type === "content-block") {
              return (
                <div key={idx} className="reveal-section project-content-block">
                  <h2>{section.title}</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {section.paragraphs?.map((p: string, pIdx: number) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>
                  {section.list && (
                    <div className="project-list-container">
                      {section.list.map((item: any, lIdx: number) => (
                        <div key={lIdx} className="project-list-item">
                          <span className="list-number">{item.label}</span>
                          <h4>{item.label}</h4>
                          <p>{item.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if (section.type === "highlight-block") {
              return (
                <div key={idx} className="reveal-section project-highlight-block">
                  <span className="highlight-label">{section.title}</span>
                  <p className="highlight-content">{section.content}</p>
                </div>
              );
            }

            if (section.type === "table") {
              return (
                <div key={idx} className="reveal-section project-table-container">
                  <div className="project-table-header">
                    <span className="table-title">{section.title}</span>
                  </div>
                  <table className="project-table">
                    <thead>
                      <tr>
                        {section.headers?.map((h: string, hIdx: number) => (
                          <th key={hIdx}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows?.map((row: string[], rIdx: number) => (
                        <tr key={rIdx}>
                          {row.map((cell: string, cIdx: number) => (
                            <td key={cIdx}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }

            if (section.type === "stats") {
              return (
                <div key={idx} className="reveal-section project-stats-grid">
                  {section.items?.map((stat: any, sIdx: number) => (
                    <div key={sIdx} className="project-stat-item">
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              );
            }

            if (section.type === "case-studies") {
              return (
                <div key={idx} className="reveal-section project-case-studies">
                  <div className="section-label">[ {section.title?.toUpperCase()} ]</div>
                  <div className="project-case-grid">
                    {section.items?.map((item: any, sIdx: number) => (
                      <div key={sIdx} className="project-case-card">
                        <span className="case-label">{item.label}</span>
                        <h3>{item.subtitle}</h3>
                        <div className="case-section">
                          <span className="case-section-label">Apresentação</span>
                          <p className="case-section-content">{item.presentation}</p>
                        </div>
                        <div className="case-section">
                          <span className="case-section-label">Conduta</span>
                          <p className="case-section-content">{item.approach}</p>
                        </div>
                        <div className="case-section case-result">
                          <span className="case-section-label">Resultado</span>
                          <p className="case-section-content">{item.results}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (section.type === "references") {
              return (
                <div key={idx} className="reveal-section project-references">
                  <div className="section-label">[ REFERÊNCIAS BIBLIOGRÁFICAS ]</div>
                  <div className="project-references-grid">
                    {section.items?.map((item: string, rIdx: number) => (
                      <p key={rIdx} className="project-reference-item">{item}</p>
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
    </>
  );
}
