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

export interface IPosition {
  symbol: string;
  quantity: number;
  initialPrice: number;
  initialPosition: number;
  currentPrice: number;
  currentPosition: number;
  pnl: number;
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
  orderId: number;
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

type IPositionUpdateObserver = (position: IPosition) => void;

class PositionService {
  Positions: IPosition[] = [];
  Orders: IOrder[] = [];
  private PositionUpdateobservers: IPositionUpdateObserver[] = [];

  NewOrder({
    side,
    symbol,
    quantity,
    price,
    ordType,
    tif = Tif.DAY,
  }: INewOrder) {
    try {
      const orderId = new Date().getUTCMilliseconds();
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
        foundPosition.quantity += order.quantity;
        foundPosition.initialPosition =
          foundPosition.quantity * foundPosition.initialPrice;

        foundPosition.currentPrice = order.price;

        foundPosition.currentPosition =
          foundPosition.quantity * foundPosition.currentPrice;

        foundPosition.pnl =
          foundPosition.currentPosition - foundPosition.initialPosition;
      } else if (order.side === Side.SELL) {
        foundPosition.quantity > order.quantity
          ? (foundPosition.quantity -= order.quantity)
          : console.log("Cant sell more than you have");

        foundPosition.initialPosition =
          foundPosition.quantity * foundPosition.initialPrice;

        foundPosition.currentPrice = order.price;

        foundPosition.currentPosition =
          foundPosition.quantity * foundPosition.currentPrice;

        foundPosition.pnl =
          foundPosition.currentPosition - foundPosition.initialPosition;
      } else {
        /*todo: SELLSHORT */
      }
      this.raisePositionUpdateObserver(foundPosition);

      //Create new position
    } else {
      if (order.side === Side.BUY) {
        const initialPosition = order.quantity * order.price;

        const position: IPosition = {
          symbol: order.symbol,
          quantity: order.quantity,
          initialPrice: order.price,
          initialPosition,
          currentPrice: order.price,
          currentPosition: initialPosition,
          pnl: 0,
        };

        this.Positions.push(position);
        this.raisePositionUpdateObserver(position);
      } else {
        console.log("You cannot sell what you do not own.");
      }
    }
  }

  private raisePositionUpdateObserver(position: IPosition) {
    this.PositionUpdateobservers.forEach((fn) => fn.call(this, position));
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
