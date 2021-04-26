import {
  Side,
  OrdType,
  Tif,
  IOrderUpdateEvent,
  TypeOfOrder,
  OrderUpdateType,
  IPosition,
  IParentOrder,
} from "./OrderService";
import { Subject, PartialObserver, Observable } from "rxjs";
import { filter } from "rxjs/operators";

export class PositionService2 {
  Positions: IPosition[] = [];
  private NextPositionId: number = 0;
  private OrderSubject: Subject<IOrderUpdateEvent>;

  PositionAdd!: Observable<IOrderUpdateEvent>;
  PositionUpdate!: Observable<IOrderUpdateEvent>;
  PositionRemove!: Observable<IOrderUpdateEvent>;

  constructor(orderSubject: Subject<IOrderUpdateEvent>) {
    this.OrderSubject = orderSubject;
    this.initObservables();
  }

  private initObservables() {
    this.PositionAdd = this.OrderSubject.pipe(
      filter(
        (x) =>
          x.typeOfOrder === TypeOfOrder.POSITION &&
          x.orderUpdateType === OrderUpdateType.ADD
      )
    );

    this.PositionUpdate = this.OrderSubject.pipe(
      filter(
        (x) =>
          x.typeOfOrder === TypeOfOrder.POSITION &&
          x.orderUpdateType === OrderUpdateType.UPDATE
      )
    );

    this.PositionRemove = this.OrderSubject.pipe(
      filter(
        (x) =>
          x.typeOfOrder === TypeOfOrder.POSITION &&
          x.orderUpdateType === OrderUpdateType.REMOVE
      )
    );
  }

  private GetAndIncrementNextPositionId = () => {
    const id = this.NextPositionId.toString();
    this.NextPositionId++;
    return id;
  };

  public createPositionObject(order: IParentOrder) {
    const initialPosition = order.orderQty * order.marketPrice;

    const position: IPosition = {
      positionId: this.GetAndIncrementNextPositionId(),
      symbol: order.symbol,
      quantity: order.orderQty,
      price: order.marketPrice,
      position: initialPosition,
    };
    return position;
  }

  //todo: get market price, maybe from final execution or market feed simulator
  public updatePosition(order: IParentOrder) {
    const foundPosition = this.Positions.find((p) => p.symbol === order.symbol);

    //UPDATE POSITION
    if (foundPosition) {
      if (order.side === Side.BUY) {
        foundPosition.price = order.marketPrice;
        foundPosition.quantity += order.orderQty;
        foundPosition.position = foundPosition.quantity * foundPosition.price;
        //RAISE UPDATE
      } else if (order.side === Side.SELL) {
        if (foundPosition.quantity === order.orderQty) {
          const positionToRemove = { ...foundPosition };
          this.Positions.splice(this.Positions.indexOf(foundPosition), 1);
          // RAISE REMOVE
        } else if (foundPosition.quantity > order.orderQty) {
          foundPosition.price = order.marketPrice;
          foundPosition.quantity -= order.orderQty;
          foundPosition.position = foundPosition.quantity * foundPosition.price;
          //RAISE UPDATE
        } else {
          console.log("Cant sell more than you have");
        }
      } else {
        /*todo: SELLSHORT */
      }

      //Create new position
    } else {
      if (order.side === Side.BUY) {
        const position = this.createPositionObject(order);
        this.Positions.push(position);
        //RAISE ADD
      } else {
        console.log("You cannot sell what you do not own.");
      }
    }
  }
}