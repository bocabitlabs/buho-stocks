const getCompanyInfoHeaders = () => {
  return [
    "Información de instrumento financiero",
    "Financial Instrument Information",
  ];
};

function convertDataLinesToList(data: []) {
  const dataRows: [][] = [];
  data.forEach((line: any) => {
    dataRows.push(line.data);
  });
  return dataRows;
}

export default function extractInfoRows(data: []) {
  const rows: any[][] = [];

  const dataRows = convertDataLinesToList(data);

  console.log("Searching for company information in the CSV file...");
  const headers = getCompanyInfoHeaders();
  dataRows.forEach((line: any[]) => {
    if (
      headers.includes(line[0]) &&
      line[1] !== "Header" &&
      line[1] === "Data" &&
      line[3]
    ) {
      rows.push(line);
    }
  });
  console.log(`Found ${rows.length} company info`);
  return rows;
}
