import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 70;
const FIELD_RADIUS = 7;
const LINK_DISTANCE = 2.1;

/** A sparse field of drifting nodes connected by faint signal lines — the
 *  page's recurring "system / network" motif, rendered in 3D. */
export default function NetworkField() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const positions = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      pts.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * FIELD_RADIUS * 2,
          (Math.random() - 0.5) * FIELD_RADIUS * 1.3,
          (Math.random() - 0.5) * FIELD_RADIUS
        )
      );
    }
    return pts;
  }, []);

  const pointsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const arr = new Float32Array(positions.length * 3);
    positions.forEach((p, i) => {
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });
    geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return geo;
  }, [positions]);

  const lineGeometry = useMemo(() => {
    const verts: number[] = [];
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (positions[i].distanceTo(positions[j]) < LINK_DISTANCE) {
          verts.push(positions[i].x, positions[i].y, positions[i].z);
          verts.push(positions[j].x, positions[j].y, positions[j].z);
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(verts), 3));
    return geo;
  }, [positions]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.025;
    groupRef.current.rotation.x = Math.sin(t * 0.05) * 0.05;

    // gentle parallax toward pointer, scaled by viewport so it feels consistent
    const targetX = (state.pointer.x * viewport.width) / 12;
    const targetY = (state.pointer.y * viewport.height) / 12;
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.03;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#7C3AED" transparent opacity={0.18} />
      </lineSegments>
      <points geometry={pointsGeometry}>
        <pointsMaterial color="#67E8F9" size={0.06} sizeAttenuation transparent opacity={0.85} />
      </points>
      <FloatingShape position={[3.2, 1.4, -1]} color="#7C3AED" geometry="icosahedron" speed={0.4} />
      <FloatingShape position={[-3.4, -1.1, -2]} color="#06B6D4" geometry="octahedron" speed={0.55} />
      <FloatingShape position={[2.4, -1.8, -3]} color="#A78BFA" geometry="torus" speed={0.3} />
    </group>
  );
}

function FloatingShape({
  position,
  color,
  geometry,
  speed,
}: {
  position: [number, number, number];
  color: string;
  geometry: "icosahedron" | "octahedron" | "torus";
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * speed + offset;
    ref.current.rotation.x = t * 0.6;
    ref.current.rotation.y = t * 0.4;
    ref.current.position.y = position[1] + Math.sin(t) * 0.3;
  });

  return (
    <mesh ref={ref} position={position}>
      {geometry === "icosahedron" && <icosahedronGeometry args={[0.55, 0]} />}
      {geometry === "octahedron" && <octahedronGeometry args={[0.5, 0]} />}
      {geometry === "torus" && <torusGeometry args={[0.4, 0.14, 8, 24]} />}
      <meshBasicMaterial color={color} wireframe transparent opacity={0.55} />
    </mesh>
  );
}
