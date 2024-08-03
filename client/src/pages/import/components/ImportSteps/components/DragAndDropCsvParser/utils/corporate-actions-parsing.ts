const getCorporatedActionsHeaders = () => {
  return ["Acciones corporativas", "Corporate Actions"];
};
function convertDataLinesToList(data: []) {
  const dataRows: [][] = [];
  data.forEach((line: any) => {
    dataRows.push(line.data);
  });
  return dataRows;
}

function extractRows(data: [][]) {
  const rows: any[][] = [];

  console.log("Searching for corporate actions...");

  data.forEach((line: any[]) => {
    if (line && line.length > 0) {
      if (
        getCorporatedActionsHeaders().includes(line[0]) &&
        line[1] !== "Header" &&
        line[1] === "Data" &&
        line[2] !== "Total"
      ) {
        rows.push(line);
      }
    }
  });
  console.log(`Found ${rows.length} corporate actions`);
  return rows;
}

function parseCorporateActions(rows: any[][]) {
  console.log("Parsing corporate actions...");
  const parsedRows: any[] = [];

  rows.forEach((line) => {
    const transaction = line[0];
    const category = line[2];
    const currency = line[3];
    const date = line[4];

    const description = line[6];
    const count = line[7];
    const price = line[9];
    const total = line[8] > 0 || line[8] < 0 ? line[8] * -1 : line[8];

    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = newDate.getDay();

    const regExp = /\(([^()]*)\)/g;
    const matches = description.match(regExp);
    if (!matches) {
      return;
    }
    const tradeInfo = matches[matches.length - 1].split(",");
    let ticker = "";
    let companyName = "";
    let isin = "";
    if (tradeInfo.length > 2) {
      ticker = tradeInfo[0].replace("(", "").trim();
      companyName = tradeInfo[1].trim();
      isin = tradeInfo[2].replace(")", "").trim();
    }

    const commission = 0;
    const totalWithCommission = total;

    parsedRows.push({
      id: Math.random().toString(16).slice(2),
      transactionType: transaction,
      date: `${year}-${month}-${day}`,
      ticker,
      companyName,
      isin,
      market: "", // market
      currency,
      count,
      price,
      total,
      commission,
      totalWithCommission,
      category,
      description,
    });
  });
  console.log("Corporate actions parsed.");
  return parsedRows;
}

export function processCorporateActionsData(data: []) {
  try {
    // Parses CSV file into data array.

    const dataLines = convertDataLinesToList(data);
    const corporateActionsRows = extractRows(dataLines);
    console.log(`Found ${corporateActionsRows.length} corporate actions`);
    const parsedCorporateActionsRows =
      parseCorporateActions(corporateActionsRows);
    console.log(parsedCorporateActionsRows);
    return parsedCorporateActionsRows;
  } catch (error) {
    console.error(error);
    return []; // Failure. Checks for CSV data file error.
  }
}

export default processCorporateActionsData;
