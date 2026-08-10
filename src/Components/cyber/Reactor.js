import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Icosahedron,
  Torus,
  Sparkles,
  Float,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";

const LIME = "#bbdf4d";
const CYAN = "#3df2ff";
const PKG = "#141a14";
const DIE = "#0c2210";
const PAD = "#c8d98a";
const PIN = "#b8c4a8";

/* device tier — downgrade the scene on phones / touch for perf + battery */
const mq = (q) =>
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia(q).matches
    : false;
const IS_MOBILE = mq("(max-width: 640px)");
const FINE_POINTER = mq("(hover: hover) and (pointer: fine)");
const NODE_COUNT = IS_MOBILE ? 8 : 14;

/* Stylized IC / microcontroller — replaces the old green blob core */
function Core() {
  const group = useRef();
  const dieMat = useRef();
  const ledMat = useRef();

  const pads = useMemo(() => {
    const arr = [];
    const n = IS_MOBILE ? 4 : 6;
    for (let x = 0; x < n; x++) {
      for (let z = 0; z < n; z++) {
        const u = ((x + 0.5) / n - 0.5) * 0.72;
        const v = ((z + 0.5) / n - 0.5) * 0.72;
        arr.push([u, 0.17, v]);
      }
    }
    return arr;
  }, []);

  const pins = useMemo(() => {
    const arr = [];
    const perSide = IS_MOBILE ? 6 : 9;
    for (let i = 0; i < perSide; i++) {
      const t = (i / (perSide - 1)) * 1.35 - 0.675;
      arr.push({ p: [t, -0.02, 0.92], r: [0.35, 0, 0] });
      arr.push({ p: [t, -0.02, -0.92], r: [-0.35, 0, 0] });
      arr.push({ p: [0.92, -0.02, t], r: [0, 0, -0.35] });
      arr.push({ p: [-0.92, -0.02, t], r: [0, 0, 0.35] });
    }
    return arr;
  }, []);

  const traces = useMemo(() => {
    if (IS_MOBILE) return [];
    return [
      { p: [0.28, 0.145, 0], s: [0.42, 0.012, 0.03] },
      { p: [-0.22, 0.145, 0.18], s: [0.03, 0.012, 0.36] },
      { p: [0.05, 0.145, -0.25], s: [0.38, 0.012, 0.03] },
      { p: [-0.32, 0.145, -0.08], s: [0.03, 0.012, 0.28] },
    ];
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.18;
    }
    if (dieMat.current) {
      dieMat.current.emissiveIntensity = 0.35 + Math.sin(t * 1.6) * 0.18;
    }
    if (ledMat.current) {
      // blink like a status LED
      ledMat.current.emissiveIntensity = Math.sin(t * 4) > 0 ? 1.4 : 0.15;
    }
  });

  return (
    <group ref={group} rotation={[0.35, 0.55, 0.12]} scale={1.05}>
      {/* ceramic / plastic package */}
      <mesh castShadow>
        <boxGeometry args={[1.7, 0.28, 1.7]} />
        <meshStandardMaterial
          color={PKG}
          metalness={0.55}
          roughness={0.42}
          emissive="#1a2a10"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* bevel rim */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[1.55, 0.04, 1.55]} />
        <meshStandardMaterial color="#1c2418" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* silicon die */}
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[0.95, 0.07, 0.95]} />
        <meshStandardMaterial
          ref={dieMat}
          color={DIE}
          emissive={LIME}
          emissiveIntensity={0.4}
          metalness={0.85}
          roughness={0.18}
        />
      </mesh>

      {/* contact pad grid on the die */}
      {pads.map((p, i) => (
        <mesh key={`pad-${i}`} position={p}>
          <boxGeometry args={[0.055, 0.018, 0.055]} />
          <meshStandardMaterial
            color={PAD}
            emissive={i % 5 === 0 ? CYAN : LIME}
            emissiveIntensity={0.25}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* etched signal traces */}
      {traces.map((tr, i) => (
        <mesh key={`tr-${i}`} position={tr.p}>
          <boxGeometry args={tr.s} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.55} />
        </mesh>
      ))}

      {/* QFP-style pins */}
      {pins.map((pin, i) => (
        <mesh key={`pin-${i}`} position={pin.p} rotation={pin.r}>
          <boxGeometry args={[0.06, 0.035, 0.28]} />
          <meshStandardMaterial
            color={PIN}
            metalness={0.95}
            roughness={0.22}
            emissive={LIME}
            emissiveIntensity={0.08}
          />
        </mesh>
      ))}

      {/* status LED */}
      <mesh position={[0.62, 0.2, 0.62]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial
          ref={ledMat}
          color={LIME}
          emissive={LIME}
          emissiveIntensity={1}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {/* orientation notch */}
      <mesh position={[-0.72, 0.15, -0.72]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
        <meshStandardMaterial color="#0a100a" metalness={0.3} roughness={0.6} />
      </mesh>
    </group>
  );
}

/* Wireframe shell that rotates around the core */
function Shell() {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.25;
      ref.current.rotation.x += delta * 0.12;
    }
  });
  return (
    <Icosahedron ref={ref} args={[1.85, 1]}>
      <meshBasicMaterial color={LIME} wireframe transparent opacity={0.28} />
    </Icosahedron>
  );
}

