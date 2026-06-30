import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type CrystalGeometry = "icosahedron" | "octahedron" | "dodecahedron" | "tetrahedron";

type CrystalDef = {
  position: [number, number, number];
  scale: number;
  geometry: CrystalGeometry;
  color: string;
  speed: number;
};

const CRYSTALS: CrystalDef[] = [
  { position: [2.7, 0.5, -1], scale: 1.55, geometry: "dodecahedron", color: "#7C3AED", speed: 0.18 },
  { position: [-2.9, 1.7, -3], scale: 0.85, geometry: "icosahedron", color: "#06B6D4", speed: 0.3 },
  { position: [-2.1, -1.9, -2], scale: 0.7, geometry: "octahedron", color: "#A78BFA", speed: 0.26 },
  { position: [3.5, -1.7, -4], scale: 0.55, geometry: "tetrahedron", color: "#67E8F9", speed: 0.42 },
  { position: [0.3, 2.5, -5], scale: 0.45, geometry: "icosahedron", color: "#7C3AED", speed: 0.34 },
];

/** A small cluster of faceted, glass-like gems that slowly rotate and catch
 *  colored light as it orbits — the page's "premium / architectural" hero
 *  variant, in place of the network field. */
export default function CrystalField() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    const targetX = (state.pointer.x * viewport.width) / 14;
    const targetY = (state.pointer.y * viewport.height) / 14;
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.03;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 6]} intensity={4} color="#A78BFA" distance={16} decay={2} />
      <OrbitingLight color="#06B6D4" radius={6.5} speed={0.22} y={1.4} />
      <OrbitingLight color="#7C3AED" radius={5.5} speed={-0.16} y={-1.1} />

      {CRYSTALS.map((c, i) => (
        <Crystal key={i} {...c} />
      ))}

      <Sparkle count={70} />
    </group>
  );
}

function OrbitingLight({
  color,
  radius,
  speed,
  y,
}: {
  color: string;
  radius: number;
  speed: number;
  y: number;
}) {
  const ref = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * speed;
    ref.current.position.set(Math.cos(t) * radius, y, Math.sin(t) * radius);
  });
  return <pointLight ref={ref} color={color} intensity={9} distance={18} decay={2} />;
}

function Crystal({ position, scale, geometry, color, speed }: CrystalDef) {
  const ref = useRef<THREE.Mesh>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * speed + offset;
    ref.current.rotation.x = t * 0.5;
    ref.current.rotation.y = t * 0.35;
    ref.current.position.y = position[1] + Math.sin(t * 0.6) * 0.25;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      {geometry === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
      {geometry === "octahedron" && <octahedronGeometry args={[1, 0]} />}
      {geometry === "dodecahedron" && <dodecahedronGeometry args={[1, 0]} />}
      {geometry === "tetrahedron" && <tetrahedronGeometry args={[1, 0]} />}
      <meshPhysicalMaterial
        color={color}
        flatShading
        roughness={0.12}
        metalness={0}
        clearcoat={1}
        clearcoatRoughness={0.08}
        transmission={0.75}
        thickness={1.3}
        ior={1.4}
        transparent
        opacity={0.94}
      />
    </mesh>
  );
}

function Sparkle({ count }: { count: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return arr;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.35 + Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#F4F6FB" size={0.035} sizeAttenuation transparent opacity={0.5} />
    </points>
  );
}
