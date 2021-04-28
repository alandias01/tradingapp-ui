import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Typography } from "@material-ui/core";

export const OrderChartComponent = (props: { parentOrderCount: number, childOrderCount: number, executionOrderCount: number }) => {
  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      id: "OrderChartComponent",
      animations: {
        enabled: false
      }
    },
    legend: {
      position: "bottom",
      labels: {
        colors: "white"
      }
    },
    stroke: {
      show: false
    },
    dataLabels: {
      formatter: (val, opts) => {
        return opts.w.config.series[opts.seriesIndex];
      }
    },
    labels: ["Parent", "Child", "Executions"],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            value: {
              color: "white"
            }
          }
        }
      }
    }
  });
  const [series, setSeries] = useState<number[]>([1]);

  useEffect(() => {
    setSeries([props.parentOrderCount, props.childOrderCount, props.executionOrderCount]);
  }, [props.parentOrderCount, props.childOrderCount, props.executionOrderCount])

  return (
    <div>
      <Typography variant="h6">ORDERS</Typography>
      <Chart
        options={options}
        series={series}
        type="donut"
      />
    </div>
  )
}
