import React, { useState } from "react";
import { Card, CardHeader, CardContent, TextField, makeStyles, createStyles, Theme, Button, Select, MenuItem } from "@material-ui/core";
import PositionService from "../services/PositionService";

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

  const [symbol, setSymbol] = useState<string>("AAPL");
  const [buysell, setbuysell] = useState<string>("BUY");
  const [qty, setQty] = useState<number>(1);
  const [price, setPrice] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    PositionService.add({ symbol, qty, price });
    e.preventDefault();
  };

  return (
    <div>
      <Card square>
        <CardHeader subheader={"Create an order"} title="Order Entry" />
        <CardContent>
          <form className={classes.root} onSubmit={handleSubmit}>
            <TextField label="Symbol" defaultValue="AAPL" variant="outlined" onChange={(e) => setSymbol(e.target.value)} />
            <Select
              onChange={(e) => setbuysell(e.target.value as string)}
              variant="outlined"
              value={buysell}
              style={{ width: "100%" }}
            >
              <MenuItem value="BUY">BUY</MenuItem>
              <MenuItem value="SELL">SELL</MenuItem>
            </Select>
            <TextField label="Quantity" type="number" variant="outlined" value={qty} InputLabelProps={{ shrink: true }} onChange={(e) => parseInt(e.target.value) > 0 ? setQty(parseInt(e.target.value)) : 0} />
            <TextField label="Price" type="number" variant="outlined" value={price} InputLabelProps={{ shrink: true }} onChange={(e) => parseInt(e.target.value) > 0 ? setPrice(parseInt(e.target.value)) : 0} />
            <br />
            <Button variant="outlined" type="submit" >SUBMIT</Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
}
