import algoService from "./AlgoService";
import executionService from "./ExecutionService";

export enum Side {
  BUY = "BUY",
  SELL = "SELL",
  SHORT = "SHORT",
}

export enum OrdType {
  MARKET = "MARKET",
  LIMIT = "LIMIT",
  STOP = "STOP",
  STOPLIMIT = "STOPLIMIT",
}

export enum OrdStatus {
  NEW = "NEW",
  PARTIALLYFILLED = "PARTIALLY FILLED",
  FILLED = "FILLED",
  CANCELLED = "CANCELLED",
}

export enum Tif {
  DAY = "DAY",
  GTC = "GTC",
  OPG = "OPG",
  IOC = "IOC",
}

export enum Moniker {
  JPM = "JPM",
  GS = "GS",
  MORG = "MORG",
  VIRT = "VIRT",
  MAPL = "MAPL",
}

export enum Algo {
  NONE = "NONE",
  BLOCK = "BLOCK",
  TWAP = "TWAP",
  VWAP = "VWAP",
}

export interface INewOrder {
  moniker: Moniker;
  symbol: string;
  side: Side;
  algo: Algo;
  ordType: OrdType;
  orderQty: number;
  tif: Tif;
}

export interface IParentOrder extends INewOrder {
  parentId: string;
  filledQty: number;
  unfilledQty: number;
  isFilled: string;
  marketPrice: number;
  position: number;
  tradeDate: Date;
}

export interface IChildOrder {
  childId: string;
  parentId: string;
  moniker: Moniker;
  symbol: string;
  side: Side;
  ordType: OrdType;
  ordStatus: OrdStatus;
  orderQty: number;
  filledQty: number;
  unfilledQty: number;
  avgPrice: number;
  tradeDate: Date;
  tif: Tif;
}

export interface IExecutionOrder {
  execId: string;
  childId: string;
  symbol: string;
  side: Side;
  ordStatus: OrdStatus;
  orderQty: number;
  cumQty: number;
  leavesQty: number;
  lastQty: number;
  lastPx: number;
  currency: string;
  tradeDate: Date;
  transactTime: string;
}

class OrderService {
  ParentOrders: IParentOrder[] = [];
  ChildOrders: IChildOrder[] = [];
  ExecutionOrders: IExecutionOrder[] = [];

  private NextOrderId: number = 0;

  private GetAndIncrementNextOrderId = () => {
    const id = this.NextOrderId.toString();
    this.NextOrderId++;
    return id;
  };

  public NewParentOrder(newOrder: INewOrder) {
    try {
      const { moniker, symbol, side, algo, ordType, orderQty, tif } = newOrder;
      const parentId = this.GetAndIncrementNextOrderId();
      const tradeDate = new Date(Date.now());

      const newParentOrder: IParentOrder = {
        parentId,
        moniker,
        symbol,
        side,
        algo,
        ordType,
        orderQty,
        tif,
        filledQty: 0,
        unfilledQty: 0,
        isFilled: "N",
        marketPrice: 0,
        position: 0,
        tradeDate,
      };

      this.ParentOrders.push(newParentOrder);

      if (newOrder.algo !== Algo.NONE) {
        const childOrders = algoService.ProcessAlgoOrder(newParentOrder);
        childOrders.forEach((x) => this.ChildOrders.push(x));

        childOrders.forEach((childOrder) => {
          const executionOrders = executionService.CreateExecutions(childOrder);
          executionOrders.forEach((x) => this.ExecutionOrders.push(x));
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const defaultParentOrders: INewOrder[] = [
  {
    moniker: Moniker.JPM,
    symbol: "NFLX",
    side: Side.BUY,
    algo: Algo.BLOCK,
    orderQty: 100,
    ordType: OrdType.MARKET,
    tif: Tif.DAY,
  },
  {
    moniker: Moniker.MAPL,
    symbol: "JPM",
    side: Side.BUY,
    algo: Algo.BLOCK,
    orderQty: 100,
    ordType: OrdType.MARKET,
    tif: Tif.DAY,
  },
  {
    moniker: Moniker.MORG,
    symbol: "AAPL",
    side: Side.BUY,
    algo: Algo.BLOCK,
    orderQty: 100,
    ordType: OrdType.MARKET,
    tif: Tif.DAY,
  },
];

const orderService = new OrderService();
defaultParentOrders.forEach((x) => orderService.NewParentOrder(x));

export default orderService;
