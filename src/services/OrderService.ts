import algoService from "./AlgoService";
import executionService from "./ExecutionService";
import { Subject, PartialObserver, Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { TaskDelay } from "../utils/util";

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
  avgPx: number;
  currency: string;
  tradeDate: Date;
  transactTime: string;
}

export enum TypeOfOrder {
  PARENT = "PARENT",
  CHILD = "CHILD",
  EXECUTION = "EXECUTION",
}

export enum OrderUpdateType {
  ADD = "ADD",
  UPDATE = "UPDATE",
  REMOVE = "REMOVE",
}

export interface IOrderUpdateEvent {
  typeOfOrder: TypeOfOrder;
  orderUpdateType: OrderUpdateType;
  payload: IParentOrder | IChildOrder | IExecutionOrder;
}

class OrderService {
  ParentOrders: IParentOrder[] = [];
  ChildOrders: IChildOrder[] = [];
  ExecutionOrders: IExecutionOrder[] = [];

  ExecutionAdd: Observable<IOrderUpdateEvent>;

  constructor() {
    this.ExecutionAdd = this.OrderSubject.pipe(
      filter(
        (x) =>
          x.typeOfOrder === TypeOfOrder.EXECUTION &&
          x.orderUpdateType === OrderUpdateType.ADD
      )
    );
  }

  OrderSubject: Subject<IOrderUpdateEvent> = new Subject<IOrderUpdateEvent>();

  private NextOrderId: number = 0;

  private GetAndIncrementNextOrderId = () => {
    const id = this.NextOrderId.toString();
    this.NextOrderId++;
    return id;
  };

  public createParentOrder(newOrder: INewOrder) {
    const parentId = this.GetAndIncrementNextOrderId();
    const tradeDate = new Date(Date.now());
    const { moniker, symbol, side, algo, ordType, orderQty, tif } = newOrder;

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

    return newParentOrder;
  }

  private applyExecutionToChildOrder(execution: IExecutionOrder) {
    const foundChildOrder = this.ChildOrders.find(
      (co) => co.childId === execution.childId
    );
    if (!foundChildOrder) return;

    foundChildOrder.ordStatus = execution.ordStatus;
    foundChildOrder.filledQty = execution.cumQty;
    foundChildOrder.unfilledQty = execution.leavesQty;
  }

  public NewParentOrder(newOrder: INewOrder) {
    try {
      const newParentOrder: IParentOrder = this.createParentOrder(newOrder);

      this.ParentOrders.push(newParentOrder);

      if (newOrder.algo !== Algo.NONE) {
        const childOrders = algoService.ProcessAlgoOrder(newParentOrder);
        childOrders.forEach((x) => this.ChildOrders.push(x));

        childOrders.forEach((childOrder) => {
          const executionOrders = executionService.CreateExecutions(childOrder);
          executionOrders.forEach((x) => {
            this.ExecutionOrders.push(x);
            //this.applyExecutionToChildOrder(x);

            //todo: Since applyExecutionToChildOrder() is updating the grid quickly, the below publish updates the grid again
            //Send a complete msg to the component to notify when it can start accepting updates

            const orderEvent: IOrderUpdateEvent = {
              typeOfOrder: TypeOfOrder.EXECUTION,
              orderUpdateType: OrderUpdateType.ADD,
              payload: x,
            };
            this.addExecution(orderEvent);
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  myPromise: Promise<number> = Promise.resolve(0);

  addExecution(orderEvent: IOrderUpdateEvent) {
    this.myPromise = this.myPromise.then(async () => {
      await TaskDelay(100);
      this.OrderSubject.next(orderEvent);
      return 1;
    });
  }
}

const defaultParentOrders: INewOrder[] = [
  {
    moniker: Moniker.JPM,
    symbol: "NFLX",
    side: Side.BUY,
    algo: Algo.BLOCK,
    orderQty: 150,
    ordType: OrdType.MARKET,
    tif: Tif.DAY,
  },
  {
    moniker: Moniker.MAPL,
    symbol: "JPM",
    side: Side.BUY,
    algo: Algo.BLOCK,
    orderQty: 350,
    ordType: OrdType.MARKET,
    tif: Tif.DAY,
  },
  {
    moniker: Moniker.MORG,
    symbol: "AAPL",
    side: Side.BUY,
    algo: Algo.BLOCK,
    orderQty: 950,
    ordType: OrdType.MARKET,
    tif: Tif.DAY,
  },
];

const orderService = new OrderService();
defaultParentOrders.forEach((x) => orderService.NewParentOrder(x));

export const dummyParentOrder = orderService.createParentOrder(
  defaultParentOrders[0]
);
export const dummyChildOrder = algoService.createChildOrder(
  dummyParentOrder,
  0
);

export const dummyExecutionOrder = executionService.createExecutionOrder(
  dummyChildOrder,
  0,
  0,
  0,
  0,
  0,
  OrdStatus.NEW
);

export default orderService;
