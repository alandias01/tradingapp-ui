import { Algo, IParentOrder, IChildOrder, OrdStatus } from "./OrderService";
import { random } from "../utils/util";

class AlgoService {
  private NextOrderId: number = 0;

  private GetAndIncrementNextOrderId = () => {
    const id = this.NextOrderId.toString();
    this.NextOrderId++;
    return id;
  };

  public createChildOrder(parentOrder: IParentOrder, orderQty: number) {
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
      filledQty: 0,
      unfilledQty: orderQty,
      parentCumQty: 0,
      parentLeavesQty: 0,
      avgPrice: parentOrder.marketPrice,
      tradeDate: new Date(Date.now()),
      tif: parentOrder.tif,
    };

    return newChildOrder;
  }

  private createBlockChildOrders(
    orderBlock: number,
    qtyRemaining: number,
    parentOrder: IParentOrder,
    childOrders: IChildOrder[]
  ) {
    const newChildOrder = this.createChildOrder(parentOrder, orderBlock);
    childOrders.push(newChildOrder);

    const qtyLeft = qtyRemaining - orderBlock;

    if (qtyLeft <= orderBlock) {
      const finalChildOrder = this.createChildOrder(parentOrder, qtyLeft);
      childOrders.push(finalChildOrder);
    } else {
      this.createBlockChildOrders(
        orderBlock,
        qtyLeft,
        parentOrder,
        childOrders
      );
    }
  }

  private getBlockAlgoQuantity(parentOrder: IParentOrder) {
    const { orderQty } = parentOrder;

    if (orderQty <= 50) {
      return orderQty;
    } else if (orderQty > 50 && orderQty <= 200) {
      return 50;
    } else if (orderQty > 200 && orderQty <= 600) {
      return 100;
    } else if (orderQty > 600 && orderQty <= 2000) {
      return 200;
    } else if (orderQty > 2000) {
      return 500;
    }
    return orderQty;
  }

  public ProcessAlgoOrder(parentOrder: IParentOrder): IChildOrder[] {
    const childOrders: IChildOrder[] = [];

    try {
      if (parentOrder.algo === Algo.NONE || parentOrder.orderQty === 0)
        return [];

      const blockQty = this.getBlockAlgoQuantity(parentOrder);
      this.createBlockChildOrders(
        blockQty,
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
