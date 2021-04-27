import algoService from "./AlgoService";
import executionService from "./ExecutionService";
import { PositionService } from "./PositionService";
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

export interface IPosition {
  positionId: string;
  symbol: string;
  quantity: number;
  price: number;
  position: number;
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
  parentCumQty: number;
  parentLeavesQty: number;
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
  POSITION = "POSITION",
}

export enum OrderUpdateType {
  ADD = "ADD",
  UPDATE = "UPDATE",
  REMOVE = "REMOVE",
}

export interface IOrderUpdateEvent {
  typeOfOrder: TypeOfOrder;
  orderUpdateType: OrderUpdateType;
  payload: IPosition | IParentOrder | IChildOrder | IExecutionOrder;
}

class OrderService {
  private NextOrderId: number = 0;
  private myPromise: Promise<number> = Promise.resolve(0);
  private OrderSubject: Subject<IOrderUpdateEvent> = new Subject<IOrderUpdateEvent>();
  private positionservice: PositionService;

  Positions: IPosition[];
  ParentOrders: IParentOrder[] = [];
  ChildOrders: IChildOrder[] = [];
  ExecutionOrders: IExecutionOrder[] = [];

  ExecutionAdd!: Observable<IOrderUpdateEvent>;
  ChildAdd!: Observable<IOrderUpdateEvent>;
  ChildUpdate!: Observable<IOrderUpdateEvent>;
  ParentAdd!: Observable<IOrderUpdateEvent>;
  ParentUpdate!: Observable<IOrderUpdateEvent>;
  PositionAdd!: Observable<IOrderUpdateEvent>;
  PositionUpdate!: Observable<IOrderUpdateEvent>;
  PositionRemove!: Observable<IOrderUpdateEvent>;

  constructor() {
    this.positionservice = new PositionService(this.OrderSubject);
    this.initObservables();
    this.Positions = this.positionservice.Positions;
  }

  private initObservables() {
    this.PositionAdd = this.positionservice.PositionAdd;
    this.PositionUpdate = this.positionservice.PositionUpdate;
    this.PositionRemove = this.positionservice.PositionRemove;

    this.ExecutionAdd = this.OrderSubject.pipe(
      filter(
        (x) =>
          x.typeOfOrder === TypeOfOrder.EXECUTION &&
          x.orderUpdateType === OrderUpdateType.ADD
      )
    );

    this.ChildAdd = this.OrderSubject.pipe(
      filter(
        (x) =>
          x.typeOfOrder === TypeOfOrder.CHILD &&
          x.orderUpdateType === OrderUpdateType.ADD
      )
    );

    this.ChildUpdate = this.OrderSubject.pipe(
      filter(
        (x) =>
          x.typeOfOrder === TypeOfOrder.CHILD &&
          x.orderUpdateType === OrderUpdateType.UPDATE
      )
    );

    this.ParentAdd = this.OrderSubject.pipe(
      filter(
        (x) =>
          x.typeOfOrder === TypeOfOrder.PARENT &&
          x.orderUpdateType === OrderUpdateType.ADD
      )
    );
    this.ParentUpdate = this.OrderSubject.pipe(
      filter(
        (x) =>
          x.typeOfOrder === TypeOfOrder.PARENT &&
          x.orderUpdateType === OrderUpdateType.UPDATE
      )
    );
  }

  private GetAndIncrementNextOrderId = () => {
    const id = this.NextOrderId.toString();
    this.NextOrderId++;
    return id;
  };

