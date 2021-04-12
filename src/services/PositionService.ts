/* 
Pie chart for positions, which position is biggest
Create account for allocations

When you select Symbol: 
	populates Create order symbol
	Opens Chart

Submit Order-> L2, Pos, Order
Stock Data
Symbol, open, %chang

Level 2: 
  Exchange, BID, qty
  Exchange, ASK, qty

Time in Sales(Tape) Exchange, price, qty  
*/

export enum PositionUpdateType {
  ADD = "ADD",
  UPDATE = "UPDATE",
  REMOVE = "REMOVE",
}

export interface IPosition {
  positionId: string;
  symbol: string;
  quantity: number;
  price: number;
  position: number;
}

interface INewOrder {
  side: Side;
  symbol: string;
  quantity: number;
  price: number;
  ordType: OrdType;
  tif: Tif;
}

interface IOrder extends INewOrder {
  orderId: string;
  orderDate: Date;
}

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

export enum Tif {
  DAY = "DAY",
  GTC = "GTC",
  OPG = "OPG",
  IOC = "IOC",
}

type IPositionUpdateObserver = (
  position: IPosition,
  updateType: PositionUpdateType
) => void;

class PositionService {
  Positions: IPosition[] = [];
  Orders: IOrder[] = [];
  private PositionUpdateobservers: IPositionUpdateObserver[] = [];
  NextOrderId: number = 0;
  NextPositionId: number = 0;

  GetAndIncrementNextOrderId = () => {
    const id = this.NextOrderId.toString();
    this.NextOrderId++;
    return id;
  };

  GetAndIncrementNextPositionId = () => {
    const id = this.NextPositionId.toString();
    this.NextPositionId++;
    return id;
  };

  NewOrder({
    side,
    symbol,
    quantity,
    price,
    ordType,
    tif = Tif.DAY,
  }: INewOrder) {
    try {
      const orderId = this.GetAndIncrementNextOrderId();
      const orderDate = new Date(Date.now());
      const order: IOrder = {
        side,
        symbol,
        quantity,
        price,
        ordType,
        tif,
        orderId,
        orderDate,
      };

      this.Orders.push(order);
      this.updatePosition(order);
    } catch (error) {}
  }

  private updatePosition(order: IOrder) {
    const foundPosition = this.Positions.find((p) => p.symbol === order.symbol);

    //UPDATE POSITION
    if (foundPosition) {
      if (order.side === Side.BUY) {
        foundPosition.price = order.price;
        foundPosition.quantity += order.quantity;
        foundPosition.position = foundPosition.quantity * order.price;

        this.raisePositionUpdateObserver(
          foundPosition,
          PositionUpdateType.UPDATE
        );
      } else if (order.side === Side.SELL) {
        if (foundPosition.quantity === order.quantity) {
          const positionToRemove = { ...foundPosition };
          this.Positions.splice(this.Positions.indexOf(foundPosition), 1);
          this.raisePositionUpdateObserver(
            positionToRemove,
            PositionUpdateType.REMOVE
          );
        } else if (foundPosition.quantity > order.quantity) {
          foundPosition.price = order.price;
          foundPosition.quantity -= order.quantity;
          foundPosition.position = foundPosition.quantity * order.price;

          this.raisePositionUpdateObserver(
            foundPosition,
            PositionUpdateType.UPDATE
          );
        } else {
          console.log("Cant sell more than you have");
        }
      } else {
        /*todo: SELLSHORT */
      }

      //Create new position
    } else {
      if (order.side === Side.BUY) {
        const initialPosition = order.quantity * order.price;

        const position: IPosition = {
          positionId: this.GetAndIncrementNextPositionId(),
          symbol: order.symbol,
          quantity: order.quantity,
          price: order.price,
          position: initialPosition,
        };

        this.Positions.push(position);
        this.raisePositionUpdateObserver(position, PositionUpdateType.ADD);
      } else {
        console.log("You cannot sell what you do not own.");
      }
    }
  }

  private raisePositionUpdateObserver(
    position: IPosition,
    updateType: PositionUpdateType
  ) {
    this.PositionUpdateobservers.forEach((fn) =>
      fn.call(this, position, updateType)
    );
  }

  onPositionUpdate(positionUpdateObserver: IPositionUpdateObserver) {
    console.log(
      "Service PositionUpdateobservers length: " +
        this.PositionUpdateobservers.length
    );
    if (this.PositionUpdateobservers.length < 2)
      this.PositionUpdateobservers.push(positionUpdateObserver);
  }
}

const defaultOrders: INewOrder[] = [
  {
    side: Side.BUY,
    symbol: "AAPL",
    quantity: 100,
    price: 30,
    ordType: OrdType.MARKET,
    tif: Tif.DAY,
  },
  {
    side: Side.BUY,
    symbol: "NFLX",
    quantity: 200,
    price: 40,
    ordType: OrdType.MARKET,
    tif: Tif.DAY,
  },
  {
    side: Side.BUY,
    symbol: "MSFT",
    quantity: 200,
    price: 50,
    ordType: OrdType.MARKET,
    tif: Tif.DAY,
  },
];

const positionService = new PositionService();
defaultOrders.forEach((x) => positionService.NewOrder(x));

export default positionService;
