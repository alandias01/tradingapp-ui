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
          OrdStatus.NEW
        )
      );

    const qtyToFill = random(1, qtyRemaining);
    const qtyLeft = qtyRemaining - qtyToFill;
    const executionPrice = random(defaultPrice - 3, defaultPrice + 3);

    if (qtyRemaining >= 10) {
      const newExecutionOrder = this.createExecutionOrder(
        childOrder,
        orderQty - qtyRemaining + qtyToFill,
        qtyLeft,
        qtyToFill,
        executionPrice,
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
      const finalExecutionOrder = this.createExecutionOrder(
        childOrder,
        orderQty,
        0,
        qtyRemaining,
        defaultPrice,
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
