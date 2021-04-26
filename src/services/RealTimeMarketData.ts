import {
  SecurityMasterService,
  ISecurityMasterService,
} from "./SecurityMasterService";
import { Subject, PartialObserver, Observable } from "rxjs";
import { random } from "../utils/util";

export class RealtTimeMarketData {
  public stockPrices: Subject<ISecurityMasterService[]> = new Subject<
    ISecurityMasterService[]
  >();

  constructor() {
    setInterval(() => {
      const data = SecurityMasterService.map((s) => {
        const price = random(s.DefaultPrice - 5, s.DefaultPrice + 5);
        return { ...s, DefaultPrice: price };
      });
      this.stockPrices.next(data);
    }, 1000);
  }
}

const realtTimeMarketData = new RealtTimeMarketData();
export default realtTimeMarketData;
