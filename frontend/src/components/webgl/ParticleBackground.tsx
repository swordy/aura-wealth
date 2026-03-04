import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/context/ThemeContext";

const PARTICLE_COUNT = 800;
const PARTICLE_SIZE = 2.5;
const SPREAD = 350;
const AUTO_ROTATE_Y = 0.0004;
const AUTO_ROTATE_X = 0.0002;
const MOUSE_LERP = 0.04;
const MOUSE_SENSITIVITY = 0.0005;

const THEME_CONFIG = {
  dark: { bg: 0x030303, opacity: 0.4 },
  light: { bg: 0xfafafa, opacity: 0 },
} as const;

function createDotTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, "rgba(255, 255, 255, 1)");
  g.addColorStop(0.2, "rgba(212, 175, 55, 0.8)");
  g.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(canvas);
}

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const sceneRef = useRef<THREE.Scene | null>(null);
  const matRef = useRef<THREE.PointsMaterial | null>(null);

  // Initialize Three.js scene once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cfg = THEME_CONFIG[theme];
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(cfg.bg);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000,
    );
    camera.position.z = 120;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Geometry
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      pos[i] = (Math.random() - 0.5) * SPREAD;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    // Material
    const mat = new THREE.PointsMaterial({
      size: PARTICLE_SIZE,
      map: createDotTexture(),
      transparent: true,
      opacity: cfg.opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    matRef.current = mat;

    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    // Mouse tracking
    let mX = 0;
    let mY = 0;
    function onMouseMove(e: MouseEvent) {
      mX = e.clientX - window.innerWidth / 2;
      mY = e.clientY - window.innerHeight / 2;
    }
    document.addEventListener("mousemove", onMouseMove);

    // Animation loop
    let animId: number;
    function animate() {
      animId = requestAnimationFrame(animate);
      particles.rotation.y += AUTO_ROTATE_Y;
      particles.rotation.x += AUTO_ROTATE_X;
      particles.rotation.y += MOUSE_LERP * (mX * MOUSE_SENSITIVITY - particles.rotation.y);
      particles.rotation.x += MOUSE_LERP * (mY * MOUSE_SENSITIVITY - particles.rotation.x);
      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      container.removeChild(renderer.domElement);
      sceneRef.current = null;
      matRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update scene colors when theme changes
  useEffect(() => {
    const cfg = THEME_CONFIG[theme];
    if (sceneRef.current?.background instanceof THREE.Color) {
      sceneRef.current.background.setHex(cfg.bg);
    }
    if (matRef.current) {
      matRef.current.opacity = cfg.opacity;
    }
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className={`fixed top-0 left-0 w-screen h-screen -z-10 transition-opacity duration-500 ${
        theme === "light" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    />
  );
}
