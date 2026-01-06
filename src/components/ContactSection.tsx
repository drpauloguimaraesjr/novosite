"use client";

import Magnetic from "./Magnetic";
import LiveClock from "./LiveClock";
import { useContent } from "@/hooks/useContent";

export default function ContactSection() {
  const siteData = useContent();
  const contact = siteData.contact;

  return (
    <section className="contact-section">
      <div className="sub-label" style={{ opacity: 0.5, marginBottom: "4rem" }}>
        [ {contact.label} ]
      </div>
      
      <h2 className="contact-title" style={{ whiteSpace: "pre-line" }}>
        {contact.title}
      </h2>

      <div className="contact-button-wrapper">
        <Magnetic>
          <button className="contact-button-bar">
            <div className="bar-line" />
            <span className="bar-label">{contact.button}</span>
          </button>
        </Magnetic>
      </div>

      <div className="footer-info-grid">
        <div className="footer-column">
          <span className="sub-label">[ SOCIAL ]</span>
          <div style={{ marginTop: "2rem" }}>
            {contact.socials.map((social) => (
              <Magnetic key={social.name}>
                <a href={social.url} className="footer-social-link" style={{ display: "block" }}>
                  {social.name}
                </a>
              </Magnetic>
            ))}
          </div>
        </div>

        <div className="footer-column">
          <span className="sub-label">[ LOCATION ]</span>
          <div style={{ marginTop: "2rem" }}>
            <p style={{ opacity: 0.6 }}>{contact.address.city}</p>
            <p style={{ opacity: 0.6, marginTop: "0.5rem" }}>{contact.address.street}</p>
            
            <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
              <Magnetic>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Rua+Blumenau,+797+Joinville" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    fontSize: "0.7rem", 
                    padding: "8px 16px", 
                    border: "1px solid rgba(100,100,100,0.2)", 
                    borderRadius: "4px", 
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: "5px",
                    color: "inherit",
                    textDecoration: "none"
                  }}
                >
                  MAPS ↗
                </a>
              </Magnetic>
              <Magnetic>
                <a 
                  href="https://waze.com/ul?q=Rua+Blumenau,797,Joinville" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    fontSize: "0.7rem", 
                    padding: "8px 16px", 
                    border: "1px solid rgba(100,100,100,0.2)", 
                    borderRadius: "4px", 
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: "5px",
                    color: "inherit",
                    textDecoration: "none"
                  }}
                >
                  WAZE ↗
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        <div className="footer-column">
          <span className="sub-label">[ TIME ]</span>
          <div style={{ marginTop: "2rem" }}>
            <p style={{ opacity: 0.6 }}>LOCAL HOUR</p>
            <p style={{ fontSize: "1.25rem", marginTop: "0.5rem" }}><LiveClock /></p>
          </div>
        </div>

        <div className="footer-column">
          <span className="sub-label">[ SAY HELLO ]</span>
          <div style={{ marginTop: "2rem" }}>
            <Magnetic>
              <a href={`mailto:${contact.email}`} className="footer-social-link" style={{ display: "block" }}>{contact.email}</a>
            </Magnetic>
            <p style={{ opacity: 0.6, marginTop: "0.5rem" }}>{contact.phone}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
