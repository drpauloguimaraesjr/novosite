"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Activity, Repeat, Stethoscope } from "lucide-react";

export default function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of this specific container relative to the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Calculate progress for each step based on the total container scroll
  const step1Progress = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const step2Progress = useTransform(scrollYProgress, [0.35, 0.65], [0, 1]);
  const step3Progress = useTransform(scrollYProgress, [0.7, 1], [0, 1]);

  // Circle animations
  const circleScale = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const circleOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);

  return (
    <div ref={containerRef} className="process-timeline-container">
      {/* Sticky Header */}
      <div className="process-header">
        <div className="process-header-content">
          <div>
            <h2 className="process-main-title">
              Processo de Acompanhamento
            </h2>
            <div className="process-status-bar">
              {/* Dynamic text could be added here using useTransform if needed, 
                  but simpler just to show the title for now or simple sticky progress */}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Circle Overlay */}
      <motion.div 
        className="process-circle-overlay"
        style={{ 
          scale: circleScale,
          opacity: circleOpacity,
        }}
      >
        <CircleProgress 
          step1Progress={step1Progress}
          step2Progress={step2Progress}
          step3Progress={step3Progress}
        />
      </motion.div>

      {/* Content Sections */}
      <div className="process-content-wrapper">
        
        {/* Step 1: Consulta Médica */}
        <section className="process-step step-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ margin: "-20%" }}
            className="process-card"
          >
            <div className="process-step-header">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8 }}
                className="process-icon-box"
              >
                <Stethoscope size={48} />
              </motion.div>
              <div className="process-step-label">ETAPA 01</div>
              <h3 className="process-step-title">Consulta Médica</h3>
              <div className="process-divider" />
            </div>

            <div className="process-details-grid">
              <DetailCard
                number="1.1"
                title="Anamnese Completa"
                description="Entendimento profundo do histórico clínico, necessidades individuais e objetivos terapêuticos específicos."
              />
              <DetailCard
                number="1.2"
                title="Análise Laboratorial"
                description="Discussão detalhada dos exames com interpretação de todos os marcadores bioquímicos e suas correlações."
              />
              <DetailCard
                number="1.3"
                title="Plano Terapêutico"
                description="Elaboração de protocolo personalizado baseado em quatro pilares fundamentais de tratamento."
              />
            </div>

            <div className="process-pillars-grid">
              <PillarCard title="Descanso" subtitle="Sleep Protocol" />
              <PillarCard title="Alimentação" subtitle="Nutrition Plan" />
              <PillarCard title="Atividade Física" subtitle="Exercise Program" />
              <PillarCard title="Otimização" subtitle="Biochemical Balance" />
            </div>
          </motion.div>
        </section>

        {/* Step 2: Seguimento */}
        <section className="process-step step-right">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ margin: "-20%" }}
            className="process-card narrow"
          >
            <div className="process-step-header">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8 }}
                className="process-icon-box"
              >
                <Activity size={48} />
              </motion.div>
              <div className="process-step-label">ETAPA 02</div>
              <h3 className="process-step-title">Seguimento</h3>
              <div className="process-divider" />
            </div>

            <div className="process-details-list">
              <DetailCard
                number="2.1"
                title="Acompanhamento Contínuo"
                description="Monitoramento sistemático ao longo de todo o processo terapêutico com ajustes baseados em evidências."
              />
              <DetailCard
                number="2.2"
                title="Bioimpedância Seriada"
                description="Avaliações periódicas da composição corporal para otimização de estratégias nutricionais e metabólicas."
              />
              <DetailCard
                number="2.3"
                title="Suporte Integrado"
                description="Assistência contínua para garantir aderência ao protocolo e resolução de questões em tempo real."
              />
            </div>

            <div className="process-note">
              <div className="process-note-bar" />
              <div>
                <div className="process-note-label">NOTA TÉCNICA</div>
                <p>
                  O monitoramento contínuo permite ajustes precisos em tempo real, 
                  maximizando a eficácia do tratamento através de medicina baseada em dados.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Step 3: Reconsulta */}
        <section className="process-step step-left">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ margin: "-20%" }}
            className="process-card narrow"
          >
            <div className="process-step-header">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8 }}
                className="process-icon-box"
              >
                <Repeat size={48} />
              </motion.div>
              <div className="process-step-label">ETAPA 03</div>
              <h3 className="process-step-title">Reconsulta</h3>
              <div className="process-divider" />
            </div>

            <div className="process-details-list">
              <DetailCard
                number="3.1"
                title="Avaliação de Resultados"
                description="Análise objetiva de parâmetros físicos, bioquímicos e sintomatológicos alcançados no período."
              />
              <DetailCard
                number="3.2"
                title="Reavaliação Laboratorial"
                description="Validação das melhorias através de marcadores bioquímicos e comparação com baseline inicial."
              />
              <DetailCard
                number="3.3"
                title="Reestruturação Terapêutica"
                description="Atualização do protocolo baseada em resultados objetivos e estabelecimento de novos objetivos."
              />
              <DetailCard
                number="3.4"
                title="Planejamento de Manutenção"
                description="Elaboração de estratégias para manutenção dos resultados e evolução contínua do tratamento."
              />
            </div>

            <div className="process-note dark">
              <div className="process-note-bar white" />
              <div>
                <div className="process-note-label">CICLO CONTÍNUO</div>
                <p>
                  Este processo cíclico garante tratamento sempre alinhado às necessidades atuais, 
                  ajustado conforme idade, composição corporal e otimização bioquímica individual.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer of the Process */}
        <section className="process-footer">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="process-footer-content"
          >
            <div className="process-infinity">∞</div>
            <h3 className="process-footer-title">Processo Cíclico de Excelência</h3>
            <p className="process-footer-desc">
              Metodologia baseada em evidências científicas para otimização contínua.
            </p>
            <div className="process-stats-grid">
              <StatCard number="03" label="Etapas Integradas" />
              <StatCard number="100%" label="Personalização" />
              <StatCard number="∞" label="Ciclo Contínuo" />
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
}

