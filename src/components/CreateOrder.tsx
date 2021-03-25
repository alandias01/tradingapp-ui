import React, { useState } from "react";
import { Card, CardHeader, CardContent, TextField, makeStyles, createStyles, Theme, Button } from "@material-ui/core";
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

  const [sym, setSym] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [price, setPrice] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    PositionService.add({ symbol: sym, qty, price });
    e.preventDefault();
  };

  const labelSym_Change = (e: React.ChangeEvent<HTMLInputElement>) => setSym(e.target.value);
  const labelQty_Change = (e: React.ChangeEvent<HTMLInputElement>) => setQty(parseInt(e.target.value));
  const labelPrice_Change = (e: React.ChangeEvent<HTMLInputElement>) => setPrice(parseInt(e.target.value));

  return (
    <div>
      <Card square>
        <CardHeader subheader={"Create an order"} title="Order Entry" />
        <CardContent>
          <form className={classes.root} onSubmit={handleSubmit}>
            <TextField label="Symbol" defaultValue="AAPL" variant="outlined" onChange={labelSym_Change} />
            <TextField label="Quantity" type="number" variant="outlined" InputLabelProps={{ shrink: true }} onChange={labelQty_Change} />
            <TextField label="Price" type="number" variant="outlined" InputLabelProps={{ shrink: true }} onChange={labelPrice_Change} />
            <br />
            <Button variant="outlined" type="submit" >SUBMIT</Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
}
