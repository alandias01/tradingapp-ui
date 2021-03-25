import react from "react";
import { SecurityMasterService } from "./SecurityMasterService";

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

const round2DecimalPlaces = (number: number) =>
  Number(Math.round(number * 100) / 100);

const rand = (degree: number) => Math.floor(Math.random() * degree + 1);

export const Level2DataService = (symbol: string) => {
  const found = SecurityMasterService.find((x) => x.SYMBOL === symbol);
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
