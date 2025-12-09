import Chart from "@/components/chart";
import useRafInterval from "@/hooks/useRafInterval";
import { PieChart } from "echarts/charts";

const data = [];

const trafficWay = [
  {
    name: "第一季度",
    value: 20,
  },
  {
    name: "第二季度",
    value: 10,
  },
  {
    name: "第三季度",
    value: 30,
  },
  {
    name: "第四季度",
    value: 40,
  },
];

const color = ["#fbdf88", "#ffa800", "#ff5b00", "#ff3000"];
for (let i = 0; i < trafficWay.length; i++) {
  data.push(
    {
      value: trafficWay[i].value,
      name: trafficWay[i].name,
      itemStyle: {
        borderWidth: 5,
        shadowBlur: 20,
        borderColor: color[i],
        shadowColor: color[i],
      },
    },
    {
      value: 2,
      name: "",
      itemStyle: {
        color: "rgba(0, 0, 0, 0)",
        borderColor: "rgba(0, 0, 0, 0)",
        borderWidth: 0,
      },
    }
  );
}
const seriesOption = [
  {
    name: "",
    type: "pie",
    center: ["30%", "50%"],
    radius: [75, 80],
    label: {
      show: false,
    },
    labelLine: {
      show: false,
    },
    itemStyle: {
      label: {
        show: false,
        position: "outside",
        color: "#ddd",
      },
      labelLine: {
        show: false,
      },
    },
    data: data,
  },
];
export default function Chart5() {
  useRafInterval(() => {}, 3_000, true);

  return (
    <Chart
      use={[PieChart]}
      option={{
        color: color[0],
        tooltip: {
          show: false,
        },
        legend: {
          icon: "circle",
          orient: "vertical",
          data: ["第一季度", "第二季度", "第三季度", "第四季度"],
          top: "middle",
          right: "10%",
          textStyle: {
            color: "#000000",
          },
          itemGap: 20,
        },
        series: seriesOption,
      }}
    />
  );
}
