import { convertDataLinesToList } from "./csv-parsing-utils";
import extractInfoRows from "./info-parsing";
import { ICsvTradesRow } from "types/csv";

const getTradesHeaders = () => {
  return ["Operaciones", "Trades"];
};

function extractTradesRows(data: string[][]) {
  const dividendsRows: string[][] = [];

  console.log("Searching for trades...");

  data.map((line: string[]) => {
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

function matchTradesWithInfo(tradesRows: string[][], infoRows: string[][]) {
  const matchedTradesWithInfo: string[][] = [];
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

function parseTrades(tradesRows: (string | number)[][]) {
  const parsedRows: ICsvTradesRow[] = [];

  tradesRows.map((line) => {
    console.log("Line is: ", line);
    const category = line[3].toString();
    const currency = line[4].toString();
    const ticker = line[5].toString();
    console.log("Date is: ", line[6]);
    const date = line[6];
    console.log("Count is: ", line[7]);
    const count = +line[7];
    const price = +line[8];
    const transactionType = line[0].toString();

    const line10NumberValue = +line[10];
    const total =
      line10NumberValue > 0 ? line10NumberValue : -line10NumberValue;
    let commission = 0;
    const line11NumberValue = +line[11];
    if (line11NumberValue && line11NumberValue > 0) {
      commission = line11NumberValue;
    } else if (line11NumberValue && line11NumberValue < 0) {
      commission = -line11NumberValue;
    }

    const totalWithCommission = +line[12];
    const companyName = line[16].toString();
    const companyISIN = line[17].toString();
    const market = line[18].toString();

    let parsedDate;
    if (typeof date === "string" && date.includes(",")) {
      // Parse date format "2025-02-24, 05:42:12"
      const dateTimeParts = date.split(", ");
      const dateParts = dateTimeParts[0].split("-");
      parsedDate = new Date(
        parseInt(dateParts[0]), // year
        parseInt(dateParts[1]) - 1, // month (0-based)
        parseInt(dateParts[2]), // day
      );
    } else {
      // Use the existing date parsing logic
      parsedDate = new Date(date);
    }

    // Use the parsed date
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth() + 1;
    const day = parsedDate.getDate();

    console.log("Parsed date is: ", `${year}-${month}-${day}`);

    const description = `${ticker} (${companyISIN}) - ${companyName}. ${count} shares at ${price} ${currency}. Total ${total} ${currency}. Commission ${commission} ${currency}. Total with commission ${totalWithCommission} ${currency}`;

    const parsedRow = {
      id: Math.random().toString(16).slice(2),
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
      transactionType,
    };
    parsedRows.push(parsedRow);
  });
  return parsedRows;
}

export function processTradesData(data: string[][]) {
  try {
    const dataLines = convertDataLinesToList(data);
    const tradesRows = extractTradesRows(dataLines);
    const infoRows = extractInfoRows(data);
    const matchedTradesWithInfo = matchTradesWithInfo(tradesRows, infoRows);
    const parsedTrades = parseTrades(matchedTradesWithInfo);

    return parsedTrades; // Success.
  } catch (error) {
    console.error(error);
    return []; // Failure. Checks for CSV data file error.
  }
}

export default processTradesData;
