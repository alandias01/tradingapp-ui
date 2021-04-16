import { Algo, IParentOrder, IChildOrder, OrdStatus } from "./OrderService";
import { random } from "../utils/util";

class AlgoService {
  private NextOrderId: number = 0;

  private GetAndIncrementNextOrderId = () => {
    const id = this.NextOrderId.toString();
    this.NextOrderId++;
    return id;
  };

  private createRecursiveChildOrders(
    qtyRemaining: number,
    parentOrder: IParentOrder,
    childOrders: IChildOrder[]
  ) {
    const qtyToFill = random(1, qtyRemaining);
    const newChildOrder = this.createChildOrder(parentOrder, qtyToFill);
    childOrders.push(newChildOrder);

    const qtyLeft = qtyRemaining - qtyToFill;

    if (qtyLeft < 10) {
      const finalChildOrder = this.createChildOrder(parentOrder, qtyLeft);
      childOrders.push(finalChildOrder);
    } else {
      this.createRecursiveChildOrders(qtyLeft, parentOrder, childOrders);
    }
  }

  private createChildOrder(parentOrder: IParentOrder, orderQty: number) {
    const childId = this.GetAndIncrementNextOrderId();
    const newChildOrder: IChildOrder = {
      childId,
      parentId: parentOrder.parentId,
      moniker: parentOrder.moniker,
      symbol: parentOrder.symbol,
      side: parentOrder.side,
      ordType: parentOrder.ordType,
      ordStatus: OrdStatus.NEW,
      orderQty,
      filledQty: parentOrder.filledQty,
      unfilledQty: parentOrder.unfilledQty,
      avgPrice: parentOrder.marketPrice,
      tradeDate: new Date(Date.now()),
      tif: parentOrder.tif,
    };

    return newChildOrder;
  }

  public ProcessAlgoOrder(parentOrder: IParentOrder): IChildOrder[] {
    const childOrders: IChildOrder[] = [];

    try {
      if (parentOrder.algo === Algo.NONE || parentOrder.orderQty === 0)
        return [];

      this.createRecursiveChildOrders(
        parentOrder.orderQty,
        parentOrder,
        childOrders
      );
    } catch (error) {}

    return childOrders;
  }
}

const algoService = new AlgoService();
export default algoService;
