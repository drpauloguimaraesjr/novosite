"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hook for creating immersive scroll animations similar to Lenis demo site
 */
export function useScrollAnimations(containerRef: React.RefObject<HTMLElement | null>) {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!containerRef.current || hasInitialized.current) return;
    hasInitialized.current = true;

    const ctx = gsap.context(() => {
      // ========================================
      // 1. HERO PARALLAX - Background moves slower
      // ========================================
      gsap.to(".hero-bg-container", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: ".project-detail-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Hero title zoom out effect
      gsap.to(".case-study-title", {
        scale: 0.9,
        opacity: 0.7,
        ease: "none",
        scrollTrigger: {
          trigger: ".project-detail-hero",
          start: "top top",
          end: "50% top",
          scrub: 1,
        },
      });

      // ========================================
      // 2. CONTENT BLOCKS - Reveal with depth
      // ========================================
      gsap.utils.toArray(".project-content-block").forEach((block: any) => {
        // Title slide up with mask effect
        const title = block.querySelector("h2");
        if (title) {
          gsap.fromTo(
            title,
            { y: 80, opacity: 0, rotateX: 15 },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: block,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Paragraphs stagger reveal
        const paragraphs = block.querySelectorAll("p");
        gsap.fromTo(
          paragraphs,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: block,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // List items cascade
        const listItems = block.querySelectorAll(".project-list-item");
        gsap.fromTo(
          listItems,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: block,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // ========================================
      // 3. HIGHLIGHT BLOCKS - Float with parallax
      // ========================================
      gsap.utils.toArray(".project-highlight-block").forEach((block: any) => {
        // Slight parallax float
        gsap.fromTo(
          block,
          { y: 60, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: block,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Continuous subtle float while in view
        gsap.to(block, {
          y: -20,
          ease: "none",
          scrollTrigger: {
            trigger: block,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      });

      // ========================================
      // 4. STATS - CountUp animation
      // ========================================
      gsap.utils.toArray(".project-stat-item").forEach((item: any) => {
        const valueEl = item.querySelector(".stat-value");
        if (!valueEl) return;

        const text = valueEl.textContent || "";
        const numericMatch = text.match(/[\d.]+/);
        
        if (numericMatch) {
          const targetNum = parseFloat(numericMatch[0]);
          const prefix = text.replace(/[\d.]+.*/, "");
          const suffix = text.replace(/.*[\d.]+/, "");

          gsap.fromTo(
            item,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                onEnter: () => {
                  // CountUp effect
                  gsap.fromTo(
                    { val: 0 },
                    { val: targetNum },
                    {
                      duration: 1.5,
                      ease: "power2.out",
                      onUpdate: function () {
                        const current = this.targets()[0].val;
                        valueEl.textContent = prefix + (Number.isInteger(targetNum) 
                          ? Math.round(current) 
                          : current.toFixed(1)) + suffix;
                      },
                    }
                  );
                },
              },
            }
          );
        }
      });

      // ========================================
      // 5. TABLES - Row cascade
      // ========================================
      gsap.utils.toArray(".project-table-container").forEach((table: any) => {
        gsap.fromTo(
          table,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: table,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        const rows = table.querySelectorAll("tbody tr");
        gsap.fromTo(
          rows,
          { x: -20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: table,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // ========================================
      // 6. CASE STUDY CARDS - 3D tilt on scroll
      // ========================================
      gsap.utils.toArray(".project-case-card").forEach((card: any, i: number) => {
        // Entrance animation
        gsap.fromTo(
          card,
          { y: 80, opacity: 0, rotateY: i % 2 === 0 ? -5 : 5 },
          {
            y: 0,
            opacity: 1,
            rotateY: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Parallax depth while scrolling
        gsap.to(card, {
          y: i % 2 === 0 ? -30 : -15,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });

      // ========================================
      // 7. REFERENCES - Fade cascade
      // ========================================
      gsap.utils.toArray(".project-reference-item").forEach((item: any, i: number) => {
        gsap.fromTo(
          item,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 0.45, // Match the default opacity
            delay: i * 0.05,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, [containerRef]);
}
