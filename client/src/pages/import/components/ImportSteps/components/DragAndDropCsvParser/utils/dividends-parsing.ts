import { convertDataLinesToList } from "./csv-parsing-utils";
import extractInfoRows from "./info-parsing";
import { ICsvDividendRow } from "types/csv";

const getDividendsHeaders = () => {
  return ["Dividendos", "Dividends"];
};

const getDividendTaxesHeaders = () => {
  return ["Retención de impuestos", "Withholding Tax"];
};

function extractDividendRows(data: string[][]) {
  const dividendsRows: string[][] = [];
  const dividendsHeaders = getDividendsHeaders();

  // For each line in the data, check if it's a dividend line (includes any of the dividendsHeaders)
  // If it is, add it to the dividendsRows array
  const isDividendLine = (line: string[]) => {
    return (
      dividendsHeaders.includes(line[0]) &&
      line[1] !== "Header" &&
      line[1] === "Data" &&
      line[2] !== "Total"
    );
  };
  data.map((line: string[]) => {
    if (isDividendLine(line)) {
      dividendsRows.push(line);
    }
  });

  return dividendsRows;
}

function extractDividendTaxesRows(data: string[][]) {
  const dividendTaxesRows: string[][] = [];
  const dividendTaxesHeaders = getDividendTaxesHeaders();
  console.log("Searching for dividend's taxes...");

  data.map((line: string[]) => {
    if (dividendTaxesHeaders.includes(line[0])) {
      dividendTaxesRows.push(line);
    }
  });

  console.log(`Found ${dividendTaxesRows.length} dividend's taxes`);
  return dividendTaxesRows;
}

function matchDividedsWithTaxes(
  dividendsRows: string[][],
  dividendTaxesRows: string[][],
) {
  const matchedDividendsWithTaxes: (string | number)[][] = [];
  const companyRegex = /^([^(]*)\((\w+)\)/gis;

  console.log(`Matching dividends with their taxes...`);

  dividendsRows.map((dividend) => {
    const dividendLine: (string | number)[] = dividend;
    dividendLine.splice(6);

    const companyNameMatches = companyRegex.exec(dividend[4]);

    if (companyNameMatches && companyNameMatches.length > 1) {
      const companyNameInDividend = companyNameMatches[0].trim();
      const companyTicker = companyNameMatches[1].trim();
      const companyISIN = companyNameMatches[2].trim();

      console.log(
        `Found company ${companyTicker} (${companyISIN}). Matching with taxes...`,
      );
      dividendLine.push(companyISIN); // Company ISIN
      dividendLine.push(companyTicker); // Company ticker
      let taxes = 0;

      dividendTaxesRows.map((tax) => {
        const companyNameInTaxMatches = companyRegex.exec(tax[4]);

        if (companyNameInTaxMatches && companyNameInTaxMatches.length > 1) {
          const companyNameInTax = companyNameInTaxMatches[0];
          if (
            companyNameInTax === companyNameInDividend &&
            tax[3] === dividend[3]
          ) {
            taxes = +tax[5]; // Taxes
          }
        }
      });
      dividendLine.push(taxes); // Taxes
      matchedDividendsWithTaxes.push(dividendLine);
    }
  });
  console.log(
    `Matched dividends with taxes: ${matchedDividendsWithTaxes.length}`,
  );
  return matchedDividendsWithTaxes;
}

function matchDividendsWithInfo(
  dividendsWithTaxesRow: (string | number)[][],
  infoRows: string[][],
) {
  const matchedDividendsWithInfo: string[][] = [];
  console.log(`Matching dividends with their info...`);
  dividendsWithTaxesRow.forEach((dividend) => {
    const dividendLine = dividend as string[];
    const ticker = dividendLine[7];

    infoRows.forEach((infoRow) => {
      const tickerInfo = infoRow[3];
      if (ticker === tickerInfo) {
        dividendLine.push(infoRow[4]); // Company Name
        dividendLine.push(infoRow[7]); // Market
      }
    });
    matchedDividendsWithInfo.push(dividendLine);
  });

  return matchedDividendsWithInfo;
}

function parseDividendsWithTaxes(matchedDividendsWithTaxes: string[][]) {
  const parsedDividendsWithTaxes: ICsvDividendRow[] = [];

  matchedDividendsWithTaxes.map((line) => {
    const transaction = line[0];
    const currency = line[2];
    const date = line[3];
    const description = line[4];
    const amount = +line[5];
    const ticker = line[7];
    const companyISIN = line[6];
    const taxes = line[8] ? +line[8] * -1 : 0;

    // From info
    const companyName = line[9];
    const market = line[10];

    const newDate = new Date(date);

    const handledLine = {
      id: Math.random().toString(16).slice(2),
      transactionType: transaction,
      date: newDate.toISOString().substring(0, 10),
      ticker,
      companyName,
      isin: companyISIN,
      market,
      currency,
      description,
      amount,
      commissions: taxes,
    };
    parsedDividendsWithTaxes.push(handledLine);
  });
  return parsedDividendsWithTaxes;
}

export function processDividendsData(data: string[][]) {
  try {
    const dataLines = convertDataLinesToList(data);
    const dividendsRows = extractDividendRows(dataLines);
    console.log(`Found ${dividendsRows.length} dividends`);
    const dividendTaxesRows = extractDividendTaxesRows(dataLines);
    const infoRows = extractInfoRows(data);

    const matchedDividendsWithTaxes = matchDividedsWithTaxes(
      dividendsRows,
      dividendTaxesRows,
    );
    console.log(`Matched ${matchedDividendsWithTaxes.length} dividends taxes`);
    const matchedDividendsWithInfo = matchDividendsWithInfo(
      matchedDividendsWithTaxes,
      infoRows,
    );
    console.log(`Matched ${matchedDividendsWithInfo.length} dividends info`);
    const parsedDividendsWithTaxes = parseDividendsWithTaxes(
      matchedDividendsWithInfo,
    );
    return parsedDividendsWithTaxes;
  } catch (error) {
    console.error(error);
    return []; // Failure. Checks for CSV data file error.
  }
}

export default processDividendsData;
