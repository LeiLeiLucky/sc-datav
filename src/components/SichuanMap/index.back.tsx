import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";
import * as d3 from "d3-geo";
import sichuanData from "../../assets/sc.json";

function SichuanMap3D() {
  // 创建投影和路径生成器
  const { projection, path } = useMemo(() => {
    const proj = d3
      .geoMercator()
      .center([104.065735, 30.659462])
      .scale(8000)
      .translate([0, 0]);

    const pathGen = d3.geoPath().projection(proj);

    return { projection: proj, path: pathGen };
  }, []);

  // 预先计算所有投影点的二维包围盒中心
  const mapBounds = useMemo(() => {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    // 计算整个地图的边界
    const pathBounds = path.bounds(sichuanData);
    minX = pathBounds[0][0];
    minY = pathBounds[0][1];
    maxX = pathBounds[1][0];
    maxY = pathBounds[1][1];

    const center = new THREE.Vector2((minX + maxX) / 2, (minY + maxY) / 2);
    console.log("Map bounds:", { minX, minY, maxX, maxY, center });

    return {
      min: new THREE.Vector2(minX, minY),
      max: new THREE.Vector2(maxX, maxY),
      center: center,
      size: new THREE.Vector2(maxX - minX, maxY - minY),
    };
  }, [path]);

  return (
    <group position={[-mapBounds.center.x, -mapBounds.center.y, 0]}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        {sichuanData.features.map((feature) => {
          const cityName = feature.properties.name;

          if (feature.geometry.type === "MultiPolygon") {
            return feature.geometry.coordinates.map(
              (polygonSet, polygonSetIndex) =>
                polygonSet.map((coordinates, coordinatesIndex) => {
                  try {
                    // 提取多边形坐标
                    const points = coordinates.map((coord) => {
                      const [x, y] = projection(coord as [number, number]) as [
                        number,
                        number
                      ];
                      return new THREE.Vector2(x || 0, y || 0);
                    });

                    if (points.length < 3) return null; // 跳过无效的多边形

                    // 创建形状
                    const shape = new THREE.Shape(points);

                    return (
                      <group
                        key={`${cityName}-${polygonSetIndex}-${coordinatesIndex}`}
                        position={[0, 0, 0]}>
                        {/* 使用 Shape 组件来创建形状 */}
                        <mesh position={[0, 0, 0.25]}>
                          <shapeGeometry attach="geometry" args={[shape]} />
                          <meshStandardMaterial
                            attach="material"
                            color={new THREE.Color().setHSL(0.5, 0.7, 0.6)}
                            metalness={0.2}
                            roughness={0.5}
                            side={THREE.DoubleSide}
                          />
                        </mesh>
                        {/* 添加边框 */}
                        <lineSegments position={[0, 0, 0.25]}>
                          <edgesGeometry
                            attach="geometry"
                            args={[new THREE.ShapeGeometry(shape)]}
                          />
                          <lineBasicMaterial
                            attach="material"
                            color={0x000000}
                            linewidth={1}
                          />
                        </lineSegments>
                      </group>
                    );
                  } catch (error) {
                    console.error(`处理城市 ${cityName} 时出错:`, error);
                    return null;
                  }
                })
            );
          }
          return null;
        })}
      </group>
    </group>
  );
}

export default function SichuanMap() {
  const { ...gridConfig } = useControls({
    gridSize: [10.5, 10.5],
    cellSize: { value: 0.6, min: 0, max: 10, step: 0.1 },
    cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
    cellColor: "#6f6f6f",
    sectionSize: 0,
    infiniteGrid: true,
  });

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 50], fov: 30 }}>
        <Grid position={[0, -0.25, 0]} {...gridConfig} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
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
