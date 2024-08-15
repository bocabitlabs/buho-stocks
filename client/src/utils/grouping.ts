export const groupByName = <T>(arr: T[], key: string): Record<string, T[]> => {
  const initialValue: Record<string, T[]> = {};
  return arr.reduce((acc, cval) => {
    const myAttribute = String((cval as Record<string, unknown>)[key]);
    acc[myAttribute] = [...(acc[myAttribute] || []), cval];
    return acc;
  }, initialValue);
};

export default { groupByName };
