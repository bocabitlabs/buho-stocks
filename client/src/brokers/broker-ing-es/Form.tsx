import React, { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { CSVReader } from "react-papaparse";
import { Col, Radio, Row, Select, Space, Typography } from "antd";
import DividendsImportForm from "./DividendsImportForm";
import TradesImportForm from "./TradesImportsForm";
import { dividendsTransactionTypes, sharesTransactionTypes } from "./utils";
import { usePortfolios } from "hooks/use-portfolios/use-portfolios";
import { IPortfolio } from "types/portfolio";

export default function Form(): ReactElement {
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
      const portfolio = portfolios.find((p: IPortfolio) => p.id === +value);
      if (portfolio) {
        setSelectedPortfolio(portfolio);
        setData([]);
      }
    }
  };

  const handleSharesFileLoad = (fileData: any) => {
    setData([]);
    const dateRegex =
      /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/;

    const filteredData = fileData.filter((element: any) => {
      return (
        dateRegex.test(element.data[0]) &&
        sharesTransactionTypes.includes(element.data[1])
      );
    });
    setData(filteredData);
    console.log(filteredData);
  };

  const handleDividendsFileLoad = (fileData: any) => {
    setData([]);
    const dateRegex =
      /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/;

    const filteredData = fileData.filter((element: any) => {
      return (
        dateRegex.test(element.data[0]) &&
        dividendsTransactionTypes.includes(element.data[1])
      );
    });
    setData(filteredData);
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
                <span>{t("Click to upload a trades file from ING ES.")}</span>
              ) : (
                <span>
                  {t(
                    "Click to upload a csv file with dividends data from ING ES.",
                  )}
                </span>
              )}
            </CSVReader>
          )}
          {defaultImport === "shares" && data.length > 0 && selectedPortfolio && (
            <div>
              <Typography.Title level={4}>
                {t("Importing trades from ING ES")}
              </Typography.Title>
              {data.map((element: any) => {
                return (
                  <TradesImportForm
                    key={
                      selectedPortfolio.id + element.data[3] + element.data[1]
                    }
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
                  Importing dividends from ING ES:
                </Typography.Title>
                {data.map((element: any) => {
                  return (
                    <DividendsImportForm
                      key={selectedPortfolio.id}
                      inputData={element.data}
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
