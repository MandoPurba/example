"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlySalesChart() {
  const options: ApexOptions = {
    colors: ["#465fff", "#16C47F", "#F59E0B", "#EF4444"],

    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },

plotOptions: {
  bar: {
    horizontal: false,

    columnWidth: "55%",
    borderRadius: 5,
    borderRadiusApplication: "end",
  },
},

    dataLabels: {
      enabled: false,
    },

    stroke: {
      show: false,
    },

    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],

      axisBorder: {
        show: false,
      },

      axisTicks: {
        show: false,
      },
    },

    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,

      labels: {
        formatter: (val: number) => `${val}`,
      },
    },

    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },

    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },

    fill: {
      opacity: 1,
    },

    tooltip: {
      y: {
        formatter: (val: number) => `${val} / 100`,
      },
    },
  };

  // 4 Branch performance per month
  const series = [
    {
      name: "Branch A",
      data: [85, 78, 90, 88, 76, 80, 92, 87, 84, 91, 89, 95],
    },
    {
      name: "Branch B",
      data: [70, 74, 68, 80, 82, 79, 75, 77, 81, 85, 83, 86],
    },
    {
      name: "Branch C",
      data: [60, 65, 72, 70, 74, 78, 80, 82, 79, 77, 84, 88],
    },
    {
      name: "Branch D",
      data: [90, 88, 85, 87, 91, 93, 95, 92, 90, 94, 96, 98],
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Performance Branch
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[800px]">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={300}
          />
        </div>
      </div>
    </div>
  );
}