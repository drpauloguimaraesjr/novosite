"use client";

import TypingAnimation from "@/components/TypingAnimation";
import FloatingCards from "@/components/FloatingCards";
import VerticalTimeline from "@/components/VerticalTimeline";
import { useContent } from "@/hooks/useContent";

export default function AnimationsDemo() {
    const siteData = useContent();

    // Preparar dados para FloatingCards
    const floatingCardsData = siteData?.visualArchive?.slice(0, 6).map((item: any) => ({
        id: item.id,
        title: item.title,
        category: item.cat,
        image: item.img,
        description: item.description || `Explore ${item.title}`
    })) || [];

    // Preparar dados para VerticalTimeline
    const timelineData = siteData?.projects?.map((project: any, index: number) => ({
        id: project.id,
        title: project.title,
        description: project.category,
        date: `2025 - ${String(index + 1).padStart(2, '0')}`,
        image: project.image,
        category: project.category
    })) || [];

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-color)" }}>
            {/* Hero com TypingAnimation */}
            <section style={{ 
                minHeight: "100vh", 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "center", 
                padding: "0 40px",
                alignItems: "center",
                textAlign: "center"
            }}>
                <div style={{ marginBottom: "2rem" }}>
                    <span className="sub-label">[ DEMONSTRAÇÃO DE ANIMAÇÕES ]</span>
                </div>
                
                <h1 style={{ fontSize: "clamp(3rem, 10vw, 8rem)", marginBottom: "2rem" }}>
                    <TypingAnimation 
                        text="ANIMAÇÕES ALTERNATIVAS" 
                        speed={80}
                        delay={500}
                    />
                </h1>

                <p className="hero-desc" style={{ maxWidth: "600px", margin: "0 auto" }}>
                    <TypingAnimation 
                        text="Componentes inspirados mas únicos, criando experiências visuais distintas." 
                        speed={30}
                        delay={3000}
                    />
                </p>
            </section>

            {/* FloatingCards Section */}
            {floatingCardsData.length > 0 && (
                <FloatingCards items={floatingCardsData} columns={3} />
            )}

            {/* VerticalTimeline Section */}
            {timelineData.length > 0 && (
                <VerticalTimeline items={timelineData} title="Serviços" />
            )}

            {/* Comparação de Animações */}
            <section style={{ 
                padding: "20vh 40px",
                backgroundColor: "var(--bg-color)",
                maxWidth: "1200px",
                margin: "0 auto"
            }}>
                <div style={{ marginBottom: "6rem" }}>
                    <span className="sub-label">[ COMPARAÇÃO ]</span>
                    <h2 style={{ fontSize: "clamp(2rem, 6vw, 5rem)", marginTop: "1rem" }}>
                        Animações Disponíveis
                    </h2>
                </div>

                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "40px"
                }}>
                    <div style={{ padding: "2rem", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "12px" }}>
                        <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>TypingAnimation</h3>
                        <p style={{ opacity: 0.7, marginBottom: "1rem" }}>
                            Efeito de digitação ao invés de split-text. Mais dinâmico e moderno.
                        </p>
                        <TypingAnimation 
                            text="Exemplo de texto digitando..." 
                            speed={50}
                            showCursor={true}
                        />
                    </div>

                    <div style={{ padding: "2rem", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "12px" }}>
                        <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>FloatingCards</h3>
                        <p style={{ opacity: 0.7, marginBottom: "1rem" }}>
                            Cards flutuantes 3D ao invés de stacking preview. Interação mais suave.
                        </p>
                        <div style={{ fontSize: "0.9rem", opacity: 0.6 }}>
                            Passe o mouse sobre os cards acima para ver o efeito 3D.
                        </div>
                    </div>

                    <div style={{ padding: "2rem", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "12px" }}>
                        <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>VerticalTimeline</h3>
                        <p style={{ opacity: 0.7, marginBottom: "1rem" }}>
                            Timeline vertical ao invés de scroll horizontal. Melhor para mobile.
                        </p>
                        <div style={{ fontSize: "0.9rem", opacity: 0.6 }}>
                            Role a página para ver a timeline animada acima.
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

