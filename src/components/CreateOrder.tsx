import React, { useState, useEffect } from "react";
import { FormControl, Card, CardHeader, CardContent, TextField, makeStyles, createStyles, Theme, Button, Select, InputLabel, MenuItem } from "@material-ui/core";
import PositionService, { Side, OrdType, Tif } from "../services/PositionService";
import { useSelectedSecurityContext } from '../Context/SelectedSecurityContext';

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

export function CreateOrder() {
  const classes = useStyles();
  const { selectedSecurity } = useSelectedSecurityContext();

  const [side, setSide] = useState<Side>(Side.BUY);
  const [symbol, setSymbol] = useState<string>(selectedSecurity.SYMBOL);
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(selectedSecurity.DefaultPrice);
  const [ordType, setOrdType] = useState<OrdType>(OrdType.MARKET);
  const [tif, setTif] = useState<Tif>(Tif.DAY);

  useEffect(() => {
    setSymbol(selectedSecurity.SYMBOL);
    setPrice(selectedSecurity.DefaultPrice);
  }, [selectedSecurity]);

  const handleSubmit = () => {
    PositionService.NewOrder({ side, symbol, quantity, price, ordType, tif });
  };

  return (
    <div>
      <Card square>
        <CardHeader subheader={"Create an order"} title="Order Entry" />
        <CardContent>
          <form className={classes.root}>

            <TextField label="Symbol" value={symbol} variant="outlined" onChange={(e) => setSymbol(e.target.value)} />
            <FormControl variant="outlined">
              <InputLabel>Side</InputLabel>
              <Select
                label="Age"
                onChange={(e) => setSide(e.target.value as Side)}
                variant="outlined"
                value={side}
              // style={{ width: "100%" }}
              >
                <MenuItem key={Side.BUY} value={Side.BUY}>BUY</MenuItem>
                <MenuItem key={Side.SELL} value={Side.SELL}>SELL</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Quantity" type="number" variant="outlined" value={quantity} InputLabelProps={{ shrink: true }} onChange={(e) => parseInt(e.target.value) > 0 ? setQuantity(parseInt(e.target.value)) : 0} />
            <TextField label="Price" type="number" variant="outlined" value={price} InputLabelProps={{ shrink: true }} onChange={(e) => parseInt(e.target.value) > 0 ? setPrice(parseInt(e.target.value)) : 0} />
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
            <Button variant="outlined" onClick={handleSubmit} >SUBMIT</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
