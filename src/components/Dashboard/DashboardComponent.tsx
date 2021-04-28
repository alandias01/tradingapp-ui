import React from "react";
import { PositionComponent } from './PositionComponent';
import { SummaryComponent } from './SummaryComponent';

export const DashboardComponent = () => {
  return (
    <div style={{ height: "100%" }}>
      <SummaryComponent />
      <div style={{ height: "50%" }}>
        <PositionComponent />
      </div>
    </div >);
}