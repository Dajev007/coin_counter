export type CoinDenomination = {
  id: string;
  label: string;
  weightGrams: number;
  valuePence: number;
  valuePounds: number;
};

export const COINS: CoinDenomination[] = [
  { id: '1p', label: '1p', weightGrams: 3.56, valuePence: 1, valuePounds: 0.01 },
  { id: '2p', label: '2p', weightGrams: 7.12, valuePence: 2, valuePounds: 0.02 },
  { id: '5p', label: '5p', weightGrams: 3.25, valuePence: 5, valuePounds: 0.05 },
  { id: '10p', label: '10p', weightGrams: 6.5, valuePence: 10, valuePounds: 0.10 },
  { id: '20p', label: '20p', weightGrams: 5.0, valuePence: 20, valuePounds: 0.20 },
  { id: '50p', label: '50p', weightGrams: 8.0, valuePence: 50, valuePounds: 0.50 },
  { id: '£1', label: '£1', weightGrams: 8.75, valuePence: 100, valuePounds: 1.00 },
  { id: '£2', label: '£2', weightGrams: 12.0, valuePence: 200, valuePounds: 2.00 },
];

export function calcCoinCount(weightGrams: number, coinWeightGrams: number): number {
  if (!weightGrams || !coinWeightGrams) return 0;
  return Math.round(weightGrams / coinWeightGrams);
}

export function calcCoinValue(count: number, valuePounds: number): number {
  return count * valuePounds;
}

export function formatPounds(amount: number): string {
  return `£${amount.toFixed(2)}`;
}
