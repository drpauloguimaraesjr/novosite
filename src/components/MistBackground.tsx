"use client";

import React, { useEffect, useRef, useState } from 'react';

/**
 * Mist Background Component
 * Technology: WebGL 2D Fragment Shaders (GLSL)
 * Style: Ethereal Generative Fluid / Mist with GREEN tones
 * Behavior: Appears as page darkens on scroll, creating immersive depth effect
 */

interface MistBackgroundProps {
  /** Opacity of the mist effect (0-1), controlled by scroll position */
  opacity?: number;
  /** Enable scroll-based opacity control */
  scrollControlled?: boolean;
}

const MistBackground: React.FC<MistBackgroundProps> = ({ 
  opacity = 1, 
  scrollControlled = true 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scrollOpacity, setScrollOpacity] = useState(0);

  // Handle scroll-based opacity
  useEffect(() => {
    if (!scrollControlled) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      // Start showing mist after 30% of the page, fully visible at 60%
      const scrollPercent = scrollY / (docHeight - windowHeight);
      const startThreshold = 0.3;
      const endThreshold = 0.6;
      
      if (scrollPercent < startThreshold) {
        setScrollOpacity(0);
      } else if (scrollPercent > endThreshold) {
        setScrollOpacity(1);
      } else {
        const progress = (scrollPercent - startThreshold) / (endThreshold - startThreshold);
        setScrollOpacity(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollControlled]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader with GREEN color palette and gradient effect
    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_scrollProgress;

      float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
      }

      float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 6; i++) {
              v += a * noise(p);
              p *= 2.0;
              a *= 0.5;
          }
          return v;
      }

      void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          uv.x *= u_resolution.x / u_resolution.y;

          vec2 mPos = u_mouse / u_resolution.xy;
          mPos.x *= u_resolution.x / u_resolution.y;
          float dist = distance(uv, mPos);
          
          vec2 q = vec2(0.0);
          q.x = fbm(uv + 0.05 * u_time);
          q.y = fbm(uv + vec2(1.0, 1.0));

          vec2 r = vec2(0.0);
          r.x = fbm(uv + 1.0 * q + vec2(1.7, 9.2) + 0.12 * u_time);
          r.y = fbm(uv + 1.0 * q + vec2(8.3, 2.8) + 0.1 * u_time);

          float f = fbm(uv + r);

          // GREEN color palette - from dark to emerald
          vec3 baseColor = vec3(0.02, 0.05, 0.03);      // Very dark green-black
          vec3 mistColor = vec3(0.05, 0.15, 0.08);      // Dark forest green
          vec3 accentColor = vec3(0.1, 0.35, 0.15);     // Emerald green
          vec3 highlightColor = vec3(0.15, 0.5, 0.25);  // Bright green
          
          // Create gradient effect based on vertical position
          float verticalGradient = uv.y * 0.5 + 0.5;
          
          // Mix colors based on noise and gradient
          vec3 color = mix(baseColor, mistColor, f);
          color = mix(color, accentColor, dot(q, r) * 0.6);
          color = mix(color, highlightColor, f * verticalGradient * 0.3);
          
          // Subtle mouse glow with green tint
          float mouseGlow = smoothstep(0.4, 0.0, dist);
          color += mouseGlow * 0.08 * vec3(0.3, 1.0, 0.5);

          // Add vertical gradient from dark (bottom) to slightly lighter (top)
          color *= 0.7 + verticalGradient * 0.5;

          // Post-processing - slightly boost greens
          color = pow(color, vec3(1.0, 0.95, 1.05)) * 1.3;
          
          gl_FragColor = vec4(color, 1.0);
      }
    `;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posAttrib = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posAttrib);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');
    const scrollLoc = gl.getUniformLocation(program, 'u_scrollProgress');

    let mouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = window.innerHeight - e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const render = (time: number) => {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      gl.uniform1f(timeLoc, time * 0.001);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform2f(mouseLoc, mouse.x, mouse.y);
      gl.uniform1f(scrollLoc, scrollOpacity);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollOpacity]);

  const finalOpacity = scrollControlled ? scrollOpacity : opacity;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ 
        background: '#050a05', // Very dark green base
        zIndex: -1,
        opacity: finalOpacity,
        transition: 'opacity 0.5s ease-out',
      }}
    />
  );
};

export default MistBackground;
