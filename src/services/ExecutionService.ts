import dayjs from "dayjs";
import { IChildOrder, IExecutionOrder, OrdStatus } from "./OrderService";
import { SecurityMasterService } from "./SecurityMasterService";
import { random } from "../utils/util";

class ExecutionService {
  private NextOrderId: number = 0;

  private GetAndIncrementNextOrderId = () => {
    const id = this.NextOrderId.toString();
    this.NextOrderId++;
    return id;
  };

  private getAvgPx(ordersToConsider: IExecutionOrder[], price: number) {
    if (ordersToConsider.length === 0) {
      return price;
    } else {
      const sumOfPrices = ordersToConsider
        .map((x) => x.lastPx)
        .reduce((x, y) => x + y);
      const avgPx = (sumOfPrices + price) / (ordersToConsider.length + 1);

      return Math.floor(avgPx);
    }
  }

  private createRecursiveExecutionOrders(
    qtyRemaining: number,
    defaultPrice: number,
    childOrder: IChildOrder,
    executionOrders: IExecutionOrder[]
  ) {
    const { orderQty } = childOrder;
    if (orderQty - qtyRemaining === 0)
      executionOrders.push(
        this.createExecutionOrder(
          childOrder,
          0,
          qtyRemaining,
          0,
          0,
          0,
          OrdStatus.NEW
        )
      );

    const qtyToFill = random(1, qtyRemaining);
    const qtyLeft = qtyRemaining - qtyToFill;
    const executionPrice = random(defaultPrice - 3, defaultPrice + 3);

    const executionOrdersToConsider = executionOrders.filter(
      (x) => x.ordStatus !== OrdStatus.NEW
    );

    if (qtyRemaining >= 10) {
      const avgPx = this.getAvgPx(executionOrdersToConsider, executionPrice);

      const newExecutionOrder = this.createExecutionOrder(
        childOrder,
        orderQty - qtyRemaining + qtyToFill,
        qtyLeft,
        qtyToFill,
        executionPrice,
        avgPx,
        OrdStatus.PARTIALLYFILLED
      );
      executionOrders.push(newExecutionOrder);
      this.createRecursiveExecutionOrders(
        qtyLeft,
        defaultPrice,
        childOrder,
        executionOrders
      );
    } else {
      const avgPx = this.getAvgPx(executionOrdersToConsider, defaultPrice);

      const finalExecutionOrder = this.createExecutionOrder(
        childOrder,
        orderQty,
        0,
        qtyRemaining,
        defaultPrice,
        avgPx,
        OrdStatus.FILLED
      );
      executionOrders.push(finalExecutionOrder);
    }
  }

  public createExecutionOrder(
    childOrder: IChildOrder,
    cumQty: number,
    leavesQty: number,
    lastQty: number,
    lastPx: number,
    avgPx: number,
    ordStatus: OrdStatus
  ) {
    const execId = this.GetAndIncrementNextOrderId();
    const newExecutionOrder: IExecutionOrder = {
      execId,
      childId: childOrder.childId,
      symbol: childOrder.symbol,
      side: childOrder.side,
      ordStatus,
      orderQty: childOrder.orderQty,
      cumQty,
      leavesQty,
      lastQty,
      lastPx,
      avgPx,
      currency: "USD",
      tradeDate: childOrder.tradeDate,
      transactTime: dayjs().format("YYYY-MM-DD HH:mm:ssSSS"),
    };

    return newExecutionOrder;
  }

  public CreateExecutions(childOrder: IChildOrder): IExecutionOrder[] {
    const executionOrders: IExecutionOrder[] = [];

    try {
      const securityFound = SecurityMasterService.find(
        (x) => x.SYMBOL === childOrder.symbol
      );

      const DefaultPrice = securityFound ? securityFound.DefaultPrice : 0;

      this.createRecursiveExecutionOrders(
        childOrder.orderQty,
        DefaultPrice,
        childOrder,
        executionOrders
      );
    } catch (error) {}

    return executionOrders;
  }
}
const executionService = new ExecutionService();
export default executionService;
