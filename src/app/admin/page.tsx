"use client";

import { useState, useEffect, useCallback } from "react";
import siteData from "@/data/content.json";
import styles from "./admin.module.css";
import { auth, storage } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getSiteContent } from "@/lib/siteService";
import { Reorder, motion, AnimatePresence } from "framer-motion";

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
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleUpload = async (section: string, index: number, field: string, file: File) => {
    const uploadKey = `${section}-${index}-${field}`;
    setUploading(uploadKey);
    try {
      const storageRef = ref(storage, `site-images/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      handleChange(section, field, url, index);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Falha no upload da imagem.");
    }
    setUploading(null);
  };

  // Image compression utility
  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        // Max dimensions for "Grand" quality but web-optimized
        const MAX_WIDTH = 2500;
        const MAX_HEIGHT = 2000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Compression failed"));
          },
          "image/jpeg",
          0.85 // High quality, but compressed
        );
      };
      img.onerror = (err) => reject(err);
    });
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: string = "Geral") => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    
    setUploading("bulk");
    setUploadProgress(0);
    
    // Process in batches of 3 to avoid overwhelming connections
    const BATCH_SIZE = 3;
    const newData = { ...data };
    let completedCount = 0;

    // Helper to process a single file
    const processFile = async (file: File) => {
      try {
        // 1. Optimize
        const compressedBlob = await compressImage(file);
        
        // 2. Upload
        const storageRef = ref(storage, `site-images/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`);
        await uploadBytes(storageRef, compressedBlob);
        const url = await getDownloadURL(storageRef);
        
        // 3. Create Item
        const newItem = {
          id: Date.now() + Math.random(),
          title: file.name.split('.')[0],
          cat: category,
          img: url,
          settings: { speed: 1.1, position: "center", size: "medium" },
          description: ""
        };
        
        return newItem;
      } catch (err) {
        console.error(`Failed to process ${file.name}:`, err);
        return null;
      } finally {
        completedCount++;
        setUploadProgress(Math.round((completedCount / files.length) * 100));
      }
    };

    // Execute batches
    const newItems: any[] = [];
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(batch.map(processFile));
      results.forEach(item => {
        if (item) newItems.push(item);
      });
    }

    // Add successfully uploaded items to new Data
    // We append them to the START of the list or END? Usually end.
    newData.visualArchive = [...newData.visualArchive, ...newItems];

    setData(newData);
    setUploading(null);
    setUploadProgress(0);
    
    // Auto-save after bulk upload to prevent data loss
    if (newItems.length > 0) {
      saveContent();
    }
  };

  const setReorderedItems = (section: string, newItems: any[]) => {
    const newData = { ...data, [section]: newItems };
    setData(newData);
  };

  const handleChange = (section: string, field: string, value: any, index?: number, subfield?: string) => {
    const newData = { ...data };
    if (index !== undefined) {
      const sectionData = [...(newData[section as keyof ContentData] as any[])];
      if (subfield) {
        sectionData[index][field][subfield] = value;
      } else {
        sectionData[index][field] = value;
      }
      (newData[section as keyof ContentData] as any[]) = sectionData;
    } else {
      if (subfield) {
        (newData[section as keyof ContentData] as any)[field][subfield] = value;
      } else {
        (newData[section as keyof ContentData] as any)[field] = value;
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
        settings: { speed: 1.1, position: "center", size: "medium" }
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
            <h3>{activeTab.toUpperCase()} SETTINGS</h3>
            {["projects", "visualArchive", "navigation", "socialReels"].includes(activeTab) && (
              <button 
                className={styles.saveButton} 
                style={{ width: "auto", padding: "10px 20px", fontSize: "0.6rem" }}
                onClick={() => addItem(activeTab)}
              >
                + ADD
              </button>
            )}
          </div>

          {activeTab === "hero" && (
            <div className={styles.sectionGrid}>
              <div className={styles.formGroup}>
                <label>Sublabel</label>
                <input value={data.hero.sublabel} onChange={(e) => handleChange("hero", "sublabel", e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Title (use \n for line break)</label>
                <textarea 
                  value={data.hero.title} 
                  onChange={(e) => handleChange("hero", "title", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea 
                  value={data.hero.description} 
                  onChange={(e) => handleChange("hero", "description", e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className={styles.itemsList}>
              <Reorder.Group axis="y" values={data.projects} onReorder={(newItems) => setReorderedItems("projects", newItems)}>
                {data.projects.map((item, i) => (
                  <Reorder.Item key={item.id} value={item} className={styles.itemRef}>
                    <div className={styles.itemCard} style={{ cursor: "grab" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <div style={{ background: "#333", padding: "4px 8px", borderRadius: "4px", fontSize: "0.6rem" }}>⠿ DRAG TO REORDER</div>
                          <h4 style={{ fontSize: "0.9rem" }}>PROJECT: {i + 1}</h4>
                        </div>
                        <button onClick={() => removeItem("projects", i)} style={{ color: "#ff4444", fontSize: "0.7rem", background: "none", border: "none", cursor: "pointer" }}>[ REMOVE ]</button>
                      </div>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Image</label>
                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <img src={item.image} style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "2px" }} />
                            <input 
                              type="file" 
                              accept="image/*" 
                              style={{ fontSize: "0.7rem" }}
                              onChange={(e) => e.target.files?.[0] && handleUpload("projects", i, "image", e.target.files[0])}
                            />
                            {uploading === `projects-${i}-image` && <span>Uploading...</span>}
                          </div>
                        </div>
                        <div className={styles.formGroup}>
                          <label>Title</label>
                          <input value={item.title} onChange={(e) => handleChange("projects", "title", e.target.value, i)} />
                        </div>
                        <div className={styles.formGroup}>
                          <label>Category</label>
                          <input value={item.category} onChange={(e) => handleChange("projects", "category", e.target.value, i)} />
                        </div>
                      </div>
                      <div className={styles.formGroup} style={{ marginTop: "1rem" }}>
                        <label>Description / Details</label>
                        <textarea 
                          value={item.description || ""} 
                          placeholder="Fale mais sobre este serviço..."
                          onChange={(e) => handleChange("projects", "description", e.target.value, i)} 
                          style={{ minHeight: "60px", fontSize: "0.8rem" }}
                        />
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          )}

          {activeTab === "visualArchive" && (
            <div className={styles.itemsList}>
              <div className={styles.bulkUploadArea} style={{ marginBottom: "2rem", padding: "30px", border: "2px dashed #333", borderRadius: "8px", textAlign: "center", background: "rgba(255,255,255,0.02)" }}>
                <h4 style={{ fontSize: "0.8rem", marginBottom: "1.5rem", letterSpacing: "0.2em" }}>UPLOAD EM MASSA + GRUPO ATRIBUÍDO</h4>
                <div style={{ display: "flex", gap: "20px", justifyContent: "center", alignItems: "center", marginBottom: "1.5rem" }}>
                  <input 
                    type="text" 
                    placeholder="Nome do Grupo (Ex: A Clínica)" 
                    id="bulkCat"
                    defaultValue="Geral"
                    style={{ width: "200px", padding: "8px", background: "#000", border: "1px solid #333", fontSize: "0.7rem" }}
                  />
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={(e) => {
                      const cat = (document.getElementById('bulkCat') as HTMLInputElement).value || "Geral";
                      // Modify handleBulkUpload to accept cat
                      handleBulkUpload(e, cat);
                    }}
                    disabled={uploading === "bulk"}
                  />
                </div>
                {uploading === "bulk" && (
                  <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <p style={{ color: "var(--accent-blue)", fontSize: "0.7rem", letterSpacing: "0.1em" }}>FARMANDO IMAGENS... {uploadProgress}%</p>
                    <div style={{ width: "300px", height: "2px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        style={{ height: "100%", background: "#fff" }} 
                      />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px", marginBottom: "2rem", flexWrap: "wrap", borderBottom: "1px solid #111", paddingBottom: "1.5rem" }}>
                <span style={{ fontSize: "0.6rem", opacity: 0.4, width: "100%" }}>FILTRAR ADMIN POR GRUPO:</span>
                {["TODOS", ...Array.from(new Set(data.visualArchive.map(i => i.cat)))].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => (window as any).adminFilter = cat === "TODOS" ? null : cat}
                    style={{ background: "#111", border: "none", color: "#fff", fontSize: "0.6rem", padding: "5px 12px", borderRadius: "20px", cursor: "pointer" }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <datalist id="category-suggestions">
                {Array.from(new Set(data.visualArchive.map(i => i.cat))).map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>

              <Reorder.Group axis="y" values={data.visualArchive} onReorder={(newItems) => setReorderedItems("visualArchive", newItems)}>
                {data.visualArchive.map((item, i) => (
                  <Reorder.Item key={item.id} value={item} className={styles.itemRef}>
                    <div className={styles.itemCard} style={{ cursor: "grab" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <div style={{ background: "#333", padding: "4px 8px", borderRadius: "4px", fontSize: "0.6rem" }}>⠿ DRAG</div>
                          <h4 style={{ fontSize: "0.9rem" }}>ARCHIVE: {i + 1}</h4>
                        </div>
                        <button onClick={() => removeItem("visualArchive", i)} style={{ color: "#ff4444", fontSize: "0.7rem", background: "none", border: "none", cursor: "pointer" }}>[ REMOVE ]</button>
                      </div>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Gallery Image</label>
                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <img src={item.img} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }} />
                            <input 
                              type="file" 
                              accept="image/*"
                              style={{ fontSize: "0.7rem" }}
                              onChange={(e) => e.target.files?.[0] && handleUpload("visualArchive", i, "img", e.target.files[0])}
                            />
                            {uploading === `visualArchive-${i}-img` && <span>...</span>}
                          </div>
                        </div>
                        <div className={styles.formGroup}>
                          <label>Size</label>
                          <select value={item.settings.size || "medium"} onChange={(e) => handleChange("visualArchive", "settings", e.target.value, i, "size")}>
                            <option value="small">Pequeña (Span 4)</option>
                            <option value="medium">Media (Span 6)</option>
                            <option value="large">Grande (Span 8)</option>
                            <option value="full">Total (Span 12)</option>
                          </select>
                        </div>
                      </div>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Title</label>
                          <input value={item.title} onChange={(e) => handleChange("visualArchive", "title", e.target.value, i)} />
                        </div>
                        <div className={styles.formGroup}>
                          <label>Category (Group)</label>
                          <input 
                            value={item.cat} 
                            placeholder="Ex: A Clínica"
                            list="category-suggestions"
                            onChange={(e) => handleChange("visualArchive", "cat", e.target.value, i)} 
                          />
                        </div>
                      </div>
                      <div className={styles.formGroup} style={{ marginTop: "1rem" }}>
                        <label>Caption / Story</label>
                        <textarea 
                          value={item.description || ""} 
                          placeholder="Escreva uma pequena legenda ou curiosidade sobre esta imagem..."
                          onChange={(e) => handleChange("visualArchive", "description", e.target.value, i)} 
                          style={{ minHeight: "60px", fontSize: "0.8rem" }}
                        />
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          )}

          {activeTab === "navigation" && (
            <div className={styles.sectionGrid}>
              <div className={styles.formGroup}>
                <label>Left Corner Label</label>
                <input value={data.navigation.leftLabel} onChange={(e) => handleChange("navigation", "leftLabel", e.target.value)} />
              </div>
              {data.navigation.links.map((link, i) => (
                <div key={i} className={styles.itemCard}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Label</label>
                      <input value={link.label} onChange={(e) => handleChange("navigation", "links", e.target.value, i, "label")} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>URL</label>
                      <input value={link.url} onChange={(e) => handleChange("navigation", "links", e.target.value, i, "url")} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "contact" && (
            <div className={styles.sectionGrid}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <textarea value={data.contact.title} onChange={(e) => handleChange("contact", "title", e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input value={data.contact.email} onChange={(e) => handleChange("contact", "email", e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Phone</label>
                <input value={data.contact.phone} onChange={(e) => handleChange("contact", "phone", e.target.value)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
