"use client";

import { useState, useEffect, useCallback } from "react";
import siteData from "@/data/content.json";
import styles from "./admin.module.css";
import { auth as getAuth, storage as getStorage } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User, Auth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, FirebaseStorage } from "firebase/storage";
import { getSiteContent } from "@/lib/siteService";
import { Reorder, motion, AnimatePresence } from "framer-motion";

// Force dynamic rendering to avoid build-time Firebase errors
export const dynamic = 'force-dynamic';

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
  categories?: string[];
  services?: any[];
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  
  const [data, setData] = useState<ContentData>(() => {
    const initialData = JSON.parse(JSON.stringify(siteData)) as any;
    // Garantir que campos essenciais existam
    if (!initialData.services) initialData.services = [];
    if (!initialData.socialReels) initialData.socialReels = [];
    if (!initialData.categories) initialData.categories = ["A Clínica", "Destaque"];
    
    // Garantir que todos os itens tenham IDs únicos para o Reorder
    initialData.projects = (initialData.projects || []).map((it: any, i: number) => ({ ...it, id: it.id || `p-${Date.now()}-${i}` }));
    initialData.visualArchive = (initialData.visualArchive || []).map((it: any, i: number) => ({ ...it, id: it.id || `v-${Date.now()}-${i}` }));
    initialData.socialReels = (initialData.socialReels || []).map((it: any, i: number) => ({ ...it, id: it.id || `s-${Date.now()}-${i}` }));
    if (initialData.services) {
      initialData.services = initialData.services.map((it: any, i: number) => ({ ...it, id: it.id || `srv-${Date.now()}-${i}` }));
    }
    
    return initialData;
  });
  const [activeTab, setActiveTab] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [adminFilter, setAdminFilter] = useState<string | null>(null);

  useEffect(() => {
    const authInstance = getAuth();
    if (!authInstance) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      async function load() {
        const fresh = await getSiteContent();
        if (fresh) {
          const freshData = fresh as any;
          // Garantir campos básicos e IDs
          if (!freshData.services) freshData.services = [];
          if (!freshData.socialReels) freshData.socialReels = [];
          
          // Preservar IDs ou adicionar se faltar
          const processItems = (items: any[], prefix: string) => 
            (items || []).map((it, i) => ({ ...it, id: it.id || `${prefix}-${Date.now()}-${i}` }));

          freshData.projects = processItems(freshData.projects, "p");
          freshData.visualArchive = processItems(freshData.visualArchive, "v");
          freshData.socialReels = processItems(freshData.socialReels, "s");
          freshData.services = processItems(freshData.services, "srv");

          setData(freshData);
        }
      }
      load();
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");
    try {
      const authInstance = getAuth();
      if (!authInstance) throw new Error("Firebase not initialized");
      await signInWithEmailAndPassword(authInstance, email, password);
    } catch (err: any) {
      setAuthError("CREDENCIAIS INVÁLIDAS. TENTE NOVAMENTE.");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setAuthError("");
    try {
      const authInstance = getAuth();
      if (!authInstance) throw new Error("Firebase not initialized");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(authInstance, provider);
    } catch (err: any) {
      console.error("Google login error:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setAuthError("Login cancelado. Tente novamente.");
      } else if (err.code === "auth/unauthorized-domain") {
        setAuthError("Domínio não autorizado. Adicione-o no Firebase Console.");
      } else {
        setAuthError("Erro ao fazer login com Google. Tente novamente.");
      }
    }
    setLoading(false);
  };

  const handleLogout = () => {
    const authInstance = getAuth();
    if (authInstance) signOut(authInstance);
  };

  const handleUpload = async (section: string, index: number, field: string, file: File) => {
    const uploadKey = `${section}-${index}-${field}`;
    setUploading(uploadKey);
    try {
      const storageInstance = getStorage();
      if (!storageInstance) throw new Error("Firebase Storage not initialized");
      const storageRef = ref(storageInstance, `site-images/${Date.now()}-${file.name}`);
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
        const storageInstance = getStorage();
        if (!storageInstance) throw new Error("Firebase Storage not initialized");
        const storageRef = ref(storageInstance, `site-images/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`);
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
    setData(prev => {
      const newData = { ...prev };
      if (index !== undefined) {
        const sectionArray = [...(newData[section as keyof ContentData] as any[])];
        if (subfield) {
          if (!sectionArray[index][field]) sectionArray[index][field] = {};
          sectionArray[index][field][subfield] = value;
        } else {
          sectionArray[index][field] = value;
        }
        (newData[section as keyof ContentData] as any[]) = sectionArray;
      } else {
        if (subfield) {
          if (!(newData[section as keyof ContentData] as any)[field]) {
             (newData[section as keyof ContentData] as any)[field] = {};
          }
          (newData[section as keyof ContentData] as any)[field][subfield] = value;
        } else {
          (newData[section as keyof ContentData] as any)[field] = value;
        }
      }
      return newData;
    });
  };

  const addItem = (section: string) => {
    const newData = { ...data };
    
    if (section === "navigation") {
      newData.navigation.links.push({ label: "Novo Link", url: "#", highlight: false });
    } else if (section === "visualArchive") {
      const newItem = {
        id: `v-${Date.now()}`,
        title: "Novo Item",
        cat: data.categories?.[0] || "Geral",
        img: "/images/clinic/0Y7A0247.jpg",
        settings: { speed: 1.1, position: "center", size: "medium" },
        description: ""
      };
      newData.visualArchive.push(newItem);
    } else if (section === "projects") {
      const newItem = {
        id: `p-${Date.now()}`,
        title: "Novo Serviço",
        category: "Medicina",
        image: "/images/clinic/0Y7A0247.jpg",
        settings: { parallaxSpeed: 1.1, objectPosition: "center", animation: "slide" }
      };
      newData.projects.push(newItem);
    } else if (section === "socialReels") {
      const newItem = {
        id: `s-${Date.now()}`,
        url: "",
        thumbnail: "/images/clinic/0Y7A0247.jpg",
        caption: "Legenda do Reel"
      };
      newData.socialReels.push(newItem);
    } else if (section === "categories") {
      if (!newData.categories) newData.categories = [];
      newData.categories.push("Nova Categoria");
    } else if (section === "services") {
      if (!newData.services) newData.services = [];
      const newService = {
        id: `srv-${Date.now()}`,
        title: "Novo Serviço",
        subtitle: "Subtítulo do serviço",
        description: "Descrição breve do serviço",
        fullDescription: "Descrição completa do serviço",
        image: "/images/clinic/0Y7A0247.jpg",
        thumbnail: "/images/clinic/0Y7A0247.jpg",
        slug: `novo-servico-${Date.now()}`
      };
      newData.services.push(newService);
    }
    
    setData(newData);
  };

  const removeCategory = (index: number) => {
    const newData = { ...data };
    if (newData.categories) {
      newData.categories.splice(index, 1);
      setData(newData);
    }
  };

  const updateCategory = (index: number, value: string) => {
    const newData = { ...data };
    if (newData.categories) {
      newData.categories[index] = value;
      setData(newData);
    }
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
          
          {/* Botão Google */}
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{ 
              width: "100%", 
              padding: "12px 20px", 
              marginBottom: "20px",
              background: "#fff",
              color: "#333",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            ENTRAR COM GOOGLE
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", margin: "20px 0", gap: "15px" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.2)" }}></div>
            <span style={{ fontSize: "0.65rem", opacity: 0.5, letterSpacing: "0.1em" }}>OU</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.2)" }}></div>
          </div>

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
          {["hero", "navigation", "about", "projects", "services", "visualArchive", "categories", "socialReels", "contact"].map((tab) => (
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
            {["projects", "services", "visualArchive", "navigation", "socialReels", "categories"].includes(activeTab) && (
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

          {activeTab === "about" && (
            <div className={styles.sectionGrid}>
              <div className={styles.formGroup}>
                <label>Label</label>
                <input value={data.about.label} onChange={(e) => handleChange("about", "label", e.target.value)} />
              </div>
              <div className={styles.formGroup} style={{ gridColumn: "span 2" }}>
                <label>Phrase (one line per entry - shows in big reveal)</label>
                {data.about.phrase && Array.isArray(data.about.phrase) ? (
                  data.about.phrase.map((line: string, i: number) => (
                    <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                      <input 
                        value={line} 
                        onChange={(e) => {
                          const newPhrase = [...data.about.phrase];
                          newPhrase[i] = e.target.value;
                          handleChange("about", "phrase", newPhrase);
                        }} 
                        style={{ flex: 1 }}
                      />
                      <button 
                        onClick={() => {
                          const newPhrase = data.about.phrase.filter((_: any, idx: number) => idx !== i);
                          handleChange("about", "phrase", newPhrase);
                        }}
                        style={{ background: "#ff4444", border: "none", color: "#fff", padding: "0 15px", borderRadius: "4px", cursor: "pointer", fontSize: "0.7rem" }}
                      >
                        [ REMOVER ]
                      </button>
                    </div>
                  ))
                ) : (
                  <p style={{ opacity: 0.5, fontSize: "0.7rem" }}>Nenhuma frase configurada.</p>
                )}
                <button 
                  className={styles.saveButton} 
                  style={{ width: "auto", padding: "8px 20px", fontSize: "0.6rem", marginTop: "10px", background: "#333" }}
                  onClick={() => {
                    const currentPhrase = Array.isArray(data.about.phrase) ? data.about.phrase : [];
                    const newPhrase = [...currentPhrase, "Nova Linha"];
                    handleChange("about", "phrase", newPhrase);
                  }}
                >
                  + ADICIONAR LINHA
                </button>
              </div>
              <div className={styles.formGroup}>
                <label>Description (main paragraph)</label>
                <textarea 
                  value={data.about.description} 
                  onChange={(e) => handleChange("about", "description", e.target.value)}
                  style={{ minHeight: "120px" }}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Location / Details (bottom text)</label>
                <textarea 
                  value={data.about.location} 
                  onChange={(e) => handleChange("about", "location", e.target.value)}
                  style={{ minHeight: "100px" }}
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

          {activeTab === "services" && (
            <div className={styles.itemsList}>
              <Reorder.Group axis="y" values={data.services || []} onReorder={(newItems) => setReorderedItems("services", newItems)}>
                {(data.services || []).map((item: any, i: number) => (
                  <Reorder.Item key={item.id} value={item} className={styles.itemRef}>
                    <div className={styles.itemCard} style={{ cursor: "grab" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <div style={{ background: "#333", padding: "4px 8px", borderRadius: "4px", fontSize: "0.6rem" }}>⠿ DRAG TO REORDER</div>
                          <h4 style={{ fontSize: "0.9rem" }}>SERVICE: {i + 1}</h4>
                        </div>
                        <button onClick={() => removeItem("services", i)} style={{ color: "#ff4444", fontSize: "0.7rem", background: "none", border: "none", cursor: "pointer" }}>[ REMOVE ]</button>
                      </div>
                      
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Imagem Principal (Página Individual)</label>
                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <img src={item.image} style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "2px" }} />
                            <input 
                              type="file" 
                              accept="image/*" 
                              style={{ fontSize: "0.7rem" }}
                              onChange={(e) => e.target.files?.[0] && handleUpload("services", i, "image", e.target.files[0])}
                            />
                            {uploading === `services-${i}-image` && <span>Uploading...</span>}
                          </div>
                        </div>
                        <div className={styles.formGroup}>
                          <label>Miniatura (Grid Principal)</label>
                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <img src={item.thumbnail || item.image} style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "2px" }} />
                            <input 
                              type="file" 
                              accept="image/*" 
                              style={{ fontSize: "0.7rem" }}
                              onChange={(e) => e.target.files?.[0] && handleUpload("services", i, "thumbnail", e.target.files[0])}
                            />
                            {uploading === `services-${i}-thumbnail` && <span>Uploading...</span>}
                          </div>
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Título</label>
                          <input value={item.title || ""} onChange={(e) => handleChange("services", "title", e.target.value, i)} />
                        </div>
                        <div className={styles.formGroup}>
                          <label>Slug (URL)</label>
                          <input value={item.slug || ""} onChange={(e) => handleChange("services", "slug", e.target.value, i)} placeholder="ex: checkup-premium" />
                        </div>
                      </div>

                      <div className={styles.formGroup} style={{ marginTop: "1rem" }}>
                        <label>Subtítulo</label>
                        <input value={item.subtitle || ""} onChange={(e) => handleChange("services", "subtitle", e.target.value, i)} />
                      </div>

                      <div className={styles.formGroup} style={{ marginTop: "1rem" }}>
                        <label>Descrição Breve (Miniatura)</label>
                        <textarea 
                          value={item.description || ""} 
                          placeholder="Descrição curta que aparece na miniatura..."
                          onChange={(e) => handleChange("services", "description", e.target.value, i)} 
                          style={{ minHeight: "60px", fontSize: "0.8rem" }}
                        />
                      </div>

                      <div className={styles.formGroup} style={{ marginTop: "1rem" }}>
                        <label>Descrição Completa (Página Individual)</label>
                        <textarea 
                          value={item.fullDescription || ""} 
                          placeholder="Descrição completa que aparece na página individual do serviço..."
                          onChange={(e) => handleChange("services", "fullDescription", e.target.value, i)} 
                          style={{ minHeight: "120px", fontSize: "0.8rem" }}
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
                  <select
                    id="bulkCat"
                    defaultValue={data.categories?.[0] || "Geral"}
                    style={{ width: "200px", padding: "8px", background: "#000", border: "1px solid #333", fontSize: "0.7rem", color: "#fff" }}
                  >
                    {(data.categories || ["Geral"]).map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={(e) => {
                      const cat = (document.getElementById('bulkCat') as HTMLSelectElement).value;
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
                    onClick={() => setAdminFilter(cat === "TODOS" ? null : cat)}
                    style={{ 
                      background: adminFilter === (cat === "TODOS" ? null : cat) ? "#fff" : "#111", 
                      color: adminFilter === (cat === "TODOS" ? null : cat) ? "#000" : "#fff",
                      border: "none", 
                      fontSize: "0.6rem", 
                      padding: "5px 12px", 
                      borderRadius: "20px", 
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <Reorder.Group 
                axis="y" 
                values={data.visualArchive} 
                onReorder={(newItems) => setReorderedItems("visualArchive", newItems)}
              >
                {data.visualArchive
                  .map((item, i) => ({ item, originalIndex: i }))
                  .filter(({ item }) => !adminFilter || item.cat === adminFilter)
                  .map(({ item, originalIndex }) => (
                  <Reorder.Item key={item.id} value={item} className={styles.itemRef}>
                    <div className={styles.itemCard} style={{ cursor: "grab" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <div style={{ background: "#333", padding: "4px 8px", borderRadius: "4px", fontSize: "0.6rem" }}>⠿ DRAG</div>
                          <h4 style={{ fontSize: "0.9rem" }}>ARCHIVE: {originalIndex + 1}</h4>
                        </div>
                        <button onClick={() => removeItem("visualArchive", originalIndex)} style={{ color: "#ff4444", fontSize: "0.7rem", background: "none", border: "none", cursor: "pointer" }}>[ REMOVE ]</button>
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
                              onChange={(e) => e.target.files?.[0] && handleUpload("visualArchive", originalIndex, "img", e.target.files[0])}
                            />
                            {uploading === `visualArchive-${originalIndex}-img` && <span>...</span>}
                          </div>
                        </div>
                        <div className={styles.formGroup}>
                          <label>Size</label>
                          <select value={item.settings.size || "medium"} onChange={(e) => handleChange("visualArchive", "settings", e.target.value, originalIndex, "size")}>
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
                          <input value={item.title} onChange={(e) => handleChange("visualArchive", "title", e.target.value, originalIndex)} />
                        </div>
                        <div className={styles.formGroup}>
                          <label>Category (Group)</label>
                          <select 
                            value={item.cat} 
                            onChange={(e) => handleChange("visualArchive", "cat", e.target.value, originalIndex)}
                            style={{ width: "100%", padding: "8px", background: "#111", border: "1px solid #333", color: "#fff", fontSize: "0.75rem", borderRadius: "4px" }}
                          >
                             {(data.categories || ["Geral", item.cat]).map((cat, idx) => (
                                <option key={idx} value={cat}>{cat}</option>
                             ))}
                          </select>
                        </div>
                      </div>
                      <div className={styles.formGroup} style={{ marginTop: "1rem" }}>
                        <label>Caption / Story</label>
                        <textarea 
                          value={item.description || ""} 
                          placeholder="Escreva uma pequena legenda ou curiosidade sobre esta imagem..."
                          onChange={(e) => handleChange("visualArchive", "description", e.target.value, originalIndex)} 
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

          {activeTab === "socialReels" && (
            <div className={styles.itemsList}>
              <Reorder.Group axis="y" values={data.socialReels} onReorder={(newItems) => setReorderedItems("socialReels", newItems)}>
                {(data.socialReels || []).map((item, i) => (
                  <Reorder.Item key={item.id || i} value={item} className={styles.itemRef}>
                    <div className={styles.itemCard} style={{ cursor: "grab" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <div style={{ background: "#333", padding: "4px 8px", borderRadius: "4px", fontSize: "0.6rem" }}>⠿ ARRASTAR</div>
                          <h4 style={{ fontSize: "0.9rem" }}>REEL: {i + 1}</h4>
                        </div>
                        <button onClick={() => removeItem("socialReels", i)} style={{ color: "#ff4444", fontSize: "0.7rem", border: "none", background: "none", cursor: "pointer" }}>[ REMOVER ]</button>
                      </div>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Miniatura (Capa do Reel)</label>
                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <img src={item.thumbnail} style={{ width: "45px", height: "80px", objectFit: "cover", borderRadius: "2px" }} />
                            <input 
                              type="file" 
                              accept="image/*" 
                              style={{ fontSize: "0.7rem" }}
                              onChange={(e) => e.target.files?.[0] && handleUpload("socialReels", i, "thumbnail", e.target.files[0])}
                            />
                            {uploading === `socialReels-${i}-thumbnail` && <span>...</span>}
                          </div>
                        </div>
                        <div className={styles.formGroup}>
                          <label>Link do Reel (Instagram)</label>
                          <input 
                            value={item.url} 
                            onChange={(e) => handleChange("socialReels", "url", e.target.value, i)} 
                            placeholder="https://instagram.com/reel/..." 
                          />
                        </div>
                      </div>
                      <div className={styles.formGroup} style={{ marginTop: "1rem" }}>
                        <label>Legenda (Aparece ao passar o mouse)</label>
                        <textarea 
                          value={item.caption} 
                          onChange={(e) => handleChange("socialReels", "caption", e.target.value, i)} 
                          style={{ minHeight: "60px", fontSize: "0.8rem" }}
                        />
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          )}

          {activeTab === "contact" && (
            <div className={styles.sectionGrid}>
              <div className={styles.formGroup}>
                <label>Label Superior</label>
                <input value={data.contact.label} onChange={(e) => handleChange("contact", "label", e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Título da Seção (use \n p/ quebra)</label>
                <textarea 
                  value={data.contact.title} 
                  onChange={(e) => handleChange("contact", "title", e.target.value)}
                  style={{ minHeight: "80px" }}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Texto do Botão CTA</label>
                <input value={data.contact.button} onChange={(e) => handleChange("contact", "button", e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Email de Contato</label>
                <input value={data.contact.email} onChange={(e) => handleChange("contact", "email", e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Telefone / WhatsApp</label>
                <input value={data.contact.phone} onChange={(e) => handleChange("contact", "phone", e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Endereço - Rua e Número</label>
                <input value={data.contact.address?.street} onChange={(e) => handleChange("contact", "address", e.target.value, undefined, "street")} />
              </div>
              <div className={styles.formGroup}>
                <label>Endereço - Cidade e Estado</label>
                <input value={data.contact.address?.city} onChange={(e) => handleChange("contact", "address", e.target.value, undefined, "city")} />
              </div>
            </div>
          )}

          {activeTab === "categories" && (
            <div className={styles.itemsList}>
              <div className={styles.itemCard}>
                 <h4 style={{ fontSize: "0.8rem", marginBottom: "1.5rem" }}>CATEGORIAS DO ARQUIVO VISUAL</h4>
                 <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                   {(data.categories || []).map((cat, idx) => (
                     <div key={idx} style={{ display: "flex", gap: "10px" }}>
                       <input 
                         value={cat} 
                         onChange={(e) => updateCategory(idx, e.target.value)} 
                         style={{ flex: 1 }}
                       />
                       <button 
                         onClick={() => removeCategory(idx)}
                         style={{ background: "#ff4444", border: "none", color: "#fff", padding: "0 15px", borderRadius: "4px", fontSize: "0.7rem", cursor: "pointer" }}
                       >
                         [ X ]
                       </button>
                     </div>
                   ))}
                   <button 
                    className={styles.saveButton}
                    style={{ background: "#333", marginTop: "1rem", width: "auto", padding: "10px 20px", fontSize: "0.6rem" }}
                    onClick={() => addItem("categories")}
                   >
                     + ADICIONAR CATEGORIA
                   </button>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
