import { useEffect, useMemo, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Box,
  Edges,
  Extrude,
  Grid,
  Html,
  Line,
  OrbitControls,
  Sphere,
  useAnimations,
} from "@react-three/drei";
import { Text } from "@react-three/drei";
import { folder, useControls } from "leva";
import * as THREE from "three";
import * as d3 from "d3-geo";
import OutLine from "./outline";

import sichuanData from "../../assets/sc.json";

function SichuanMap3D() {
  const citiesGroupRef = useRef<THREE.Group<THREE.Object3DEventMap>>(null);

  const projection = useMemo(() => {
    // 创建地图
    return d3.geoMercator().center([104.065735, 30.659462]);
  }, []);

  useEffect(() => {
    if (!citiesGroupRef.current) return;

    // 计算地图边界以便居中
    const box = new THREE.Box3().setFromObject(citiesGroupRef.current);
    const center = box.getCenter(new THREE.Vector3());

    // 将地图移动到中心点
    citiesGroupRef.current.position.sub(center);
  }, []);

  return (
    <group
      ref={citiesGroupRef}
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}>
      {sichuanData.features.map((feature) => {
        // 获取城市名称
        const cityName = feature.properties.name;

        return feature.geometry.coordinates.map((polygonSet, polygonSetIndex) =>
          polygonSet.map((coordinates, coordinatesIndex) => {
            const points = coordinates.map((coord) => {
              const [x, y] = projection(coord as [number, number]) as [
                number,
                number
              ];
              return new THREE.Vector2(x || 0, y || 0);
            });

            return (
              <Extrude
                key={`${cityName}-${polygonSetIndex}-${coordinatesIndex}`}
                name={cityName}
                args={[
                  new THREE.Shape(points),
                  {
                    steps: 1,
                    depth: 0.5, // 减小厚度使地图更美观
                    bevelEnabled: false,
                  },
                ]}>
                <meshStandardMaterial
                  color={[0.5, 0.7, 0.6]}
                  metalness={0.2}
                  roughness={0.5}
                  side={THREE.DoubleSide}
                />
                <Line
                  position={[0, 0, 0.5]}
                  points={points}
                  linewidth={1}
                  color="#ffffff"
                />
                {/* <Html occlude style={{ color: "red", fontSize: 16 }}>
                  {cityName}
                </Html> */}
                {/* <Text
                  position={[0, 0, 0.5]}
                  color="red"
                  anchorX="center"
                  anchorY="middle">
                  {cityName}
                </Text> */}
              </Extrude>
            );
          })
        );
      })}
      <OutLine projection={projection} />
    </group>
  );
}

export default function SichuanMap() {
  const controls = useControls({
    网格: folder({
      cellColor: "#6f6f6f",
      infiniteGrid: true,
    }),
    环境光: folder({
      intensity: 0.5,
    }),
    点光源: folder({
      pointIntensity: 1,
    }),
  });

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [10, 8, 0], fov: 60 }}>
        <Grid
          sectionSize={0}
          position={[0, -0.25, 0]}
          cellColor={controls.cellColor}
          infiniteGrid={controls.infiniteGrid}
        />
        <ambientLight intensity={controls.intensity} />
        <pointLight
          position={[10, 10, 10]}
          intensity={controls.pointIntensity}
        />
        <SichuanMap3D />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[0, 0, 0]} // 设置控制器的目标点为中心
        />
      </Canvas>
    </div>
  );
}