  private applyExecutionToChildOrder(execution: IExecutionOrder) {
    const foundChildOrder = this.ChildOrders.find(
      (co) => co.childId === execution.childId
    );

    if (!foundChildOrder) return;

    foundChildOrder.ordStatus = execution.ordStatus;
    foundChildOrder.filledQty = execution.cumQty;
    foundChildOrder.unfilledQty = execution.leavesQty;
    foundChildOrder.avgPrice = execution.avgPx;
    const childrenOfParent = this.ChildOrders.filter(
      (x) => x.parentId === foundChildOrder.parentId
    );

    const sum = childrenOfParent
      ?.map((x) => x.filledQty)
      .reduce((x, y) => x + y);
    childrenOfParent?.forEach((x) => (x.parentCumQty = sum));
    foundChildOrder.parentCumQty = sum;

    const sumLeaves = childrenOfParent
      ?.map((x) => x.unfilledQty)
      .reduce((x, y) => x + y);
    childrenOfParent?.forEach((x) => (x.parentLeavesQty = sumLeaves));
    foundChildOrder.parentLeavesQty = sumLeaves;

    const orderEvent: IOrderUpdateEvent = {
      typeOfOrder: TypeOfOrder.CHILD,
      orderUpdateType: OrderUpdateType.UPDATE,
      payload: foundChildOrder,
    };
    this.OrderSubject.next(orderEvent);

    this.applyChildUpdateToParentOrder(foundChildOrder);
  }

  private applyChildUpdateToParentOrder(childOrder: IChildOrder) {
    const foundParentOrder = this.ParentOrders.find(
      (po) => po.parentId === childOrder.parentId
    );

    if (!foundParentOrder) return;
    foundParentOrder.filledQty = childOrder.parentCumQty;
    foundParentOrder.unfilledQty = childOrder.parentLeavesQty;
    if (foundParentOrder.orderQty === foundParentOrder.filledQty) {
      foundParentOrder.isFilled = "Y";
    }

    const orderEvent: IOrderUpdateEvent = {
      typeOfOrder: TypeOfOrder.PARENT,
      orderUpdateType: OrderUpdateType.UPDATE,
      payload: foundParentOrder,
    };
    this.OrderSubject.next(orderEvent);
  }

  public createDummyPositionObject = (order: IParentOrder) =>
    this.positionservice.createPositionObject(order);

  public createParentOrderObject(newOrder: INewOrder) {
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
      unfilledQty: orderQty,
      isFilled: "N",
      marketPrice: 0,
      position: 0,
      tradeDate,
    };

    return newParentOrder;
  }

  private addToExecutions(order: IExecutionOrder) {
    this.ExecutionOrders.push(order);

    const orderEvent: IOrderUpdateEvent = {
      typeOfOrder: TypeOfOrder.EXECUTION,
      orderUpdateType: OrderUpdateType.ADD,
      payload: order,
    };

    this.myPromise = this.myPromise.then(async () => {
      await TaskDelay(300);
      this.OrderSubject.next(orderEvent);
      this.applyExecutionToChildOrder(order);
      return 1;
    });
  }

  private addToChildOrders(order: IChildOrder) {
    this.ChildOrders.push(order);
    const orderEvent: IOrderUpdateEvent = {
      typeOfOrder: TypeOfOrder.CHILD,
      orderUpdateType: OrderUpdateType.ADD,
      payload: order,
    };
    this.OrderSubject.next(orderEvent);
  }

  private addToParentOrders(parentOrder: IParentOrder) {
    this.ParentOrders.push(parentOrder);
    const addParentOrderEvent: IOrderUpdateEvent = {
      typeOfOrder: TypeOfOrder.PARENT,
      orderUpdateType: OrderUpdateType.ADD,
      payload: parentOrder,
    };
    this.OrderSubject.next(addParentOrderEvent);
  }

  public NewOrder(newOrder: INewOrder) {
    try {
      const newParentOrder: IParentOrder = this.createParentOrderObject(
        newOrder
      );

      this.addToParentOrders(newParentOrder);
      this.positionservice.updatePosition(newParentOrder);

      if (newOrder.algo !== Algo.NONE) {
        const childOrders = algoService.ProcessAlgoOrder(newParentOrder);
        childOrders.forEach((co) => this.addToChildOrders(co));

        childOrders.forEach((childOrder) => {
          const executionOrders = executionService.CreateExecutions(childOrder);
          executionOrders.forEach((eo) => this.addToExecutions(eo));
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
//defaultParentOrders.forEach((x) => orderService.NewOrder(x));

export const dummyParentOrder = orderService.createParentOrderObject(
  defaultParentOrders[0]
);

export const dummyPositionOrder = orderService.createDummyPositionObject(
  dummyParentOrder
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
