import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const WALL_COUNT = 60;
const FLOOR_COUNT = 60;
const TUBE_COUNT = 6;
const TRACER_COUNT = 36;
const VANISH_X = 1.6; // convergence point shifted right of center, away from hero text

/**
 * Matches the reference: streaks sit along a U-shaped cross-section (like the
 * inside of a tunnel) rather than all pinching to a single near point. The
 * "wall" population curves down from high & far into the horizon; the
 * "floor" population fans out from that same horizon point toward the
 * viewer, which is what makes the bottom of the frame spread wide instead
 * of narrowing.
 */
export default function LightStream() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport, camera } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    const targetX = (state.pointer.x * viewport.width) / 16;
    const targetY = (state.pointer.y * viewport.height) / 16;
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.03;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.03;

    camera.position.z = 8 + Math.sin(t * 0.12) * 0.5;
  });

  return (
    <group ref={groupRef}>
      <WallStreaks />
      <FloorStreaks />
      <GlowTubes />
      <Tracers />
      <Reticles />
      <Bokeh count={110} />
    </group>
  );
}

/** Wall/ceiling population: starts high & far, curves down to meet the
 *  horizon — never reaches the viewer. */
function buildWallCurve() {
  const xSpread = (Math.random() - 0.5) * 22;
  const start = new THREE.Vector3(xSpread, 5 + Math.random() * 3, -18 - Math.random() * 6);
  const mid = new THREE.Vector3(
    xSpread * 0.3 + VANISH_X * 0.5,
    1.6 + Math.random() * 1.2,
    -8 - Math.random() * 3
  );
  const end = new THREE.Vector3(xSpread * 0.04 + VANISH_X, -0.2 + Math.random() * 0.4, -1 + Math.random() * 2);
  return new THREE.CatmullRomCurve3([start, mid, end]);
}

/** Floor population: starts pinched near the same horizon point, then fans
 *  out wide as it sweeps toward the viewer — this is what creates the
 *  bright, full-width spread at the bottom of the frame. */
function buildFloorCurve() {
  const xEnd = (Math.random() - 0.5) * 26;
  const xStart = xEnd * 0.1 + VANISH_X * 0.9;
  const floorY = -1.5 + (Math.random() - 0.5) * 0.5;
  const startZ = -1 + Math.random() * 2;
  const endZ = 5 + Math.random() * 4;
  const start = new THREE.Vector3(xStart, floorY, startZ);
  const mid = new THREE.Vector3((xStart + xEnd) * 0.45, floorY + 0.04, (startZ + endZ) * 0.5);
  const end = new THREE.Vector3(xEnd, floorY, endZ);
  return new THREE.CatmullRomCurve3([start, mid, end]);
}