/* Orbiting neon rings */
function Rings() {
  const g = useRef();
  useFrame((_, delta) => {
    if (g.current) g.current.rotation.z += delta * 0.4;
  });
  return (
    <group ref={g}>
      <Torus args={[2.6, 0.015, 16, 120]} rotation={[Math.PI / 2.2, 0, 0]}>
        <meshBasicMaterial color={CYAN} transparent opacity={0.65} />
      </Torus>
      <Torus args={[3.1, 0.01, 16, 120]} rotation={[Math.PI / 1.7, 0.5, 0]}>
        <meshBasicMaterial color={LIME} transparent opacity={0.5} />
      </Torus>
      <Torus args={[3.6, 0.008, 16, 120]} rotation={[Math.PI / 2.6, -0.6, 0.4]}>
        <meshBasicMaterial color={CYAN} transparent opacity={0.35} />
      </Torus>
    </group>
  );
}

/* Small nodes orbiting like electrons */
function Electrons() {
  const g = useRef();
  const nodes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const a = (i / 14) * Math.PI * 2;
      const r = 2.6 + (i % 3) * 0.5;
      arr.push({
        a,
        r,
        y: (Math.sin(i) * 1.2),
        s: 0.03 + (i % 3) * 0.015,
      });
    }
    return arr;
  }, []);
  useFrame(({ clock }) => {
    if (!g.current) return;
    const t = clock.elapsedTime;
    g.current.children.forEach((m, i) => {
      const n = nodes[i];
      m.position.x = Math.cos(n.a + t * 0.5) * n.r;
      m.position.z = Math.sin(n.a + t * 0.5) * n.r;
      m.position.y = n.y + Math.sin(t + i) * 0.3;
    });
  });
  return (
    <group ref={g}>
      {nodes.map((n, i) => (
        <mesh key={i}>
          <sphereGeometry args={[n.s, 12, 12]} />
          <meshBasicMaterial color={i % 2 ? CYAN : LIME} />
        </mesh>
      ))}
    </group>
  );
}

/* Rotate whole rig toward pointer for parallax (fine pointers only —
   on touch the pointer sticks at the last tap and skews the rig) */
function Rig({ children }) {
  const g = useRef();
  useFrame((state) => {
    if (!g.current) return;
    if (FINE_POINTER) {
      const { x, y } = state.pointer;
      g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, x * 0.4, 0.05);
      g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, -y * 0.3, 0.05);
    } else {
      // gentle idle drift instead of pointer-follow
      g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, 0, 0.02);
      g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, 0, 0.02);
    }
  });
  return <group ref={g}>{children}</group>;
}

export default function Reactor({ active = true }) {
  return (
    <Canvas
      // pause the render loop when the hero is offscreen / tab hidden (battery + GPU)
      frameloop={active ? "always" : "never"}
      dpr={[1, IS_MOBILE ? 1.5 : 2]}
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      gl={{ antialias: !IS_MOBILE, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={2} color={LIME} />
      <pointLight position={[-5, -3, 2]} intensity={1.5} color={CYAN} />
      <Rig>
        <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
          <Core />
          <Shell />
        </Float>
        <Rings />
        <Electrons />
        <Sparkles count={IS_MOBILE ? 40 : 90} scale={9} size={2.2} speed={0.4} color={LIME} opacity={0.7} />
        <Sparkles count={IS_MOBILE ? 22 : 50} scale={12} size={1.4} speed={0.2} color={CYAN} opacity={0.5} />
      </Rig>
      <Environment preset="night" />
    </Canvas>
  );
}
