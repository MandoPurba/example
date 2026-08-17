"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface DonutChartProps {
  data?: {
    labels?: string[];
    colors?: string[];
    series?: number[];
  };
}

export default function DonutChartOne({ data }: DonutChartProps) {
  const rawSeries = Array.isArray(data?.series)
    ? data.series.map((item) => Number(item ?? 0))
    : [];

  const total = rawSeries.reduce((a, b) => a + b, 0);
  const isEmpty = total === 0;

  const series = isEmpty ? [100] : rawSeries;
  const labels = isEmpty ? ["No Data"] : data?.labels ?? [];
  const colors = isEmpty ? ["#D1D5DB"] : data?.colors ?? [];

  const options: ApexOptions = {
    chart: {
      type: "donut",
      toolbar: {
        show: false,
      },
    },

    labels,

    colors,

    legend: {
      show: false,
    },

    dataLabels: {
      enabled: false,
    },

    stroke: {
      width: 0,
    },

    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,

            name: {
              show: true,
            },

            value: {
              show: true,
              formatter: () => (isEmpty ? "0" : ""),
            },

            total: {
              show: true,
              label: "Total",
              formatter: () =>
                isEmpty ? "0" : total.toLocaleString("id-ID"),
            },
          },
        },
      },
    },

    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: "100%",
          },
        },
      },
    ],
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
        {/* Chart */}
        <div className="flex w-full justify-center md:w-1/2">
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            width="100%"
            height={180}
          />
        </div>

        {/* Custom Legend */}
        <div className="w-full md:w-1/2">
          <div className="space-y-2">
            {labels.map((label, index) => (
              <div
                key={index}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: colors[index] ?? "#D1D5DB",
                    }}
                  />

                  <span className="text-sm font-medium text-gray-700">
                    {label}
                  </span>
                </div>

                <span className="font-semibold text-gray-900">
                  {isEmpty ? 0 : rawSeries[index]}
                </span>
              </div>
            ))}
          </div>

          {!isEmpty && (
            <div className="mt-4 flex justify-between border-t pt-4 text-sm font-bold">
              <span>Total</span>
              <span>{total.toLocaleString("id-ID")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}