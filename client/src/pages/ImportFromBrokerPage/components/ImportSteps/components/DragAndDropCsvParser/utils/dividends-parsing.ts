import extractInfoRows from "./info-parsing";

const getDividendsHeaders = () => {
  return ["Dividendos", "Dividends"];
};

const getDividendTaxesHeaders = () => {
  return ["Retención de impuestos", "Withholding Tax"];
};

function convertDataLinesToList(data: []) {
  const dataRows: [][] = [];
  data.forEach((line: any) => {
    dataRows.push(line.data);
  });
  return dataRows;
}

function extractDividendRows(data: [][]) {
  const dividendsRows: any[][] = [];

  console.log("Searching for dividends...");

  data.forEach((line: any[]) => {
    if (line && line.length > 0) {
      if (
        getDividendsHeaders().includes(line[0]) &&
        line[1] !== "Header" &&
        line[1] === "Data" &&
        line[2] !== "Total"
      ) {
        dividendsRows.push(line);
      }
    }
  });
  console.log(`Found ${dividendsRows.length} dividends`);
  return dividendsRows;
}

function extractDividendTaxesRows(data: [][]) {
  const dividendTaxesRows: any[][] = [];

  console.log("Searching for dividend's taxes...");

  data.forEach((line: any[]) => {
    if (getDividendTaxesHeaders().includes(line[0])) {
      dividendTaxesRows.push(line);
    }
  });
  console.log(`Found ${dividendTaxesRows.length} dividend's taxes`);
  return dividendTaxesRows;
}

function matchDividedsWithTaxes(
  dividendsRows: any[][],
  dividendTaxesRows: any[][],
) {
  const matchedDividendsWithTaxes: any[] = [];
  console.log(`Matching dividends with their taxes...`);
  dividendsRows.forEach((dividend) => {
    const dividendLine: any[] = dividend;
    dividendLine.splice(6);

    let companyRegex = /^([^(]*)\((\w+)\)/gis;
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
      dividendTaxesRows.forEach((tax) => {
        companyRegex = /^([^(]*)\((\w+)\)/gis;
        const companyNameInTaxMatches = companyRegex.exec(tax[4]);

        if (companyNameInTaxMatches && companyNameInTaxMatches.length > 1) {
          const companyNameInTax = companyNameInTaxMatches[0];
          if (
            companyNameInTax === companyNameInDividend &&
            tax[3] === dividend[3]
          ) {
            console.log(
              `Matched ${companyNameInTax} with ${companyNameInDividend}`,
            );
            // eslint-disable-next-line prefer-destructuring
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
  dividendsWithTaxesRow: any[][],
  infoRows: any[][],
) {
  const matchedDividendsWithInfo: any[][] = [];
  console.log(`Matching dividends with their info...`);
  dividendsWithTaxesRow.forEach((dividend) => {
    const dividendLine = dividend as any;
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

function parseDividendsWithTaxes(matchedDividendsWithTaxes: any[][]) {
  const parsedDividendsWithTaxes: any[] = [];

  matchedDividendsWithTaxes.forEach((line) => {
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

export function processDividendsData(data: []) {
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
    console.log(parsedDividendsWithTaxes);
    return parsedDividendsWithTaxes;
  } catch (error) {
    console.error(error);
    return []; // Failure. Checks for CSV data file error.
  }
}

export default processDividendsData;
