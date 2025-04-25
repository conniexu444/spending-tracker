"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "../hooks/useTheme";
import {
  Chart,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { SankeyController, Flow } from "chartjs-chart-sankey";
import { MainMenusCompactCard } from "./gradient-card-compact";
import chroma from "chroma-js"; // ✅ super clean color manipulation library

Chart.register(
  SankeyController,
  Flow,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
);

type SankeyChartProps = {
  data: {
    from: string;
    to: string;
    flow: number;
  }[];
};

const colors = [
  "#3BC4F2", // Neon Blue
  "#7A69F9", // Electric Indigo
  "#F26378", // Coral Red
  "#F5833F", // Orange Gold
  "#4ADE80", // Soft Green
  "#A78BFA", // Soft Lavender
  "#FB923C", // Warm Orange
  "#F472B6", // Bubblegum Pink
  "#818CF8", // Periwinkle
  "#FCD34D", // Sunny Yellow
];

const SankeyChart = ({ data }: SankeyChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<Chart | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!chartRef.current) return;

    if (instanceRef.current) {
      instanceRef.current.destroy();
    }

    const chartData: ChartData<
      "sankey",
      { from: string; to: string; flow: number }[]
    > = {
      labels: [],
      datasets: [
        {
          label: "Income Flow",
          data,
          borderWidth: 0,
          borderColor: "#000",
          colorFrom: (ctx) => {
            const dataset = ctx.chart.data.datasets[0].data as {
              from: string;
              to: string;
              flow: number;
            }[];
            const from = dataset[ctx.dataIndex]?.from ?? "";
            const hash = [...from].reduce(
              (acc, char) => acc + char.charCodeAt(0),
              0,
            );
            const color = colors[hash % colors.length];
            return color;
          },
          colorTo: (ctx) => {
            const dataset = ctx.chart.data.datasets[0].data as {
              from: string;
              to: string;
              flow: number;
            }[];
            const from = dataset[ctx.dataIndex]?.from ?? "";
            const hash = [...from].reduce(
              (acc, char) => acc + char.charCodeAt(0),
              0,
            );
            const baseColor = colors[hash % colors.length];
            return chroma(baseColor).brighten(1.5).hex();
          },

          nodePadding: 60,
        },
      ],
    };

    const chartOptions: ChartOptions<"sankey"> = {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      layout: { padding: 10 },
      color: theme === "dark" ? "#777777" : "#777777",
    };

    const chart = new Chart(chartRef.current, {
      type: "sankey",
      data: chartData,
      options: chartOptions,
    });

    chart.update();
    instanceRef.current = chart;

    return () => chart.destroy();
  }, [data, theme]);

  return (
    <MainMenusCompactCard
      className="w-full"
      header={
        <div className="text-sm font-medium text-center text-neutral-700 dark:text-neutral-300 py-1">
          Category Flow
        </div>
      }
    >
      <div className="relative w-full h-full">
        <canvas ref={chartRef} />
      </div>
    </MainMenusCompactCard>
  );
};

export default SankeyChart;
