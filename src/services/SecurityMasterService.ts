export interface ISecurityMasterService {
  SYMBOL: string;
  DefaultPrice: number;
  Description?: string;
}
export const SecurityMasterService: ISecurityMasterService[] = [
  { SYMBOL: "AAPL", DefaultPrice: 120, Description: "Apple, Inc" },
  { SYMBOL: "NFLX", DefaultPrice: 100, Description: "Netflix, Inc" },
  { SYMBOL: "JPM", DefaultPrice: 90, Description: "JPMorgan Chase & Co." },
  { SYMBOL: "JNJ", DefaultPrice: 160, Description: "Johnson & Johnson" },
  { SYMBOL: "MSFT", DefaultPrice: 150, Description: "Microsoft Corporation" },
  { SYMBOL: "VOO", DefaultPrice: 110, Description: "Vanguard S&P 500 ETF" },
  { SYMBOL: "FB", DefaultPrice: 140, Description: "Facebook, Inc" },
];
