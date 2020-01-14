function formatMoney(num) {
  if (isNaN(num) || num == null) {
    num = "0";
  }
  num = num.toString().replace(/\$|\,/g, "");
  const sign = num == (num = Math.abs(num));
  num = Math.floor(num);
  let cents = num % 100;
  num = Math.floor(num / 100).toString();
  if (cents < 10) cents = "0" + cents;
  for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
    num =
      num.substring(0, num.length - (4 * i + 3)) +
      "," +
      num.substring(num.length - (4 * i + 3));
  return (sign ? "" : "-") + num + "." + cents;
}

function formatMoneyToInt(value) {
  return value * 100 / 10000;
}

export default {
  formatMoney,
  formatMoneyToInt
};
