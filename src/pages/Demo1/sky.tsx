import { Cloud, Clouds } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { type Group, MeshLambertMaterial } from "three";

export default function Sky() {
  const ref = useRef<Group>(null!);
  const cloud0 = useRef<Group>(null!);

  useFrame((state, delta) => {
    ref.current.rotation.y = Math.cos(state.clock.elapsedTime / 2) / 2;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime / 2) / 2;
    cloud0.current.rotation.y -= delta / 5;
  });

  return (
    <group ref={ref}>
      <Clouds material={MeshLambertMaterial}>
        <Cloud ref={cloud0} position={[5, 5, 0]} volume={1} opacity={0.5} />
        <Cloud position={[-5, 5, 5]} volume={0.5} opacity={0.5} />
      </Clouds>
    </group>
  );
}
