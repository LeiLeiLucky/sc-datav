import { useEffect, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Billboard,
  Extrude,
  Grid,
  Line,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import styled from "styled-components";
import { Text } from "@react-three/drei";
import { folder, useControls } from "leva";
import * as THREE from "three";
import * as d3 from "d3-geo";
import gsap from "gsap";
import OutLine from "./outline";
import FlyLine from "./flyLine";
import type { CityGeoJSON } from "../map";
import Content from "./content";

import sichuanData from "../../assets/sc.json";
import texturesImg from "../../assets/map.jpeg";

const data = sichuanData as CityGeoJSON;

function SichuanMap3D() {
  const texture = useTexture(texturesImg, (tex) => {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(0.1, 0.1); // 不重复，完整显示
    // tex.offset.set(0.3, 0.2);
    tex.center.set(0.5, 0.5);
    // tex.rotation = 0;
  });

  const projection = useMemo(() => {
    // 创建地图
    return d3
      .geoMercator()
      .center(data.features[0].properties.centroid)
      .scale(80)
      .translate([0, 0]);
  }, []);

  const mapRef = useRef<THREE.Group<THREE.Object3DEventMap>>(null);

  useEffect(() => {
    if (mapRef.current) {
      gsap.to(mapRef.current.scale, {
        duration: 3,
        x: 1,
        y: 1,
        z: 1,
        ease: "sine.inOut",
      });
    }
  }, []);

  return (
    <group
      ref={mapRef}
      scale={0.5}
      position={[0, 0.25, -1.5]}
      rotation={[Math.PI / 2, 0, Math.PI * 1.5]}>
      <group renderOrder={0} position={[0, 0, -0.01]}>
        {data.features.map((feature) => {
          // 获取城市名称
          const cityName = feature.properties.name;

          return feature.geometry.coordinates.map(
            (polygonSet, polygonSetIndex) =>
              polygonSet.map((coordinates, coordinatesIndex) => {
                const points = coordinates.map((coord) => {
                  const [x, y] = projection(coord as [number, number]) ?? [];
                  return new THREE.Vector2(x ?? 0, y ?? 0);
                });

                // return (
                //   <Line
                //     key={`${cityName}-${polygonSetIndex}-${coordinatesIndex}`}
                //     points={points}
                //     linewidth={1}
                //     color="#ffffff"
                //   />
                // );
                return (
                  <Extrude
                    key={`${cityName}-${polygonSetIndex}-${coordinatesIndex}`}
                    name={cityName}
                    args={[
                      new THREE.Shape(points),
                      {
                        steps: 1,
                        depth: 0, // 减小厚度使地图更美观
                        bevelEnabled: false,
                      },
                    ]}>
                    <meshStandardMaterial
                      map={texture}
                      metalness={0.2}
                      roughness={0.5}
                      side={THREE.DoubleSide}
                    />
                    <Line
                      position={[0, 0, -0.01]}
                      points={points}
                      linewidth={1}
                      color="#ffffff"
                    />
                  </Extrude>
                );
              })
          );
        })}
      </group>
      <group position={[0, 0, -0.02]}>
        {data.features.map((item, index) => {
          const [x, y] =
            projection(item.properties.centroid ?? item.properties.center) ??
            [];
          return (
            <Billboard
              rotation={[Math.PI, 0, 0]}
              position={[x ?? 0, y ?? 0, -0.1]}>
              <Text key={"city_" + index} color="#ffffff" fontSize={0.2}>
                {item.properties.name}
              </Text>
            </Billboard>
          );
        })}
      </group>
      <OutLine projection={projection} />
      <FlyLine projection={projection} />
    </group>
  );
}

const AmbientLight = () => {
  const controls = useControls({
    intensity: {
      label: "环境光",
      value: 2,
      min: 0,
      max: 10,
    },
  });
  return <ambientLight intensity={controls.intensity} />;
};

const PointLight = () => {
  const controls = useControls({
    intensity1: {
      label: "点光源",
      value: 1000,
      min: 0,
      max: 2000,
    },
  });

  return (
    <pointLight
      intensity={controls.intensity1}
      position={[-5, 20, 0]}
      distance={50}
    />
  );
};

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

export default function SichuanMap() {
  const controls = useControls({
    网格: folder({
      infiniteGrid: true,
      cellColor: "#6f6f6f",
      sectionColor: "#b2b6ff",
    }),
  });

  return (
    <Wrapper>
      <Canvas
        camera={{ position: [10, 8, 0], fov: 60 }}
        scene={{ background: new THREE.Color("#26282a") }}>
        <Grid
          //   sectionSize={0}
          //   position={[0, -0.25, 0]}
          //   cellColor={controls.cellColor}
          //   infiniteGrid={controls.infiniteGrid}
          renderOrder={-1}
          position={[0, -0.25, 0]}
          infiniteGrid={controls.infiniteGrid}
          cellSize={0.6}
          cellThickness={0.6}
          sectionSize={3.3}
          sectionThickness={1.5}
          sectionColor={controls.sectionColor}
          cellColor={controls.cellColor}
          fadeDistance={30}
        />
        <AmbientLight />
        <PointLight />
        <SichuanMap3D />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[0, 0, 0]} // 设置控制器的目标点为中心
        />
      </Canvas>
      <Content />
    </Wrapper>
  );
}
