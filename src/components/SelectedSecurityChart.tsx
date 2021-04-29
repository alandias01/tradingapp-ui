import React, { useState, useEffect, useReducer } from "react";
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
    tooltip: {
      theme: "dark"
    }
  });

  const [series, setSeries] = useState([{ name: selectedSecurity.SYMBOL, data: [selectedSecurity.DefaultPrice] }]);

  function reducer(state: ISecurityMasterService, action: { type: string, payload: ISecurityMasterService[] }): ISecurityMasterService {
    if (action.type === "update") {
      const securityFound = action.payload.find(r => r.SYMBOL === selectedSecurity.SYMBOL);
      if (securityFound) {
        setSeries(x => {
          const newData = [{
            name: selectedSecurity.SYMBOL,
            data: [...x[0].data, realtTimeUpdateSnapshot.DefaultPrice]
          }];
          return newData;
        });

        setOptions(x => {
          const newOptions = { ...x, yaxis: { min: selectedSecurity.DefaultPrice - 10, max: selectedSecurity.DefaultPrice + 10 } };
          return newOptions;
        });
        return securityFound;
      }
    }
    return { SYMBOL: "AAPL", DefaultPrice: 120 };
  }

  const [realtTimeUpdateSnapshot, dispatch] = useReducer(reducer, { SYMBOL: selectedSecurity.SYMBOL, DefaultPrice: selectedSecurity.DefaultPrice });

  useEffect(() => {
    realtTimeMarketData.stockPrices.subscribe((realTimeData) => {
      dispatch({ type: "update", payload: realTimeData });
    });
    return () => realtTimeMarketData.stockPrices.unsubscribe();
  }, []);

  return (
    <div>
      <Typography variant="h6" display="block">{selectedSecurity.SYMBOL} ({selectedSecurity.Description})</Typography>
      <Typography variant="overline" display="inline" >NasdaqGS - NasdaqGS Real Time</Typography>
      <br />
      <Typography variant="h2" display="inline">{realtTimeUpdateSnapshot.DefaultPrice}</Typography>
      <Typography variant="overline" display="inline" >LIVE</Typography>

      <Chart
        options={options}
        series={series}
        type="area"
      />
    </div>
  )
}
