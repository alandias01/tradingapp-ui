import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import PositionService from "../services/PositionService";

export function CreateOrder() {
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
          <form onSubmit={handleSubmit}>
            <table>
              <tr>
                <td><label> Symbol:</label></td><td><input type="text" value={sym} onChange={labelSym_Change} /></td>
              </tr>
              <tr>
                <td><label> Qty:</label></td><td><input type="number" value={qty} onChange={labelQty_Change} /></td>
              </tr>
              <tr>
                <td><label> Price:</label></td><td><input type="number" value={price} onChange={labelPrice_Change} /></td>
              </tr>
            </table>
            <input type="submit" value="Submit" />
          </form>

        </CardContent>
      </Card>
    </div>
  );
}
