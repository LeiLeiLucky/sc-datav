import { useState } from "react";
import { extend, useFrame } from "@react-three/fiber";
import { Extrude, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { type GeoProjection } from "d3-geo";

import scOutlineData from "../../assets/sc_outline.json";

const OutLineShiftMaterial = extend(
  shaderMaterial(
    { time: 0, color: new THREE.Color("#00FFFF") },
    // vertex shader
    /*glsl*/ `
    varying vec2 vUv;
    varying vec3 vNormal;
    
    void main() {
        vUv=uv;
        vNormal=normal;           
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // fragment shader
    /*glsl*/ `
    uniform float time;  
    uniform vec3 color;                
    varying vec2 vUv; 
    varying vec3 vNormal;
    void main() {
        if(vNormal.z==1.0||vNormal.z==-1.0||vUv.y ==0.0){
            discard;
        } else{
            gl_FragColor =vec4(color,0.5-fract((vUv.y-time) * 3.0));
        } 
    }
  `
  )
);

function OutLineAnimated() {
  const [time, setTime] = useState(0);

  useFrame(() => {
    setTime((prev) => {
      const a = (prev - 0.003) % 1;
      //   console.log(a);
      return a;
    });
  });

  return (
    <OutLineShiftMaterial
      transparent
      depthTest={false}
      side={THREE.DoubleSide}
      time={time}
    />
  );
}

export default function OutLine({ projection }: { projection: GeoProjection }) {
  return scOutlineData.features.map((feature) =>
    feature.geometry.coordinates.map((polygon, polygonIndex) =>
      polygon.map((coordinates, coordinatesIndex) => (
        <Extrude
          key={`${feature.properties.name}-${polygonIndex}-${coordinatesIndex}`}
          args={[
            new THREE.Shape(
              coordinates.map((coord) => {
                const [x, y] = projection(coord as [number, number]) as [
                  number,
                  number
                ];
                return new THREE.Vector2(x || 0, y || 0);
              })
            ),
            {
              depth: 0.5,
              bevelEnabled: false,
            },
          ]}>
          <OutLineAnimated />
        </Extrude>
      ))
    )
  );
}
