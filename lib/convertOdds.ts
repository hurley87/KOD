// convert EU odds to US odds, convert to whole integers
export const convertOdds = (value: number) => {
  let multiplier = 100;

  if (value < 2) {
    multiplier = -100;

    return formatToFixed(multiplier / (value - 1), 0);
  }

  return `+${formatToFixed((value - 1) * multiplier, 0)}`;
};

const formatToFixed = (value: string | number, digitsCount: number): number => {
  value = String(value);

  if (!/\./.test(value)) {
    return +value;
  }

  const [int, digits] = value.split(".");

  return +`${int}.${digits.substr(0, digitsCount)}`;
};
