import { convertDataLinesToList } from "./csv-parsing-utils";

const getCompanyInfoHeaders = () => {
  return [
    "Información de instrumento financiero",
    "Financial Instrument Information",
  ];
};

export default function extractInfoRows(data: string[][]) {
  const rows: string[][] = [];
  const headers = getCompanyInfoHeaders();
  const dataRows = convertDataLinesToList(data);

  console.log("Searching for company information in the CSV file...");

  const isCompanyInfoLine = (line: string[]) => {
    return (
      headers.includes(line[0]) &&
      line[1] !== "Header" &&
      line[1] === "Data" &&
      line[3]
    );
  };

  dataRows.map((line: string[]) => {
    if (isCompanyInfoLine(line)) {
      rows.push(line);
    }
  });
  console.log(`Found ${rows.length} company info`);
  return rows;
}
