import React, { useState, useEffect } from "react";
import { IPosition } from "../../services/OrderService";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Typography } from "@material-ui/core";


export const PositionChartComponent = (props: { positions: IPosition[], positionCount: number }) => {
  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      id: "reactchart-example",
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
    labels: [""],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            value: {
              color: "white"
            },
            total: {
              show: true,
              showAlways: true,
              label: "Position Value",
              color: "white"
            }
          }
        }

      }
    }
  });
  const [series, setSeries] = useState<number[]>([1]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setOptions(x => ({ ...x, labels: props.positions?.map(x => x.symbol) }));
      setSeries(props.positions?.map(x => x.position));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [])

  return (
    <div>
      <Typography variant="h6">POSITIONS: {props.positionCount}</Typography>
      <Chart
        options={options}
        series={series}
        type="donut"
      //width={500}
      />
    </div>
  )

}
