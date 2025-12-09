import { useRef } from "react";
import { type SpotLight } from "three";

export default function Lights() {
  const lightRef = useRef<SpotLight>(null!);
  const lightRef1 = useRef<SpotLight>(null!);

  //   useHelper(lightRef, PointLightHelper, 5, "#0e81fb");
  //   useHelper(lightRef1, PointLightHelper, 5, "#fb0e0e");

  return (
    <>
      <ambientLight intensity={2} />
      <spotLight
        ref={lightRef}
        intensity={1500}
        position={[5, 15, 5]}
        distance={50}
        color="#fff5e8"
      />
      <spotLight
        ref={lightRef1}
        intensity={1500}
        position={[-5, 15, 5]}
        distance={50}
        color="#fff5e8"
      />
    </>
  );
}