function WallStreaks() {
  const lines = useMemo(() => {
    return Array.from({ length: WALL_COUNT }, () => {
      const curve = buildWallCurve();
      const points = curve.getPoints(28);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const hue = Math.random();
      const color = hue > 0.82 ? "#A78BFA" : hue > 0.45 ? "#1F8FB5" : "#0E4F66";
      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.16 + Math.random() * 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      return new THREE.Line(geometry, material);
    });
  }, []);

  return (
    <>
      {lines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </>
  );
}

function FloorStreaks() {
  const lines = useMemo(() => {
    const dim = new THREE.Color("#0B6E8C");
    const bright = new THREE.Color("#CFF9FF");

    return Array.from({ length: FLOOR_COUNT }, () => {
      const curve = buildFloorCurve();
      const pts = curve.getPoints(24);
      const positions: number[] = [];
      const colors: number[] = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const t0 = i / (pts.length - 1);
        const t1 = (i + 1) / (pts.length - 1);
        positions.push(pts[i].x, pts[i].y, pts[i].z, pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
        const c0 = dim.clone().lerp(bright, Math.pow(t0, 1.4));
        const c1 = dim.clone().lerp(bright, Math.pow(t1, 1.4));
        colors.push(c0.r, c0.g, c0.b, c1.r, c1.g, c1.b);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3));
      const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.5 + Math.random() * 0.25,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      return new THREE.LineSegments(geometry, material);
    });
  }, []);

  return (
    <>
      {lines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </>
  );
}

/** A handful of thicker glowing tubes among the floor streaks for visual
 *  hierarchy — echoes the brighter "hero" trails in the reference. */
function GlowTubes() {
  const tubes = useMemo(() => {
    return Array.from({ length: TUBE_COUNT }, () => {
      const curve = buildFloorCurve();
      const geometry = new THREE.TubeGeometry(curve, 40, 0.02 + Math.random() * 0.016, 6, false);
      return { geometry, offset: Math.random() * Math.PI * 2 };
    });
  }, []);

  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    tubes.forEach((t, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 + Math.sin(state.clock.getElapsedTime() * 0.8 + t.offset) * 0.2;
    });
  });

  return (
    <>
      {tubes.map((t, i) => (
        <mesh
          key={i}
          geometry={t.geometry}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <meshBasicMaterial
            color="#9FF3FF"
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

/** Bright tracer dots racing along a subset of floor streaks toward the
 *  viewer, giving the scene a sense of motion rather than a static print. */
function Tracers() {
  const tracers = useMemo(
    () =>
      Array.from({ length: TRACER_COUNT }, () => ({
        curve: buildFloorCurve(),
        t: Math.random(),
        speed: 0.08 + Math.random() * 0.1,
      })),
    []
  );

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(TRACER_COUNT * 3), 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    tracers.forEach((tr, i) => {
      tr.t += delta * tr.speed;
      if (tr.t > 1) tr.t -= 1;
      const p = tr.curve.getPointAt(tr.t);
      posAttr.setXYZ(i, p.x, p.y, p.z);
    });
    posAttr.needsUpdate = true;
  });

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="#F2FEFF"
        size={0.08}
        sizeAttenuation
        transparent
        opacity={0.95}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function Reticles() {
  const items = useMemo(
    () =>
      Array.from({ length: 9 }, () => ({
        position: [
          (Math.random() - 0.4) * 16 + VANISH_X,
          (Math.random() - 0.2) * 7,
          -3 - Math.random() * 14,
        ] as [number, number, number],
        size: 0.1 + Math.random() * 0.16,
        speed: 0.15 + Math.random() * 0.25,
        offset: Math.random() * Math.PI * 2,
        color: Math.random() > 0.5 ? "#FBBF24" : "#9FF3FF",
      })),
    []
  );

  return (
    <>
      {items.map((it, i) => (
        <Reticle key={i} {...it} />
      ))}
    </>
  );
}

function Reticle({
  position,
  size,
  speed,
  offset,
  color,
}: {
  position: [number, number, number];
  size: number;
  speed: number;
  offset: number;
  color: string;
}) {
  const ref = useRef<THREE.LineLoop>(null);
  const geometry = useMemo(() => {
    const h = size / 2;
    const pts = [
      new THREE.Vector3(-h, -h, 0),
      new THREE.Vector3(h, -h, 0),
      new THREE.Vector3(h, h, 0),
      new THREE.Vector3(-h, h, 0),
    ];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [size]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * speed + offset;
    ref.current.position.y = position[1] + Math.sin(t) * 0.3;
    ref.current.rotation.z = Math.sin(t * 0.4) * 0.15;
    const mat = ref.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.35 + Math.sin(t * 1.4) * 0.25;
  });

  return (
    <lineLoop ref={ref} geometry={geometry} position={position}>
      <lineBasicMaterial color={color} transparent opacity={0.5} />
    </lineLoop>
  );
}

function Bokeh({ count }: { count: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.4) * 22 + VANISH_X;
      arr[i * 3 + 1] = (Math.random() - 0.3) * 9;
      arr[i * 3 + 2] = (Math.random() - 0.2) * 20 - 4;
    }
    return arr;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.45 + Math.sin(state.clock.getElapsedTime() * 1.6) * 0.25;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#E0F7FF"
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