// ---------------- Sub Components ----------------

function CircleProgress({ 
  step1Progress, 
  step2Progress, 
  step3Progress 
}: { 
  step1Progress: MotionValue<number>;
  step2Progress: MotionValue<number>;
  step3Progress: MotionValue<number>;
}) {
  const radius = 180;
  const strokeWidth = 2;
  const circumference = 2 * Math.PI * radius;
  const segmentLength = circumference / 3;

  // Transform progress 0-1 into dasharray values "length circumference"
  const dash1 = useTransform(step1Progress, v => `${segmentLength * v} ${circumference}`);
  const dash2 = useTransform(step2Progress, v => `${segmentLength * v} ${circumference}`);
  const dash3 = useTransform(step3Progress, v => `${segmentLength * v} ${circumference}`);

  return (
    <svg width="500" height="500" viewBox="0 0 500 500" className="process-svg">
      {/* Background Circle */}
      <circle
        cx="250" cy="250" r={radius}
        className="circle-bg"
        fill="none" strokeWidth={strokeWidth} strokeDasharray="4 8"
      />

      {/* Segment 1 */}
      <motion.circle
        cx="250" cy="250" r={radius}
        fill="none" className="circle-stroke" strokeWidth={strokeWidth * 2}
        style={{ strokeDasharray: dash1 }}
        strokeDashoffset={0}
        strokeLinecap="round"
        transform="rotate(-90 250 250)"
      />

      {/* Segment 2 */}
      <motion.circle
        cx="250" cy="250" r={radius}
        fill="none" className="circle-stroke" strokeWidth={strokeWidth * 2}
        style={{ strokeDasharray: dash2 }}
        strokeDashoffset={-segmentLength}
        strokeLinecap="round"
        transform="rotate(-90 250 250)"
      />

       {/* Segment 3 */}
      <motion.circle
        cx="250" cy="250" r={radius}
        fill="none" className="circle-stroke" strokeWidth={strokeWidth * 2}
        style={{ strokeDasharray: dash3 }}
        strokeDashoffset={-segmentLength * 2}
        strokeLinecap="round"
        transform="rotate(-90 250 250)"
      />

       {/* Step Indicators (simplified for vanilla CSS styling) */}
       <g className="indicator-group step-1">
          <circle cx="250" cy="70" r="20" className="indicator-bg" strokeWidth="2" />
          <text x="250" y="70" className="indicator-text">01</text>
       </g>
       <g className="indicator-group step-2">
          <circle cx="405" cy="340" r="20" className="indicator-bg" strokeWidth="2" />
          <text x="405" y="340" className="indicator-text">02</text>
       </g>
       <g className="indicator-group step-3">
          <circle cx="95" cy="340" r="20" className="indicator-bg" strokeWidth="2" />
          <text x="95" y="340" className="indicator-text">03</text>
       </g>
    </svg>
  );
}

// Simplified Circle Progress for brevity and robustness in "vanilla-like" context
// I will actually replace the above SVG with a more direct port of the original logic using variables
// But since I can't easily put MotionValues into attributes like that without 'style', let's fix.

function DetailCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="process-detail-card">
      <div className="detail-number">{number}</div>
      <div className="detail-content">
        <h4 className="detail-title">{title}</h4>
        <p className="detail-desc">{description}</p>
      </div>
    </div>
  );
}

function PillarCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="process-pillar-card">
      <div className="pillar-subtitle">{subtitle}</div>
      <div className="pillar-title">{title}</div>
    </motion.div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="process-stat-card">
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
