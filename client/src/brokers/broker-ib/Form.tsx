import React, { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { CSVReader } from "react-papaparse";
import { Col, Radio, Row, Select, Space, Typography } from "antd";
import DividendsImportForm from "./DividendsImportForm";
import TradesImportForm from "./TradesImportForm";
import { getCommissionsForElement } from "./utils";
import { usePortfolios } from "hooks/use-portfolios/use-portfolios";
import { IPortfolio } from "types/portfolio";

export default function Form(): ReactElement {
  const sharesTableData = {
    headers: ["Operaciones", "Trades"],
    subHeaders: ["Data"],
    filters: ["Acciones", "Stocks"],
  };

  const dividendsTableData = {
    headers: ["Dividendos", "Dividends"],
    taxHeaders: ["Retención de impuestos", "Withholding Tax"],
    subHeaders: ["Data"],
    notAllowedFilters: ["Total", ""],
  };

  const [data, setData] = useState([]);
  const [defaultImport, setDefaultImport] = useState("shares");
  const { isFetching: loadingPortfolios, data: portfolios } = usePortfolios();

  const [selectedPortfolio, setSelectedPortfolio] = useState<IPortfolio | null>(
    null,
  );
  const { t } = useTranslation();

  const options1 = [
    { label: t("Import shares/rights"), value: "shares" },
    { label: t("Import dividends"), value: "dividends" },
  ];

  const importDividendsChange = (e: any) => {
    setData([]);
    setDefaultImport(e.target.value);
  };

  const onPortfolioSelect = (value: any) => {
    if (portfolios) {
      const portfolio = portfolios.find(
        (port: IPortfolio) => port.id === +value,
      );
      if (portfolio) {
        setSelectedPortfolio(portfolio);
        setData([]);
      }
    }
  };

  const handleSharesFileLoad = (fileData: any) => {
    setData([]);
    const filteredData = fileData.filter((element: any) => {
      return (
        sharesTableData.headers.includes(element.data[0]) &&
        sharesTableData.subHeaders.includes(element.data[1]) &&
        sharesTableData.filters.includes(element.data[3])
      );
    });
    setData(filteredData);
  };

  const handleDividendsFileLoad = (fileData: any) => {
    setData([]);
    const filteredData = fileData.filter((element: any) => {
      return (
        dividendsTableData.headers.includes(element.data[0]) &&
        dividendsTableData.subHeaders.includes(element.data[1]) &&
        !dividendsTableData.notAllowedFilters.includes(element.data[2]) &&
        !dividendsTableData.notAllowedFilters.includes(element.data[3])
      );
    });
    console.debug("filteredData: ", filteredData);
    const commissionsArray = fileData.filter((element: any) => {
      console.debug(`Get commissions array for ${element.data[0]}`);
      return dividendsTableData.taxHeaders.includes(element.data[0]);
    });
    console.debug("commissionsArray: ", commissionsArray);
    const filteredDataWithCommissions = filteredData;
    filteredData.forEach((element: any, index: number) => {
      const commissions = getCommissionsForElement(
        element.data[4],
        element.data[3],
        commissionsArray,
      );
      filteredDataWithCommissions[index].commissions = commissions;
      console.debug(
        `Filtered data element ${index}: `,
        filteredDataWithCommissions[index],
      );
    });
    setData(filteredDataWithCommissions);
  };

  const handleOnError = (err: any, file: any, inputElem: any, reason: any) => {
    console.error(`${err} - ${file} - ${inputElem} - ${reason}`);
  };

  return (
    <Row>
      <Col>
        <Space direction="vertical">
          <Radio.Group
            options={options1}
            onChange={importDividendsChange}
            value={defaultImport}
            optionType="button"
            buttonStyle="solid"
          />
          <Select
            onSelect={onPortfolioSelect}
            showSearch
            placeholder={t("Select a portfolio")}
            loading={loadingPortfolios}
          >
            {portfolios &&
              portfolios.map((item: IPortfolio) => (
                <Select.Option
                  value={item.id}
                  key={`portfolio-${item.id}-${item.id}`}
                >
                  {item.name}
                </Select.Option>
              ))}
          </Select>
          {selectedPortfolio && (
            <CSVReader
              onDrop={
                defaultImport === "shares"
                  ? handleSharesFileLoad
                  : handleDividendsFileLoad
              }
              onError={handleOnError}
              noDrag
            >
              {defaultImport === "shares" ? (
                <span>
                  {t("Click to upload a trades file from Interactive Brokers.")}
                </span>
              ) : (
                <span>
                  {t(
                    "Click to upload a csv file with dividends data from Interactive Brokers.",
                  )}
                </span>
              )}
            </CSVReader>
          )}
          {defaultImport === "shares" && data.length > 0 && selectedPortfolio && (
            <div>
              <Typography.Title level={4}>
                {t("Importing trades from Interactive Brokers")}
              </Typography.Title>
              {data.map((element: any) => {
                return (
                  <TradesImportForm
                    key={`${element.data[5]}_${element.data[6]}`}
                    inputData={element.data}
                    portfolio={selectedPortfolio}
                  />
                );
              })}
            </div>
          )}
          {defaultImport === "dividends" &&
            data.length > 0 &&
            selectedPortfolio && (
              <div>
                <Typography.Title level={4}>
                  {t("Importing dividends from Interactive Brokers")}
                </Typography.Title>
                {data.map((element: any) => {
                  console.log(element.data);
                  return (
                    <DividendsImportForm
                      key={`${element.data[3]}_${element.data[4]}`}
                      inputData={element}
                      portfolio={selectedPortfolio}
                    />
                  );
                })}
              </div>
            )}
        </Space>
      </Col>
    </Row>
  );
}
