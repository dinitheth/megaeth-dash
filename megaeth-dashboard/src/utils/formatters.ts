export const formatTokenAmount = (amount: string | number, decimals = 18): string => {
  return (Number(amount) / Math.pow(10, decimals)).toFixed(4);
};