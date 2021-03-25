export interface ISecurityMasterService {
  SYMBOL: string;
  DefaultPrice: number;
}
export const SecurityMasterService: ISecurityMasterService[] = [
  { SYMBOL: "AAPL", DefaultPrice: 120 },
  { SYMBOL: "JNJ", DefaultPrice: 160 },
  { SYMBOL: "MSFT", DefaultPrice: 230 },
  { SYMBOL: "VOO", DefaultPrice: 350 },
  { SYMBOL: "FB", DefaultPrice: 270 },
];
