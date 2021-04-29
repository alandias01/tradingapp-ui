import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Typography } from "@material-ui/core";
import { useSelectedSecurityContext } from '../Context/SelectedSecurityContext';
import realtTimeMarketData from '../services/RealTimeMarketData';
import { ISecurityMasterService } from "../services/SecurityMasterService";

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
    xaxis: {
      range: 4
    },
    yaxis: {
      min: selectedSecurity.DefaultPrice - 10,
      max: selectedSecurity.DefaultPrice + 10
      // title: {
      //   text: 'Price'
      // },

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
    tooltip: {
      theme: "dark"
    }
  });

  const [series, setSeries] = useState([{ name: selectedSecurity.SYMBOL, data: [selectedSecurity.DefaultPrice] }]);
  const [realtTimeUpdateSnapshot, setRealtTimeUpdateSnapshot] = useState<ISecurityMasterService[]>();

  useEffect(() => {
    realtTimeMarketData.stockPrices.subscribe((s) => setRealtTimeUpdateSnapshot(s));
    return () => realtTimeMarketData.stockPrices.unsubscribe();
  }, [])

  useEffect(() => {
    const securityFound = realtTimeUpdateSnapshot?.find(s => s.SYMBOL === selectedSecurity.SYMBOL);
    if (!securityFound)
      return;

    setSeries(x => {
      const newData = [{
        name: selectedSecurity.SYMBOL,
        data: [...x[0].data, securityFound?.DefaultPrice]
      }];
      return newData;
    });

    setOptions(x => {
      const newOptions = { ...x, yaxis: { min: selectedSecurity.DefaultPrice - 10, max: selectedSecurity.DefaultPrice + 10 } };
      return newOptions;
    });

  }, [realtTimeUpdateSnapshot, selectedSecurity.SYMBOL])

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
