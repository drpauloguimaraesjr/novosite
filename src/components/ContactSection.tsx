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
              <a key={social.name} href={social.url} className="footer-social-link">
                {social.name}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-column">
          <span className="sub-label">[ LOCATION ]</span>
          <div style={{ marginTop: "2rem" }}>
            <p style={{ opacity: 0.6 }}>{contact.address.city}</p>
            <p style={{ opacity: 0.6, marginTop: "0.5rem" }}>{contact.address.street}</p>
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
            <a href={`mailto:${contact.email}`} className="footer-social-link">{contact.email}</a>
            <p style={{ opacity: 0.6, marginTop: "0.5rem" }}>{contact.phone}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
