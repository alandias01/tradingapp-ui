export interface IPositionServiceData {
  participant: string;
  qty: number;
  price: number;
}

type IObserver = (data: IPositionServiceData) => void;

class PositionService {
  data: IPositionServiceData[] = [];
  observers: IObserver[] = [];

  add(data: IPositionServiceData) {
    this.data.push(data);
    this.observers.forEach((fn) => fn.call(this, data));
  }

  ItemAdded(fn: IObserver) {
    console.log("Service observer length: " + this.observers.length);
    if (this.observers.length < 2) this.observers.push(fn);
  }
}

const defaultData: IPositionServiceData[] = [
  { participant: "Toyota", qty: 100, price: 30 },
  { participant: "Ford", qty: 200, price: 40 },
  { participant: "Porsche", qty: 200, price: 50 },
];

const positionService = new PositionService();
defaultData.forEach((x) => positionService.add(x));

export default positionService;
