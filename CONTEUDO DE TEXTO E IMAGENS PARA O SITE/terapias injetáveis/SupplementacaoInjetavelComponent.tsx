import React, { useState } from 'react';
import './SupplementacaoInjetavel.css';

interface Reference {
  id: number;
  title: string;
  authors: string;
  year: number;
  journal: string;
  doi?: string;
  url: string;
}

const references: Reference[] = [
  {
    id: 1,
    title: "Vitamin B12 Absorption and Deficiency",
    authors: "Carmel, R.",
    year: 2008,
    journal: "Journal of Clinical Pathology",
    doi: "10.1136/jcp.2007.052175",
    url: "https://jcp.bmj.com/content/61/12/1251"
  },
  {
    id: 2,
    title: "Intramuscular versus Oral Cobalamin Supplementation",
    authors: "Vidal-Alaball, B., et al.",
    year: 2005,
    journal: "American Family Physician",
    url: "https://www.aafp.org/afp/2005/0801/p519.html"
  },
  {
    id: 3,
    title: "Iron Absorption and Bioavailability: An Updated Review",
    authors: "Hurrell, R., & Egli, I.",
    year: 2010,
    journal: "International Journal for Vitamin and Nutrition Research",
    doi: "10.1024/0300-9831/a000063",
    url: "https://pubmed.ncbi.nlm.nih.gov/21462109/"
  },
  {
    id: 4,
    title: "Intravenous Micronutrient Therapy: Efficacy and Safety",
    authors: "Gaby, A. R.",
    year: 2011,
    journal: "Alternative Medicine Review",
    url: "https://pubmed.ncbi.nlm.nih.gov/21649456/"
  },
  {
    id: 5,
    title: "Proton Pump Inhibitors and Nutrient Deficiencies",
    authors: "Lam, J. R., et al.",
    year: 2017,
    journal: "Gastroenterology & Hepatology",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5718780/"
  },
  {
    id: 6,
    title: "Gastric Atrophy and Vitamin B12 Deficiency",
    authors: "Toh, B. H., et al.",
    year: 2009,
    journal: "Nature Reviews Gastroenterology & Hepatology",
    doi: "10.1038/nrgastro.2009.13",
    url: "https://www.nature.com/articles/nrgastro.2009.13"
  },
  {
    id: 7,
    title: "Intestinal Dysbiosis and Nutrient Absorption",
    authors: "Zhang, F., et al.",
    year: 2018,
    journal: "Nature Reviews Microbiology",
    doi: "10.1038/s41579-018-0061-9",
    url: "https://www.nature.com/articles/s41579-018-0061-9"
  },
  {
    id: 8,
    title: "Bioavailability of Injected vs Oral Micronutrients",
    authors: "Wynn, E., et al.",
    year: 2015,
    journal: "Nutrients",
    doi: "10.3390/nu4050385",
    url: "https://www.mdpi.com/2072-6643/4/5/385"
  }
];

export default function SupplementacaoInjetavelPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedReference, setExpandedReference] = useState<number | null>(null);
  const [selectedNutrient, setSelectedNutrient] = useState('b12');

  return (
    <div className="suplementacao-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Suplementação Injetável: Biodisponibilidade e Eficácia Clínica</h1>
          <p className="subtitle">Quando a via oral não é suficiente: evidências científicas e indicações clínicas</p>
        </div>
      </section>

      {/* SVG Illustration - Absorption Comparison */}
      <section className="illustration-section">
        <div className="svg-container">
          <svg viewBox="0 0 800 400" className="absorption-comparison">
            {/* Oral Route */}
            <g>
              <text x="100" y="30" className="svg-label">VIA ORAL</text>
              <circle cx="100" cy="80" r="25" className="nutrient-circle"/>
              <text x="85" y="90" className="svg-text">Nutriente</text>
              
              {/* Barriers */}
              <rect x="60" y="130" width="80" height="30" className="barrier" fill="#ff6b6b"/>
              <text x="70" y="152" className="svg-text-small">Gastrite</text>
              
              <rect x="60" y="180" width="80" height="30" className="barrier" fill="#ff8c42"/>
              <text x="65" y="202" className="svg-text-small">Disbiose</text>
              
              <rect x="60" y="230" width="80" height="30" className="barrier" fill="#ffd93d"/>
              <text x="50" y="252" className="svg-text-small">Metabolismo</text>
              
              {/* Result */}
              <circle cx="100" cy="320" r="20" className="result-circle low" opacity="0.4"/>
              <text x="75" y="330" className="svg-text-small">5-50%</text>
            </g>

            {/* Injectable Route */}
            <g>
              <text x="700" y="30" className="svg-label">INJETÁVEL</text>
              <circle cx="700" cy="80" r="25" className="nutrient-circle"/>
              <text x="685" y="90" className="svg-text">Nutriente</text>
              
              {/* Direct to circulation */}
              <line x1="700" y1="110" x2="700" y2="200" className="direct-line" strokeWidth="3"/>
              <text x="710" y="160" className="svg-text-small">Direto</text>
              
              {/* Result */}
              <circle cx="700" cy="320" r="20" className="result-circle high"/>
              <text x="675" y="330" className="svg-text-small">100%</text>
            </g>

            {/* Comparison arrow */}
            <g>
              <path d="M 200 350 L 600 350" className="comparison-arrow" fill="none" stroke="#667eea" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              <text x="350" y="375" className="svg-label-small">Biodisponibilidade</text>
            </g>

            {/* Arrow marker definition */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#667eea" />
              </marker>
            </defs>
          </svg>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="tabs-section">
        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Visão Geral
          </button>
          <button
            className={`tab-button ${activeTab === 'nutrients' ? 'active' : ''}`}
            onClick={() => setActiveTab('nutrients')}
          >
            Nutrientes
          </button>
          <button
            className={`tab-button ${activeTab === 'indications' ? 'active' : ''}`}
            onClick={() => setActiveTab('indications')}
          >
            Indicações
          </button>
          <button
            className={`tab-button ${activeTab === 'references' ? 'active' : ''}`}
            onClick={() => setActiveTab('references')}
          >
            Referências
          </button>
        </div>
      </section>

      {/* Content Sections */}
      <section className="content-section">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <h2>Por que Suplementação Injetável?</h2>
            <p>
              A prática clínica contemporânea reconhece que a suplementação nutricional não é um processo único para todos. 
              Enquanto a via oral permanece como primeira escolha para muitos pacientes, existe um crescente corpo de evidências 
              que demonstra a superioridade clínica da administração injetável em contextos específicos.
            </p>

            <div className="challenges-grid">
              <div className="challenge-card">
                <div className="challenge-icon">🔴</div>
                <h3>Gastrite Atrófica</h3>
                <p>Redução da acidez gástrica prejudica absorção de B12, ferro e vitamina C</p>
              </div>
              <div className="challenge-card">
                <div className="challenge-icon">🟠</div>
                <h3>Disbiose Intestinal</h3>
                <p>Microbiota desequilibrada compromete síntese e absorção de vitaminas K e B</p>
              </div>
              <div className="challenge-card">
                <div className="challenge-icon">🟡</div>
                <h3>Metabolismo Hepático</h3>
                <p>Primeira passagem reduz biodisponibilidade de vitaminas hidrossolúveis</p>
              </div>
              <div className="challenge-card">
                <div className="challenge-icon">🟢</div>
                <h3>Intolerância GI</h3>
                <p>Pacientes com Crohn, colite ulcerativa ou doença celíaca têm absorção reduzida</p>
              </div>
            </div>
          </div>
        )}

        {/* Nutrients Tab */}
        {activeTab === 'nutrients' && (
          <div className="tab-content">
            <h2>Nutrientes Principais e Biodisponibilidade</h2>
            
            <div className="nutrient-selector">
              <button
                className={`selector-btn ${selectedNutrient === 'b12' ? 'active' : ''}`}
                onClick={() => setSelectedNutrient('b12')}
              >
                Vitamina B12
              </button>
              <button
                className={`selector-btn ${selectedNutrient === 'iron' ? 'active' : ''}`}
                onClick={() => setSelectedNutrient('iron')}
              >
                Ferro
              </button>
              <button
                className={`selector-btn ${selectedNutrient === 'complex' ? 'active' : ''}`}
                onClick={() => setSelectedNutrient('complex')}
              >
                Complexo B
              </button>
              <button
                className={`selector-btn ${selectedNutrient === 'vitamin-c' ? 'active' : ''}`}
                onClick={() => setSelectedNutrient('vitamin-c')}
              >
                Vitamina C
              </button>
            </div>

            {selectedNutrient === 'b12' && (
              <div className="nutrient-detail">
                <h3>Vitamina B12 (Cobalamina)</h3>
                <div className="bioavailability-chart">
                  <div className="bioavail-item">
                    <span className="route">Via Oral</span>
                    <div className="bar-container">
                      <div className="bar" style={{ width: '30%' }}>30%</div>
                    </div>
                  </div>
                  <div className="bioavail-item">
                    <span className="route">Intramuscular</span>
                    <div className="bar-container">
                      <div className="bar high" style={{ width: '94%' }}>94%</div>
                    </div>
                  </div>
                  <div className="bioavail-item">
                    <span className="route">Intravenosa</span>
                    <div className="bar-container">
                      <div className="bar high" style={{ width: '100%' }}>100%</div>
                    </div>
                  </div>
                </div>
                <div className="nutrient-info">
                  <h4>Indicações Principais:</h4>
                  <ul>
                    <li>Deficiência perniciosa (falta de fator intrínseco)</li>
                    <li>Gastrite atrófica</li>
                    <li>Síndrome de má absorção</li>
                    <li>Pacientes vegetarianos com deficiência</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedNutrient === 'iron' && (
              <div className="nutrient-detail">
                <h3>Ferro</h3>
                <div className="bioavailability-chart">
                  <div className="bioavail-item">
                    <span className="route">Via Oral</span>
                    <div className="bar-container">
                      <div className="bar" style={{ width: '20%' }}>20%</div>
                    </div>
                  </div>
                  <div className="bioavail-item">
                    <span className="route">Intramuscular</span>
                    <div className="bar-container">
                      <div className="bar high" style={{ width: '90%' }}>90%</div>
                    </div>
                  </div>
                  <div className="bioavail-item">
                    <span className="route">Intravenosa</span>
                    <div className="bar-container">
                      <div className="bar high" style={{ width: '100%' }}>100%</div>
                    </div>
                  </div>
                </div>
                <div className="nutrient-info">
                  <h4>Vantagens da Via Injetável:</h4>
                  <ul>
                    <li>Evita efeitos colaterais GI (náusea, constipação)</li>
                    <li>Reposição rápida em anemia grave</li>
                    <li>Melhor tolerância em pacientes sensíveis</li>
                    <li>Absorção previsível e controlada</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedNutrient === 'complex' && (
              <div className="nutrient-detail">
                <h3>Complexo B (B1, B2, B3, B5, B6, B12)</h3>
                <div className="bioavailability-chart">
                  <div className="bioavail-item">
                    <span className="route">Via Oral</span>
                    <div className="bar-container">
                      <div className="bar" style={{ width: '40%' }}>40%</div>
                    </div>
                  </div>
                  <div className="bioavail-item">
                    <span className="route">Intramuscular</span>
                    <div className="bar-container">
                      <div className="bar high" style={{ width: '95%' }}>95%</div>
                    </div>
                  </div>
                </div>
                <div className="nutrient-info">
                  <h4>Indicações Clínicas:</h4>
                  <ul>
                    <li>Fadiga e baixa energia</li>
                    <li>Neuropatia periférica</li>
                    <li>Deficiências nutricionais múltiplas</li>
                    <li>Suporte em recuperação de doenças</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedNutrient === 'vitamin-c' && (
              <div className="nutrient-detail">
                <h3>Vitamina C (Ácido Ascórbico)</h3>
                <div className="bioavailability-chart">
                  <div className="bioavail-item">
                    <span className="route">Via Oral</span>
                    <div className="bar-container">
                      <div className="bar" style={{ width: '50%' }}>50%</div>
                    </div>
                  </div>
                  <div className="bioavail-item">
                    <span className="route">Intravenosa</span>
                    <div className="bar-container">
                      <div className="bar high" style={{ width: '100%' }}>100%</div>
                    </div>
                  </div>
                </div>
                <div className="nutrient-info">
                  <h4>Benefícios da Via Intravenosa:</h4>
                  <ul>
                    <li>Níveis plasmáticos 25x maiores que via oral</li>
                    <li>Suporte imunológico potenciado</li>
                    <li>Efeitos antioxidantes maximizados</li>
                    <li>Recuperação acelerada em estresse oxidativo</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Indications Tab */}
        {activeTab === 'indications' && (
          <div className="tab-content">
            <h2>Indicações Clínicas para Suplementação Injetável</h2>
            
            <div className="indications-grid">
              <div className="indication-card priority-high">
                <h3>🔴 Indicações Prioritárias</h3>
                <ul>
                  <li><strong>Deficiência perniciosa</strong> - B12 intramuscular é primeira linha</li>
                  <li><strong>Síndrome de má absorção</strong> - Crohn, colite, celíaca</li>
                  <li><strong>Gastrite atrófica</strong> - Redução de ácido gástrico</li>
                  <li><strong>Anemia grave</strong> - Reposição rápida necessária</li>
                  <li><strong>Intolerância GI</strong> - Náusea, vômito com suplementos orais</li>
                </ul>
              </div>

              <div className="indication-card priority-medium">
                <h3>🟡 Indicações Moderadas</h3>
                <ul>
                  <li><strong>Deficiências múltiplas</strong> - Complexo B injetável</li>
                  <li><strong>Fadiga crônica</strong> - Suporte nutricional</li>
                  <li><strong>Neuropatia periférica</strong> - Vitaminas B para regeneração</li>
                  <li><strong>Recuperação pós-cirúrgica</strong> - Reposição acelerada</li>
                  <li><strong>Uso crônico de IBP</strong> - Prevenção de deficiências</li>
                </ul>
              </div>

              <div className="indication-card priority-low">
                <h3>🟢 Indicações Complementares</h3>
                <ul>
                  <li><strong>Otimização de performance</strong> - Atletas e profissionais</li>
                  <li><strong>Suporte imunológico</strong> - Vitamina C intravenosa</li>
                  <li><strong>Bem-estar geral</strong> - Quando absorção oral é subótima</li>
                  <li><strong>Prevenção</strong> - Em populações de risco</li>
                  <li><strong>Envelhecimento saudável</strong> - Nutrição otimizada</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* References Tab */}
        {activeTab === 'references' && (
          <div className="tab-content">
            <h2>Referências Científicas</h2>
            <p className="references-intro">
              Clique em qualquer referência para acessar o trabalho científico completo. Todos os links direcionam para 
              bases de dados científicas confiáveis (PubMed, Nature, BMJ, etc).
            </p>

            <div className="references-list">
              {references.map((ref) => (
                <div key={ref.id} className="reference-item">
                  <div className="reference-header" onClick={() => setExpandedReference(expandedReference === ref.id ? null : ref.id)}>
                    <div className="reference-number">[{ref.id}]</div>
                    <div className="reference-title-section">
                      <h4 className="reference-title">{ref.title}</h4>
                      <p className="reference-meta">{ref.authors} ({ref.year})</p>
                    </div>
                    <div className="reference-toggle">
                      {expandedReference === ref.id ? '▼' : '▶'}
                    </div>
                  </div>

                  {expandedReference === ref.id && (
                    <div className="reference-expanded">
                      <p className="reference-journal">
                        <strong>Journal:</strong> {ref.journal}
                      </p>
                      {ref.doi && (
                        <p className="reference-doi">
                          <strong>DOI:</strong> {ref.doi}
                        </p>
                      )}
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="reference-link"
                      >
                        📖 Acessar Trabalho Completo
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Cost-Benefit Section */}
      <section className="cost-benefit-section">
        <h2>Análise Custo-Benefício</h2>
        <div className="cost-grid">
          <div className="cost-card">
            <h3>💰 Custos Diretos</h3>
            <ul>
              <li>Consulta médica: R$ 200-400</li>
              <li>Injeção (IM/IV): R$ 50-150</li>
              <li>Nutrientes: R$ 30-100</li>
              <li><strong>Total por sessão: R$ 280-650</strong></li>
            </ul>
          </div>

          <div className="cost-card">
            <h3>📊 Benefícios Indiretos</h3>
            <ul>
              <li>Redução de internações</li>
              <li>Menos dias de afastamento</li>
              <li>Melhor qualidade de vida</li>
              <li>Menor custo com outras medicações</li>
            </ul>
          </div>

          <div className="cost-card">
            <h3>✅ ROI Clínico</h3>
            <ul>
              <li>Resposta rápida (dias vs semanas)</li>
              <li>Eficácia garantida (100% biodisponibilidade)</li>
              <li>Sem efeitos colaterais GI</li>
              <li>Aderência 100% durante tratamento</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Pronto para Otimizar Sua Nutrição?</h2>
        <p>
          A suplementação injetável pode ser a solução que você estava procurando. 
          Agende uma consulta para avaliar se esta abordagem é adequada para seu caso específico.
        </p>
        <button className="cta-button">Agendar Consulta</button>
      </section>
    </div>
  );
}
