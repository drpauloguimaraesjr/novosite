"use client";

import { useState, useEffect } from 'react';

interface ProxyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Componente de imagem resiliente que:
 * 1. Tenta carregar a imagem diretamente primeiro
 * 2. Se falhar, usa o proxy do servidor
 * 3. Se ainda falhar, mostra um placeholder
 */
export default function ProxyImage({
  src,
  alt,
  className,
  style,
  fallbackSrc,
  onLoad,
  onError
}: ProxyImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [attempts, setAttempts] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Placeholder SVG inline
  const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-family='system-ui' font-size='16' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3EImagem indisponível%3C/text%3E%3C/svg%3E`;

  // Reset quando src muda
  useEffect(() => {
    setCurrentSrc(src);
    setAttempts(0);
    setLoaded(false);
    setError(false);
  }, [src]);

  const handleError = () => {
    console.log(`[ProxyImage] Attempt ${attempts + 1} failed for:`, src);
    
    if (attempts === 0) {
      // Primeira falha: tenta via proxy
      const proxyUrl = `/api/image?url=${encodeURIComponent(src)}`;
      console.log('[ProxyImage] Trying proxy:', proxyUrl);
      setCurrentSrc(proxyUrl);
      setAttempts(1);
    } else if (attempts === 1 && fallbackSrc) {
      // Segunda falha: tenta fallback se fornecido
      console.log('[ProxyImage] Trying fallback:', fallbackSrc);
      setCurrentSrc(fallbackSrc);
      setAttempts(2);
    } else {
      // Todas as tentativas falharam: usa placeholder
      console.log('[ProxyImage] All attempts failed, using placeholder');
      setCurrentSrc(placeholderSvg);
      setError(true);
      onError?.();
    }
  };

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  // Não renderiza Firebase URLs vazias ou inválidas
  if (!src || src === 'undefined' || src === 'null') {
    return (
      <img
        src={placeholderSvg}
        alt={alt}
        className={className}
        style={style}
      />
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      style={{
        ...style,
        opacity: loaded || error ? 1 : 0.5,
        transition: 'opacity 0.3s ease'
      }}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
    />
  );
}
