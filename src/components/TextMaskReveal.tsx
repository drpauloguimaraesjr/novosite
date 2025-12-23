"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function TextMaskReveal({ phrase }: { phrase: string[] }) {
  const container = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      ".mask-text-line span",
      { y: "100%" },
      { y: "0%", duration: 1, stagger: 0.1, ease: "power4.out" }
    );
  }, []);

  return (
    <div ref={container} className="mask-reveal-wrapper">
      {phrase.map((line, index) => (
        <div key={index} className="mask-text-line" style={{ overflow: "hidden" }}>
          <span style={{ display: "block" }}>{line}</span>
        </div>
      ))}
    </div>
  );
}
