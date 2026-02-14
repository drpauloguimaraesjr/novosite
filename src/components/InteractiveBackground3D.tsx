"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

/**
 * Interactive Background 3D - Dynamic flowing particles and organic shapes
 * Responds to scroll position and mouse movement
 */

interface ParticleSystemProps {
  count: number;
  scrollProgress: number;
}

function ParticleSystem({ count, scrollProgress }: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();

  const [positions, velocities, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Spread particles in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 7;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Random velocities
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      // Green color palette
      const greenIntensity = 0.3 + Math.random() * 0.7;
      col[i * 3] = 0.1 * greenIntensity;
      col[i * 3 + 1] = 0.8 * greenIntensity;
      col[i * 3 + 2] = 0.3 * greenIntensity;
    }

    return [pos, vel, col];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Organic floating motion
      positions[i3] += Math.sin(time * 0.5 + i * 0.1) * 0.002;
      positions[i3 + 1] += Math.cos(time * 0.3 + i * 0.1) * 0.002;
      positions[i3 + 2] += Math.sin(time * 0.4 + i * 0.15) * 0.002;

      // Mouse attraction
      const dx = mouse.x * viewport.width * 0.5 - positions[i3];
      const dy = mouse.y * viewport.height * 0.5 - positions[i3 + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 3) {
        positions[i3] += dx * 0.001;
        positions[i3 + 1] += dy * 0.001;
      }

      // Scroll effect - spread particles outward
      const spreadFactor = 1 + scrollProgress * 0.5;
      const currentDist = Math.sqrt(
        positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2
      );
      if (currentDist > 0) {
        const targetDist = currentDist * spreadFactor;
        const scale = targetDist / currentDist;
        positions[i3] *= 1 + (scale - 1) * 0.01;
        positions[i3 + 1] *= 1 + (scale - 1) * 0.01;
        positions[i3 + 2] *= 1 + (scale - 1) * 0.01;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.7 - scrollProgress * 0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FlowingLines({ scrollProgress }: { scrollProgress: number }) {
  const linesRef = useRef<THREE.Group>(null);
  const lineCount = 8;

  const curves = useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => {
      const points: THREE.Vector3[] = [];
      const offset = (i / lineCount) * Math.PI * 2;

      for (let j = 0; j <= 100; j++) {
        const t = j / 100;
        const x = Math.sin(t * Math.PI * 3 + offset) * (2 + Math.sin(offset) * 1.5);
        const y = (t - 0.5) * 10;
        const z = Math.cos(t * Math.PI * 3 + offset) * (2 + Math.cos(offset) * 1.5);
        points.push(new THREE.Vector3(x, y, z));
      }

      return new THREE.CatmullRomCurve3(points);
    });
  }, []);

  useFrame((state) => {
    if (!linesRef.current) return;
    linesRef.current.rotation.y = state.clock.elapsedTime * 0.05;

    // Pulsing effect based on scroll
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + scrollProgress * 0.3;
    linesRef.current.scale.setScalar(scale);
  });

  const linePoints = useMemo(() => {
    return curves.map(curve => curve.getPoints(100).map(p => [p.x, p.y, p.z] as [number, number, number]));
  }, [curves]);

  return (
    <group ref={linesRef}>
      {linePoints.map((points, i) => (
        <Line
          key={i}
          points={points}
          color={new THREE.Color().setHSL(0.35 + i * 0.02, 0.8, 0.4 + i * 0.05)}
          transparent
          opacity={0.3 + scrollProgress * 0.2}
          lineWidth={1}
        />
      ))}
    </group>
  );
}

function OrganicBlob({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Morph the blob based on time and scroll
    const time = state.clock.elapsedTime;
    const geometry = meshRef.current.geometry as THREE.IcosahedronGeometry;
    const positions = geometry.attributes.position;
    const originalPositions = geometry.attributes.position.array;

    for (let i = 0; i < positions.count; i++) {
      const i3 = i * 3;
      const x = originalPositions[i3];
      const y = originalPositions[i3 + 1];
      const z = originalPositions[i3 + 2];

      const noise =
        Math.sin(x * 2 + time * 0.5) *
        Math.sin(y * 2 + time * 0.3) *
        Math.sin(z * 2 + time * 0.4) *
        0.3 *
        (1 + scrollProgress);

      const len = Math.sqrt(x * x + y * y + z * z);
      const scale = 1 + noise;

      positions.setXYZ(i, (x / len) * scale, (y / len) * scale, (z / len) * scale);
    }

    positions.needsUpdate = true;
    geometry.computeVertexNormals();

    meshRef.current.rotation.x = time * 0.1;
    meshRef.current.rotation.y = time * 0.15;
  });

  return (
    <mesh ref={meshRef} scale={1.5}>
      <icosahedronGeometry args={[1, 4]} />
      <meshStandardMaterial
        color="#1a4a25"
        wireframe
        transparent
        opacity={0.15 + scrollProgress * 0.1}
      />
    </mesh>
  );
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <ParticleSystem count={500} scrollProgress={scrollProgress} />
      <FlowingLines scrollProgress={scrollProgress} />
      <OrganicBlob scrollProgress={scrollProgress} />

      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#4ade80" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#22c55e" />
    </>
  );
}

interface InteractiveBackground3DProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function InteractiveBackground3D({
  className,
  style,
}: InteractiveBackground3DProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(Math.min(scrollY / docHeight, 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Skip on mobile for performance
  if (isMobile) return null;

  return (
    <div
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.6,
        ...style,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Scene scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
