import React, { useState, useEffect } from "react";
import { IPosition } from "../../services/OrderService";
import Chart from "react-apexcharts";

interface IOption {
  chart: { id: string };
  labels: string[];
}

export const PositionChartComponent = (props: { positions: IPosition[], positionCount: number }) => {
  const [options, setOptions] = useState<IOption>({
    chart: {
      id: "reactchart-example"
    },
    labels: []

  });
  const [series, setSeries] = useState<number[]>();

  useEffect(() => {
    setOptions(x => ({ ...x, labels: props.positions.map(x => x.symbol) }));
    setSeries(props.positions.map(x => x.quantity));

  }, [props.positionCount])

  return (
    <div>
      <Chart
        options={options}
        series={series}
        type="pie"
        width={500}
      />
    </div>
  )

}
