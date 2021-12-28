import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CSVReader } from "react-papaparse";
import { Col, Radio, Row, Select, Space, Typography } from "antd";
import useFetch from "use-http";
import DividendsImportForm from "./DividendsImportForm";
import TradesImportForm from "./TradesImportsForm";
import { dividendsTransactionTypes, sharesTransactionTypes } from "./utils";
import { IPortfolio } from "types/portfolio";

export default function Form(): ReactElement {
  const [data, setData] = useState([]);
  const [uploaded, setUploaded] = useState(false);
  const [defaultImport, setDefaultImport] = useState("shares");
  const [portfolios, setPortfolios] = useState<IPortfolio[]>([]);
  const {
    loading: loadingPortfolios,
    get: getPortfolios,
    response: responsePortfolios,
  } = useFetch("portfolios");

  const [selectedPortfolio, setSelectedPortfolio] = useState<IPortfolio | null>(
    null,
  );
  const { t } = useTranslation();

  const options1 = [
    { label: "Import Shares/Rights", value: "shares" },
    { label: "Import Dividends", value: "dividends" },
  ];

  useEffect(() => {
    const fetchPortfolios = async () => {
      const results = await getPortfolios();
      if (responsePortfolios.ok) {
        setPortfolios(results);
      }
    };
    fetchPortfolios();
  }, [getPortfolios, responsePortfolios]);

  const importDividendsChange = (e: any) => {
    setDefaultImport(e.target.value);
  };

  const onPortfolioSelect = (value: any) => {
    const portfolio = portfolios.find((p) => p.id === +value);
    if (portfolio) {
      setSelectedPortfolio(portfolio);
    }
  };

  const handleSharesFileLoad = (fileData: any) => {
    setUploaded(true);
    const dateRegex =
      /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/;

    const filteredData = fileData.filter((element: any) => {
      return (
        dateRegex.test(element.data[0]) &&
        sharesTransactionTypes.includes(element.data[1])
      );
    });
    setData(filteredData);
  };

  const handleDividendsFileLoad = (fileData: any) => {
    console.debug("handleDividendsFileLoad...");
    const dateRegex =
      /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/;

    const filteredData = fileData.filter((element: any) => {
      return (
        dateRegex.test(element.data[0]) &&
        dividendsTransactionTypes.includes(element.data[1])
      );
    });
    setUploaded(true);
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
                <span>Click to upload a trades file from ING ES.</span>
              ) : (
                <span>
                  Click to upload a csv file with dividends data from ING ES.
                </span>
              )}
            </CSVReader>
          )}
          {JSON.stringify(uploaded)}
          {defaultImport === "shares" && data.length > 0 && selectedPortfolio && (
            <div>
              <Typography.Title level={4}>
                Importing trades from ING ES:
              </Typography.Title>
              {data.map((element: any, index: number) => {
                return (
                  <TradesImportForm
                    key={index.toString()}
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
                {data.map((element: any, index: number) => {
                  return (
                    <DividendsImportForm
                      key={index.toString()}
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
