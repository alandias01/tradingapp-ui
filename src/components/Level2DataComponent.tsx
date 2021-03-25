import React from "react";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";
import { Level2DataService } from "../services/Level2DataService";

export const Level2DataComponent = () => {
  const data = Level2DataService("AAPL");
  return (
    <div>
      <Card square>
        <CardHeader subheader={"AAPL"} title="BID / ASK" />
        <CardContent>
          {data.map((x, i) => (
            <div key={i}>
              {x.participant} {x.qty} {x.price}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
