export default function Home() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 24px",
        textAlign: "center",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(2rem, 6vw, 4.5rem)",
          fontWeight: 300,
          letterSpacing: "0.12em",
          lineHeight: 1.15,
          margin: 0,
        }}
      >
        DR. PAULO
        <br />
        GUIMARÃES JR.
      </h1>

      <div
        style={{
          marginTop: "clamp(48px, 9vh, 96px)",
          fontSize: "clamp(0.7rem, 1.1vw, 0.8rem)",
          letterSpacing: "0.3em",
          opacity: 0.55,
          textTransform: "uppercase",
        }}
      >
        Para marcar sua consulta
      </div>

      <a
        href="https://wa.me/5547992547770"
        style={{
          marginTop: "20px",
          fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
          fontWeight: 400,
          color: "#fff",
          textDecoration: "none",
          letterSpacing: "0.05em",
          borderBottom: "1px solid rgba(255,255,255,0.25)",
          paddingBottom: "6px",
        }}
      >
        (47) 99254 7770
      </a>
    </div>
  );
}
