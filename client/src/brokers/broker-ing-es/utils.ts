// eslint-disable-next-line import/no-extraneous-dependencies
import moment, { Moment } from "moment";
import { FormattedINGRow, TransactionType } from "./types";
import { ICompanyListItem } from "types/company";
import { IPortfolio } from "types/portfolio";

export const sharesBuyTransactionTypes = ["COMPRA", "ALTA POR CANJE"];
export const sharesTransactionTypes = ["VENTA"].concat(
  sharesBuyTransactionTypes,
);
export const dividendsTransactionTypes = ["DIVIDENDO"];

const normalizeAndRemoveAccents = (inputString: string) => {
  return inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const getCompanyFromTransaction = (
  name: string,
  portfolio: IPortfolio,
): ICompanyListItem | undefined => {
  const found = portfolio.companies.find((element) =>
    normalizeAndRemoveAccents(element.name)
      .toLowerCase()
      .includes(normalizeAndRemoveAccents(name).toLowerCase()),
  );
  if (found) {
    return found;
  }
  return found;
};

export const getTotalAmountInCompanyCurrency = (
  initialTotal: number,
  company: ICompanyListItem,
  transactionDate: Moment,
) => {
  const INGDefaultCurrency = "EUR";
  const totalInCompanyCurrency = initialTotal;
  if (company && company.baseCurrency !== "EUR") {
    // First, exchage it to EUR, which is the ING total's currency
    const temporalExchangeName = INGDefaultCurrency + company.baseCurrency;
    console.log("temporalExchangeName", temporalExchangeName);
    console.log("transactionDate", transactionDate);
    // const newExchangeRate = ExchangeRatesService.get(
    //   transactionDate.format("DD-MM-YYYY"),
    //   temporalExchangeName
    // );
    // if (newExchangeRate) {
    //   totalInCompanyCurrency = initialTotal * newExchangeRate.exchangeValue;
    // }
  }
  return totalInCompanyCurrency;
};

export const getPriceInCompanyCurrency = (
  initialPrice: number,
  company: ICompanyListItem,
  transactionDate: Moment,
) => {
  const INGDefaultCurrency = "EUR";
  if (company && company.baseCurrency !== INGDefaultCurrency) {
    // First, exchage it to EUR, which is the ING total's currency
    const temporalExchangeName = INGDefaultCurrency + company.baseCurrency;
    console.log(temporalExchangeName);
    console.log("transactionDate", transactionDate.format("DD-MM-YYYY"));
    // const newExchangeRate = ExchangeRatesService.get(
    //   transactionDate.format("DD-MM-YYYY"),
    //   temporalExchangeName
    // );
    // if (newExchangeRate) {
    //   const price: number = initialPrice * newExchangeRate.exchangeValue;
    //   return price;
    // }
  }
  return initialPrice;
};

export function getCommission(total: number, count: number, price: number) {
  let commission = total - count * price;
  if (commission < 0) {
    commission *= -1;
  }
  return commission;
}

/**
 * Handle each row on the ING's CSV format
 *
 * 0: transaction date: DD/MM/YYYY
 * 1: transaction type: COMPRA, ALTA POR CANJE
 * 3: company name: The name of the company (E.g VISCOFAN) or the name of the rights emission (E.g TEF.D 06.21)
 * 6: shares count: The number of shares affected by the transaction
 * 7: price: Price per share
 * 9: total: Total amount including commission
 *
 * @param inputData string[]
 * @returns
 */
export function formatINGRowForShares(inputData: string[]): FormattedINGRow {
  const transactionDate = moment(inputData[0], "DD/MM/YYYY");
  let transactionType = inputData[1];
  const companyName = inputData[3];
  const count = +inputData[6];
  const price = +inputData[7];
  const total = +inputData[9].replace("'", "");

  transactionType = sharesBuyTransactionTypes.includes(transactionType)
    ? "BUY"
    : "SELL";

  const result = {
    companyName,
    total,
    transactionDate,
    count,
    price,
    transactionType: transactionType as TransactionType,
  };
  return result;
}

/**
 * Handle each row on the ING's CSV format
 *
 * 0: transaction date: DD/MM/YYYY
 * 1: transaction type: COMPRA, ALTA POR CANJE
 * 3: company name: The name of the company (E.g VISCOFAN) or the name of the rights emission (E.g TEF.D 06.21)
 * 6: shares count: The number of shares affected by the transaction
 * 7: price: Price per share
 * 9: total: Total amount including commission
 *
 * @param inputData string[]
 * @returns
 */
export function formatINGRowForDividends(inputData: string[]): FormattedINGRow {
  const transactionDate = moment(inputData[0], "DD/MM/YYYY");
  const companyName = inputData[3];
  const count = +inputData[6];
  const price = +inputData[7];
  const total = +inputData[9].replace("'", "");

  return {
    companyName,
    total,
    transactionDate,
    count,
    price,
  };
}

export default { getCompanyFromTransaction };
