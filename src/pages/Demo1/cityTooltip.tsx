import { Html } from "@react-three/drei";
import styled from "styled-components";

const TooltipBox = styled.div`
  background: rgba(255, 245, 232, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 12px 16px;
  color: #656565;
  font-size: 12px;
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  min-width: 120px;
`;

const CityName = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  color: #ea580c;
`;

const DataItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`;

interface CityTooltipProps {
  data: {
    city: string;
    population: number;
    gdp: string;
    area: string;
  };
  position: [number, number, number];
  visible: boolean;
}

export default function CityTooltip(props: CityTooltipProps) {
  const { data, position, visible } = props;

  if (!visible) return null;

  return (
    <Html
      center
      position={position}
      distanceFactor={10}
      zIndexRange={[1001 - 1500]}
      style={{ pointerEvents: "none" }}>
      <TooltipBox>
        <CityName>{data.city}</CityName>
        <DataItem>
          <span>人口:</span>
          <span>{data.population}万</span>
        </DataItem>
        <DataItem>
          <span>GDP:</span>
          <span>{data.gdp}</span>
        </DataItem>
        <DataItem>
          <span>面积:</span>
          <span>{data.area}</span>
        </DataItem>
      </TooltipBox>
    </Html>
  );
}
