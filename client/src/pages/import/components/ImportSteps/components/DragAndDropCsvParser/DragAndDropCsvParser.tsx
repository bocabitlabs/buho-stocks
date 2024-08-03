import React from "react";
import { useTranslation } from "react-i18next";
import { CSVReader } from "react-papaparse";

interface Props {
  onComplete: Function;
}

export default function DragAndDropCsvParser({ onComplete }: Props) {
  const { t } = useTranslation();

  const handleCsvDrop = (fileData: any) => {
    onComplete(fileData);
  };
  const handleOnError = (err: any, file: any, inputElem: any, reason: any) => {
    console.error(`${err} - ${file} - ${inputElem} - ${reason}`);
  };

  return (
    <CSVReader onDrop={handleCsvDrop} onError={handleOnError} noDrag>
      <span>
        {t(
          "Click to upload a CSV transaction's file from Interactive Brokers.",
        )}
      </span>
    </CSVReader>
  );
}
