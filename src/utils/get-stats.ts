interface Stats {
  avg: number;
  min: number;
  max: number;
}
export const getStats = (data: number[]): Stats | never => {
  if (data.length === 0) {
    throw new Error();
  }

  const stats = data.reduce(
    (acc, num) => {
      acc.sum += num;
      acc.min = Math.min(acc.min, num);
      acc.max = Math.max(acc.max, num);
      return acc;
    },
    { sum: 0, min: 0, max: 0 },
  );

  return {
    avg: stats.sum / data.length,
    min: stats.min,
    max: stats.max,
  };
};
