export function maxDecimalPlaces(value: number, decimals: number): number {
  return Number(value.toFixed(decimals + 1).slice(0, -1));
}
