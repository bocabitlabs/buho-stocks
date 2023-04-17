import extractInfoRows from "./info-parsing";

const getTradesHeaders = () => {
  return ["Operaciones", "Trades"];
};

function convertDataLinesToList(data: []) {
  const dataRows: [][] = [];
  data.forEach((line: any) => {
    dataRows.push(line.data);
  });
  return dataRows;
}

function extractTradesRows(data: [][]) {
  const dividendsRows: any[][] = [];

  console.log("Searching for trades...");

  data.forEach((line: any[]) => {
    if (line && line.length > 0) {
      if (
        getTradesHeaders().includes(line[0]) &&
        line[1] !== "Header" &&
        line[1] === "Data" &&
        line[3] !== "Forex" &&
        line[3] !== "Fórex"
      ) {
        dividendsRows.push(line);
      }
    }
  });
  console.log(`Found ${dividendsRows.length} dividends`);
  return dividendsRows;
}

function matchTradesWithInfo(tradesRows: any[][], infoRows: any[][]) {
  const matchedTradesWithInfo: any[][] = [];
  console.log(`Matching trades with their info...`);
  tradesRows.forEach((trade) => {
    const tradeLine = trade;
    const companyTicker = tradeLine[5].trim();

    infoRows.forEach((info) => {
      const companyTickerInInfo = info[3];
      if (companyTicker === companyTickerInInfo) {
        tradeLine.push(info[4].trim()); // Company Name
        tradeLine.push(info[6].trim()); // ISIN
        tradeLine.push(info[7].trim()); // Market
      }
    });
    matchedTradesWithInfo.push(tradeLine);
  });

  console.log(`Matched trades with info: ${matchedTradesWithInfo.length}`);
  return matchedTradesWithInfo;
}

function parseTrades(tradesRows: any[][]) {
  const parsedRows: any[] = [];

  tradesRows.forEach((line) => {
    const transaction = line[0];
    const category = line[3];
    const currency = line[4];
    const ticker = line[5];
    const date = line[6];
    const count = line[7];
    const price = line[8];
    const total = line[10] > 0 ? line[10] : line[10] * -1;
    let commission = 0;
    if (line[11] && line[11] > 0) {
      // eslint-disable-next-line prefer-destructuring
      commission = line[11];
    } else if (line[11] && line[11] < 0) {
      commission = line[11] * -1;
    }
    // commission = line[11] ? line[11] : 0;
    const totalWithCommission = line[12];
    const companyName = line[16];
    const companyISIN = line[17];
    const market = line[18];
    const description = "";

    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = newDate.getDay();

    const parsedRow = {
      transactionType: transaction,
      date: `${year}-${month}-${day}`,
      ticker,
      companyName,
      companyISIN,
      market,
      currency,
      count,
      price,
      total,
      commission,
      totalWithCommission,
      category,
      description,
    };

    parsedRows.push(parsedRow);
  });
  return parsedRows;
}

export function processTradesData(data: []) {
  try {
    const dataLines = convertDataLinesToList(data);
    const tradesRows = extractTradesRows(dataLines);
    console.log(tradesRows);
    const infoRows = extractInfoRows(data);
    const matchedTradesWithInfo = matchTradesWithInfo(tradesRows, infoRows);
    console.log(matchedTradesWithInfo);
    const parsedTrades = parseTrades(matchedTradesWithInfo);
    console.log(parsedTrades);

    return parsedTrades; // Success.
  } catch (error) {
    console.error(error);
    return []; // Failure. Checks for CSV data file error.
  }
}

export default processTradesData;
