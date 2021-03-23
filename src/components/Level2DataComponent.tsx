import React from "react";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";
import { Level2Data } from "../services/ServiceApi";

export const Level2DataComponent = () => {
  const data = Level2Data("AAPL");
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
