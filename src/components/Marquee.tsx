"use client";

export default function Marquee() {
  const text = "NEXT GENERATION DIGITAL EXPERIENCES";

  return (
    <div className="marquee-wrapper">
      <div className="marquee-content">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="marquee-item">
            {text} <span>/</span>
          </div>
        ))}
      </div>
    </div>
  );
}
