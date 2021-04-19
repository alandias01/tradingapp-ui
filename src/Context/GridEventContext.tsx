import React, { useState, useContext, createContext } from "react";
import { IChildOrder, IParentOrder } from "../services/OrderService";

export interface IGridEvent {
  rowSelectedParent?: IParentOrder[];
  rowSelectedChild?: IChildOrder[];
}

const GridEventContextDefaultValue: { gridEvent: IGridEvent, setGridEvent: (gridEvent: IGridEvent) => void } = {
  gridEvent: {},
  setGridEvent: (gridEvent: IGridEvent) => { },
};
const GridEventContext = createContext(
  GridEventContextDefaultValue
);

export function useGridEventContext() {
  return useContext(GridEventContext);
}

export const GridEventProvider: React.FC<{}> = ({ children }) => {
  const [gridEvent, setGridEvent] = useState<IGridEvent>(GridEventContextDefaultValue.gridEvent)
  return (
    <div>
      <GridEventContext.Provider value={{ gridEvent, setGridEvent }}>
        {children}
      </GridEventContext.Provider>
    </div>);
}
