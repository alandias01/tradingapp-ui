import react from "react";

const Participants = [
  "EDGX",
  "NSDQ",
  "NYSE",
  "ARCA",
  "BATS",
  "IMCC",
  "EDGA",
  "BOSX",
  "PHLX",
];
const Symbols = [
  { SYMBOL: "AAPL", DefaultPrice: 120 },
  { SYMBOL: "JNJ", DefaultPrice: 160 },
  { SYMBOL: "MSFT", DefaultPrice: 230 },
  { SYMBOL: "VOO", DefaultPrice: 350 },
  { SYMBOL: "FB", DefaultPrice: 270 },
];

const round2DecimalPlaces = (number: number) =>
  Number(Math.round(number * 100) / 100);

const rand = (degree: number) => Math.floor(Math.random() * degree + 1);

export const Level2Data = (symbol: string) => {
  const found = Symbols.find((x) => x.SYMBOL === symbol);
  if (!found) return [];

  const { DefaultPrice } = found;
  const qty = () => rand(10);
  // const price = round2DecimalPlaces(DefaultPrice*rand(2));
  const price = () => DefaultPrice + rand(4);

  const data = Participants.map((participant) => ({
    participant,
    qty: qty(),
    price: price(),
  }));
  return data.sort((a, b) => a.price - b.price);
};

// setInterval(function(){
//   console.log(Math.floor((Math.random()*100)+1));
// }, 1000);
