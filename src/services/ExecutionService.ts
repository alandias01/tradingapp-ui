import dayjs from "dayjs";
import { IChildOrder, IExecutionOrder, OrdStatus } from "./OrderService";
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
    childOrder: IChildOrder,
    executionOrders: IExecutionOrder[]
  ) {
    const { orderQty } = childOrder;
    if (orderQty - qtyRemaining === 0)
      executionOrders.push(
        this.createExecutionOrder(childOrder, 0, qtyRemaining, 0, OrdStatus.NEW)
      );

    const qtyToFill = random(1, qtyRemaining);
    const qtyLeft = qtyRemaining - qtyToFill;

    if (qtyRemaining >= 10) {
      const newExecutionOrder = this.createExecutionOrder(
        childOrder,
        orderQty - qtyRemaining + qtyToFill,
        qtyLeft,
        qtyToFill,
        OrdStatus.PARTIALLYFILLED
      );
      executionOrders.push(newExecutionOrder);
      this.createRecursiveExecutionOrders(qtyLeft, childOrder, executionOrders);
    } else {
      const finalExecutionOrder = this.createExecutionOrder(
        childOrder,
        orderQty,
        0,
        qtyRemaining,
        OrdStatus.FILLED
      );
      executionOrders.push(finalExecutionOrder);
    }
  }

  private createExecutionOrder(
    childOrder: IChildOrder,
    cumQty: number,
    leavesQty: number,
    lastQty: number,
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
      lastPx: 0,
      currency: "USD",
      tradeDate: childOrder.tradeDate,
      transactTime: dayjs().format("YYYY-MM-DD HH:mm:ssSSS"),
    };

    return newExecutionOrder;
  }

  public CreateExecutions(childOrder: IChildOrder): IExecutionOrder[] {
    const executionOrders: IExecutionOrder[] = [];

    try {
      this.createRecursiveExecutionOrders(
        childOrder.orderQty,
        childOrder,
        executionOrders
      );
    } catch (error) {}

    return executionOrders;
  }
}
const executionService = new ExecutionService();
export default executionService;
