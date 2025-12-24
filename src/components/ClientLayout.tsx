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
              <div className="sub-label" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                {siteData.navigation?.leftLabel} <LiveClock />
              </div>
            </Magnetic>
            <nav className="nav-links">
              {siteData.navigation?.links.map((link: any, i: number) => (
                <Magnetic key={i}>
                  <a 
                    href={link.url} 
                    className={`nav-link ${link.highlight ? 'nav-link-highlight' : ''}`}
                    data-cursor-text="VIEW"
                  >
                    <SplitText text={link.label} interactive={true} />
                  </a>
                </Magnetic>
              ))}
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
