"use client";

import { useState, useEffect } from "react";
import siteData from "@/data/content.json";
import styles from "./admin.module.css";
import { getSiteContent } from "@/lib/siteService";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";

interface ContentData {
  hero: any;
  navigation: {
    leftLabel: string;
    links: { label: string; url: string; highlight?: boolean }[];
  };
  about: any;
  projects: any[];
  visualArchive: any[];
  playground: any[];
  socialReels: any[];
  contact: any;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  
  const [data, setData] = useState<ContentData>(siteData as any);
  const [activeTab, setActiveTab] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      async function load() {
        const fresh = await getSiteContent();
        if (fresh) setData(fresh as any);
      }
      load();
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setAuthError("CREDENCIAIS INVÁLIDAS. TENTE NOVAMENTE.");
    }
    setLoading(false);
  };

  const handleLogout = () => signOut(auth);

  const handleChange = (section: string, field: string, value: any, index?: number, subfield?: string) => {
    const newData = { ...data };
    if (index !== undefined) {
      if (subfield) {
        // @ts-ignore
        newData[section][index][field][subfield] = value;
      } else {
        // @ts-ignore
        newData[section][index][field] = value;
      }
    } else {
      if (subfield) {
        // @ts-ignore
        newData[section][field][subfield] = value;
      } else {
        // @ts-ignore
        newData[section][field] = value;
      }
    }
    setData(newData);
  };

  const addItem = (section: string) => {
    const newData = { ...data };
    
    if (section === "navigation") {
      newData.navigation.links.push({ label: "Novo Link", url: "#", highlight: false });
    } else if (section === "visualArchive") {
      const newItem = {
        id: (newData.visualArchive.length + 1),
        title: "Novo Item",
        cat: "Geral",
        img: "/images/clinic/0Y7A0247.jpg",
        settings: { speed: 1.1, position: "center" }
      };
      newData.visualArchive.push(newItem);
    } else if (section === "projects") {
      const newItem = {
        id: String(newData.projects.length + 1).padStart(2, '0'),
        title: "Novo Serviço",
        category: "Medicina",
        image: "/images/clinic/0Y7A0247.jpg",
        settings: { parallaxSpeed: 1.1, objectPosition: "center", animation: "slide" }
      };
      newData.projects.push(newItem);
    } else if (section === "socialReels") {
      const newItem = {
        url: "",
        thumbnail: "/images/clinic/0Y7A0247.jpg",
        caption: "Legenda do Reel"
      };
      newData.socialReels.push(newItem);
    }
    
    setData(newData);
  };

  const removeItem = (section: string, index: number) => {
    const newData = { ...data };
    // @ts-ignore
    newData[section].splice(index, 1);
    setData(newData);
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/update-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error("Save failed", error);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className={styles.adminContainer} style={{ justifyContent: "center", alignItems: "center" }}>[ LOADING AUTH... ]</div>;
  }

  if (!user) {
    return (
      <div className={styles.adminContainer} style={{ justifyContent: "center", alignItems: "center" }}>
        <form onSubmit={handleLogin} className={styles.card} style={{ width: "100%", maxWidth: "400px" }}>
          <h2 style={{ fontSize: "0.8rem", letterSpacing: "0.3em", marginBottom: "3rem", textAlign: "center" }}>ES_ADMIN LOGIN</h2>
          {authError && <p style={{ color: "red", fontSize: "0.7rem", marginBottom: "1rem" }}>{authError}</p>}
          <div className={styles.formGroup}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label>Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className={styles.saveButton}>ACESSAR PAINEL</button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      {showToast && <div className={styles.toast}>CONTEÚDO SALVO COM SUCESSO!</div>}
      
      <div className={styles.sidebar}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2>ES_ADMIN</h2>
          <button onClick={handleLogout} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "0.6rem", cursor: "pointer" }}>[ LOGOUT ]</button>
        </div>
        <div className={styles.nav}>
          {["hero", "navigation", "about", "projects", "visualArchive", "socialReels", "contact"].map((tab) => (
            <button
              key={tab}
              className={`${styles.navLink} ${activeTab === tab ? styles.navLinkActive : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
        <button className={styles.saveButton} onClick={saveContent} disabled={saving}>
          {saving ? "SAVING..." : "SAVE SITE"}
        </button>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h3>{activeTab.toUpperCase()} SETTINGS</h3>
            {["projects", "visualArchive", "navigation", "socialReels"].includes(activeTab) && (
              <button 
                className={styles.saveButton} 
                style={{ width: "auto", padding: "10px 20px", fontSize: "0.8rem" }}
                onClick={() => addItem(activeTab)}
              >
                + ADD ITEM
              </button>
            )}
          </div>

          {activeTab === "navigation" && (
            <div className={styles.sectionGrid}>
              <div className={styles.formGroup}>
                <label>Left Corner Label</label>
                <input value={data.navigation.leftLabel} onChange={(e) => handleChange("navigation", "leftLabel", e.target.value)} />
              </div>
              <div className={styles.itemsList} style={{ marginTop: "2rem" }}>
                <label>Fixed Navigation Links</label>
                {data.navigation.links.map((link, i) => (
                  <div key={i} className={styles.itemCard}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <h4>Link {i + 1}</h4>
                      <button onClick={() => removeItem("navigation", i)} style={{ color: "#ff4444" }}>[ REMOVE ]</button>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Label</label>
                        <input value={link.label} onChange={(e) => handleChange("navigation", "links", e.target.value, i, "label")} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>URL</label>
                        <input value={link.url} onChange={(e) => handleChange("navigation", "links", e.target.value, i, "url")} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Highlight (Button Style)</label>
                        <select 
                          value={link.highlight ? "yes" : "no"} 
                          onChange={(e) => handleChange("navigation", "links", e.target.value === "yes", i, "highlight")}
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "socialReels" && (
            <div className={styles.itemsList}>
              {data.socialReels.map((reel, i) => (
                <div key={i} className={styles.itemCard}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h4>Reel {i + 1}</h4>
                    <button onClick={() => removeItem("socialReels", i)} style={{ color: "#ff4444" }}>[ REMOVE ]</button>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Instagram URL</label>
                      <input value={reel.url} onChange={(e) => handleChange("socialReels", "url", e.target.value, i)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Thumbnail Path</label>
                      <input value={reel.thumbnail} onChange={(e) => handleChange("socialReels", "thumbnail", e.target.value, i)} />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Caption</label>
                    <input value={reel.caption} onChange={(e) => handleChange("socialReels", "caption", e.target.value, i)} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "hero" && (
            <div className={styles.sectionGrid}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <textarea 
                  value={data.hero.title} 
                  onChange={(e) => handleChange("hero", "title", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Parallax Speed</label>
                <input 
                  type="number" step="0.1"
                  value={data.hero.settings.parallaxSpeed} 
                  onChange={(e) => handleChange("hero", "settings", parseFloat(e.target.value), undefined, "parallaxSpeed")}
                />
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className={styles.sectionGrid}>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea 
                  value={data.about.description} 
                  onChange={(e) => handleChange("about", "description", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Scroll Lag (0.1 = high lag)</label>
                <input 
                  type="number" step="0.05"
                  value={data.about.settings.lag} 
                  onChange={(e) => handleChange("about", "settings", parseFloat(e.target.value), undefined, "lag")}
                />
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className={styles.itemsList}>
              {data.projects.map((item, i) => (
                <div key={i} className={styles.itemCard}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h4>{item.title || `Item ${i + 1}`}</h4>
                    <button onClick={() => removeItem("projects", i)} style={{ color: "#ff4444" }}>[ REMOVE ]</button>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Image Path</label>
                      <input value={item.image} onChange={(e) => handleChange("projects", "image", e.target.value, i)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Foco</label>
                      <select value={item.settings.objectPosition} onChange={(e) => handleChange("projects", "settings", e.target.value, i, "objectPosition")}>
                        <option value="center">Center</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Speed</label>
                      <input type="number" step="0.1" value={item.settings.parallaxSpeed} onChange={(e) => handleChange("projects", "settings", parseFloat(e.target.value), i, "parallaxSpeed")} />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Title</label>
                    <input value={item.title} onChange={(e) => handleChange("projects", "title", e.target.value, i)} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "visualArchive" && (
            <div className={styles.itemsList}>
              {data.visualArchive.map((item, i) => (
                <div key={i} className={styles.itemCard}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h4>{item.title}</h4>
                    <button onClick={() => removeItem("visualArchive", i)} style={{ color: "#ff4444" }}>[ REMOVE ]</button>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Img Path</label>
                      <input value={item.img} onChange={(e) => handleChange("visualArchive", "img", e.target.value, i)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Speed</label>
                      <input type="number" step="0.1" value={item.settings.speed} onChange={(e) => handleChange("visualArchive", "settings", parseFloat(e.target.value), i, "speed")} />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Title</label>
                      <input value={item.title} onChange={(e) => handleChange("visualArchive", "title", e.target.value, i)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Category</label>
                      <input value={item.cat} onChange={(e) => handleChange("visualArchive", "cat", e.target.value, i)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "contact" && (
            <div className={styles.sectionGrid}>
              <div className={styles.formGroup}>
                <label>Phone</label>
                <input value={data.contact.phone} onChange={(e) => handleChange("contact", "phone", e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input value={data.contact.email} onChange={(e) => handleChange("contact", "email", e.target.value)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
