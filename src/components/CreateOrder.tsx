import React, { useState, useEffect } from "react";
import { FormControl, Card, CardHeader, CardContent, TextField, makeStyles, createStyles, Theme, Button, Select, InputLabel, MenuItem } from "@material-ui/core";

import orderService, { Algo, Moniker, Side, OrdType, Tif } from '../services/OrderService';
import { useSelectedSecurityContext } from '../Context/SelectedSecurityContext';
import { ViewType } from "./Main";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '100%',
      },
    },
  }),
);

export function CreateOrder(props: { view: ViewType }) {
  const classes = useStyles();
  const { selectedSecurity } = useSelectedSecurityContext();

  const [moniker, setMoniker] = useState(Moniker.JPM);
  const [symbol, setSymbol] = useState<string>(selectedSecurity.SYMBOL);
  const [side, setSide] = useState<Side>(Side.BUY);
  const [algo, setAlgo] = useState(Algo.BLOCK)
  const [ordType, setOrdType] = useState<OrdType>(OrdType.MARKET);
  const [orderQty, setOrderQty] = useState<number>(160);
  const [tif, setTif] = useState<Tif>(Tif.DAY);

  useEffect(() => {
    setSymbol(selectedSecurity.SYMBOL);
  }, [selectedSecurity]);

  const handleSubmit = () => {
    orderService.NewOrder({ moniker, symbol, side, algo, ordType, orderQty, tif });
  };

  //const submitEnabled = () => props.view !== ViewType.ORDERS;
  const submitEnabled = () => false;

  return (
    <div>
      <Card square>
        <CardHeader subheader={"Create an order"} title="Order Entry" />
        <CardContent>
          <form className={classes.root}>

            <TextField disabled label="Symbol" value={symbol} variant="outlined" onChange={(e) => setSymbol(e.target.value)} />

            <FormControl variant="outlined">
              <InputLabel >Moniker</InputLabel>
              <Select
                label="Moniker"
                onChange={(e) => setMoniker(e.target.value as Moniker)}
                variant="outlined"
                value={moniker}
              >
                {Object.keys(Moniker).map(x => <MenuItem key={x} value={x}>{x}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl variant="outlined">
              <InputLabel >Algo</InputLabel>
              <Select
                label="Algo"
                onChange={(e) => setAlgo(e.target.value as Algo)}
                variant="outlined"
                value={algo}
              >
                {Object.keys(Algo).map(x => <MenuItem key={x} value={x}>{x}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl variant="outlined">
              <InputLabel>Side</InputLabel>
              <Select
                label="Side"
                onChange={(e) => setSide(e.target.value as Side)}
                variant="outlined"
                value={side}
              >
                <MenuItem key={Side.BUY} value={Side.BUY}>BUY</MenuItem>
                <MenuItem key={Side.SELL} value={Side.SELL}>SELL</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Quantity" type="number" variant="outlined" value={orderQty} InputLabelProps={{ shrink: true }} onChange={(e) => parseInt(e.target.value) > 0 ? setOrderQty(parseInt(e.target.value)) : 0} />

            <FormControl variant="outlined">
              <InputLabel >Order Type</InputLabel>
              <Select
                label="Order Type"
                onChange={(e) => setOrdType(e.target.value as OrdType)}
                variant="outlined"
                value={ordType}
              >
                {Object.keys(OrdType).map(x => <MenuItem key={x} value={x}>{x}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl variant="outlined">
              <InputLabel >Time in Force</InputLabel>
              <Select
                label="Time in Force"
                onChange={(e) => setTif(e.target.value as Tif)}
                variant="outlined"
                value={tif}
              >
                {Object.keys(Tif).map(x => <MenuItem key={x} value={x}>{x}</MenuItem>)}
              </Select>
            </FormControl>
            <Button variant="outlined" onClick={handleSubmit} disabled={submitEnabled()} >SUBMIT</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
