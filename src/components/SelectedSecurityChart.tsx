import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Typography } from "@material-ui/core";
import { useSelectedSecurityContext } from '../Context/SelectedSecurityContext';

export const SelectedSecurityChart = () => {
  const { selectedSecurity } = useSelectedSecurityContext();

  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      type: 'area',
      stacked: false,
      //height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom'
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },
    // title: {
    //   text: 'Stock Price Movement',
    //   align: 'left'
    // },
    // fill: {
    //   type: 'gradient',
    //   gradient: {
    //     shadeIntensity: 1,
    //     inverseColors: false,
    //     opacityFrom: 0.5,
    //     opacityTo: 0,
    //     stops: [0, 90, 100]
    //   },
    // },
    // yaxis: {
    //   title: {
    //     text: 'Price'
    //   },
    // },
    tooltip: {
      theme: "dark"
    }
  });

  const [series, setSeries] = useState([{
    name: 'XYZ MOTORS',
    data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
  }]);

  useEffect(() => {

  }, [])

  return (
    <div>
      <Typography variant="h6">{selectedSecurity.SYMBOL}</Typography>
      <Chart
        options={options}
        series={series}
        type="area"
      />
    </div>
  )
}
