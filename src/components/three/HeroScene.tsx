import { Canvas } from "@react-three/fiber";
import NetworkField from "./NetworkField";
import CrystalField from "./CrystalField";
import LightStream from "./LightStream";

// Swap which background plays in the hero by changing this one line.
// "network"  - drifting node graph connected by signal lines
// "crystal"  - faceted glass-like gems catching colored light
// "stream"   - converging light-trail data tunnel
const HERO_THEME: "network" | "crystal" | "stream" = "stream";

/** Isolated in its own file so the Hero component can lazy-load it,
 *  keeping three.js out of the initial JS bundle. */
export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 1.5]}>
      {HERO_THEME === "stream" ? (
        <LightStream />
      ) : HERO_THEME === "crystal" ? (
        <CrystalField />
      ) : (
        <NetworkField />
      )}
    </Canvas>
  );
}
