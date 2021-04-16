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
    const qtyToFill = random(1, qtyRemaining);
    const newExecutionOrder = this.createExecutionOrder(childOrder, qtyToFill);
    executionOrders.push(newExecutionOrder);

    const qtyLeft = qtyRemaining - qtyToFill;

    if (qtyLeft < 10) {
      const finalExecutionOrder = this.createExecutionOrder(
        childOrder,
        qtyLeft
      );
      executionOrders.push(finalExecutionOrder);
    } else {
      this.createRecursiveExecutionOrders(qtyLeft, childOrder, executionOrders);
    }
  }

  private createExecutionOrder(childOrder: IChildOrder, orderQty: number) {
    const execId = this.GetAndIncrementNextOrderId();
    const newExecutionOrder: IExecutionOrder = {
      execId,
      childId: childOrder.childId,
      symbol: childOrder.symbol,
      side: childOrder.side,
      ordStatus: OrdStatus.NEW,
      orderQty,
      cumQty: 0,
      leavesQty: 0,
      lastQty: 0,
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
