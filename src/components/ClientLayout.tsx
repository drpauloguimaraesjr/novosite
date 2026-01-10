"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Magnetic from "@/components/Magnetic";
import Preloader from "@/components/Preloader";
import LiveClock from "@/components/LiveClock";
import PageTransition from "@/components/PageTransition";
import GSAPConfig from "@/components/GSAPConfig";
import SplitText from "@/components/SplitText";
import { useContent } from "@/hooks/useContent";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const siteData = useContent();
  
  console.log('[ClientLayout] Component rendered, pathname:', pathname, 'isAdmin:', isAdmin);
  console.log('[ClientLayout] Site data loaded:', !!siteData, 'navigation links:', siteData?.navigation?.links?.length || 0);

  return (
    <>
      <GSAPConfig />
      <div className="noise-overlay" />
      
      {!isAdmin && (
        <>
          <Preloader />
          <CustomCursor />
          <div className="ambient-frame" />
          <div className="grid-overlay">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="grid-line" />
            ))}
          </div>
          
          <header className="nav-container">
            <Magnetic>
              <div className="sub-label logo-label" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "15px", whiteSpace: "nowrap" }}>
                <span style={{ fontWeight: 800 }}>{siteData.navigation?.leftLabel}</span>
                <span style={{ opacity: 0.6, fontSize: "0.7rem", fontWeight: 400 }}><LiveClock /></span>
              </div>
            </Magnetic>
            <nav className="nav-links-wrapper">
              {/* Regular links */}
              <div className="nav-links">
                {siteData.navigation?.links
                  .filter((link: any) => !link.highlight)
                  .map((link: any, i: number) => (
                    <Magnetic key={`std-${i}`}>
                      <a 
                        href={link.url} 
                        className="nav-link"
                        data-cursor-text="VIEW"
                      >
                        <SplitText text={link.label} interactive={true} />
                      </a>
                    </Magnetic>
                  ))}
              </div>

              {/* Highlighted links (stacked) */}
              <div className="nav-highlight-group">
                {siteData.navigation?.links
                  .filter((link: any) => link.highlight)
                  .map((link: any, i: number) => (
                    <Magnetic key={`hl-${i}`}>
                      <a 
                        href={link.url} 
                        className="nav-link nav-link-highlight"
                        data-cursor-text="VIEW"
                      >
                        <SplitText text={link.label} interactive={true} />
                      </a>
                    </Magnetic>
                  ))}
              </div>
            </nav>
          </header>
        </>
      )}

      {isAdmin ? (
        <main>{children}</main>
      ) : (
        <SmoothScroll>
          <PageTransition>
            <main>{children}</main>
          </PageTransition>
        </SmoothScroll>
      )}
    </>
  );
}
