import { useCallback, useEffect, useState } from "react";
import { CheckCircleTwoTone, UpOutlined } from "@ant-design/icons";
import { Button, Steps, Row, Col, Space } from "antd";
import CorporateActionsImportStep from "./components/CorporateActionsImportStep/CorporateActionsImportStep";
import DividendsImportStep from "./components/DividendsImportStep/DividendsImportStep";
import DragAndDropCsvParser from "./components/DragAndDropCsvParser/DragAndDropCsvParser";
import { processCorporateActionsData } from "./components/DragAndDropCsvParser/utils/corporate-actions-parsing";
import { processDividendsData } from "./components/DragAndDropCsvParser/utils/dividends-parsing";
import { processTradesData } from "./components/DragAndDropCsvParser/utils/trades-parsing";
import PortfolioSelector from "./components/PortfolioSelector/PortfolioSelector";
import TradesImportStep from "./components/TradesImportStep/TradesImportStep";
import UpdatePortfolioStep from "./components/UpdatePortfolioStep/UpdatePortfolioStep";

export default function ImportSteps() {
  const [current, setCurrent] = useState(0);

  const [selectedPortfolio, setSelectedPortfolio] = useState<
    number | undefined
  >(undefined);

  const [parsedCsvData, setParsedCsvData] = useState<string[]>([]);
  const [dividends, setDividends] = useState<any[]>([]);
  const [trades, setTrades] = useState<any[]>([]);
  const [corporateActions, setCorporateActions] = useState<any[]>([]);
  const [parsingComplete, setParsingComplete] = useState(false);
  const [importedDividendsCount, setImportedDividendsCount] =
    useState<number>(0);
  const [importedTradesCount, setImportedTradesCount] = useState<number>(0);
  const [importedCorporateActionsCount, setImportedCorporateActionsCount] =
    useState<number>(0);
  const [portfolioUpdated, setPortfolioUpdated] = useState(false);

  const onDividendImported = () => {
    setImportedDividendsCount((previousValue) => {
      return previousValue + 1;
    });
  };

  const onTradeImported = () => {
    setImportedTradesCount((previousValue) => {
      return previousValue + 1;
    });
  };

  const onCorporateActionImported = () => {
    setImportedCorporateActionsCount((previousValue) => {
      return previousValue + 1;
    });
  };

  const onPortfolioUpdated = () => {
    setPortfolioUpdated(true);
  };

  const next = useCallback(() => {
    if (current === 0 && !selectedPortfolio) return;
    if (current === 1 && !parsedCsvData.length) return;
    setCurrent(current + 1);
    window.scrollTo(0, 0);
  }, [current, parsedCsvData, selectedPortfolio]);

  const prev = () => {
    if (current === 2) {
      setParsingComplete(false);
    }
    setCurrent(current - 1);
    window.scrollTo(0, 0);
  };

  const onPortfolioSelect = (value: any) => {
    setSelectedPortfolio(value);
  };

  const onCsvParsingComplete = (value: any) => {
    console.log(value);
    setParsedCsvData(value);
    const dividendsFound = processDividendsData(value);
    setDividends(dividendsFound);
    const corporateActionsFound = processCorporateActionsData(value);
    setCorporateActions(corporateActionsFound);
    const tradesFound = processTradesData(value);
    setTrades(tradesFound);
    setParsingComplete(true);
  };

  const isDisabled = () => {
    return (
      (current === 0 && !selectedPortfolio) ||
      (current === 1 && !parsedCsvData.length)
    );
  };

  useEffect(() => {
    if (current === 1 && parsingComplete) {
      next();
    }
  }, [current, next, parsingComplete]);

  const steps = [
    {
      title: "Select a portfolio",
      content: <PortfolioSelector onSelect={onPortfolioSelect} />,
    },
    {
      title: "Parse IB's CSV",
      content: <DragAndDropCsvParser onComplete={onCsvParsingComplete} />,
    },
    {
      title: "Import dividends",
      icon: (
        <span>
          {importedDividendsCount >= trades.length && (
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          )}
        </span>
      ),
      content: (
        <DividendsImportStep
          dividends={dividends}
          portfolioId={selectedPortfolio}
          onDividendImported={onDividendImported}
        />
      ),
    },
    {
      title: "Import trades",
      icon: (
        <span>
          {importedTradesCount >= trades.length && (
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          )}
        </span>
      ),
      content: (
        <TradesImportStep
          trades={trades}
          portfolioId={selectedPortfolio}
          onTradeImported={onTradeImported}
        />
      ),
    },
    {
      title: "Import corporate actions",
      icon: (
        <span>
          {importedCorporateActionsCount >= corporateActions.length && (
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          )}
        </span>
      ),
      content: (
        <CorporateActionsImportStep
          corporateActions={corporateActions}
          portfolioId={selectedPortfolio}
          onImported={onCorporateActionImported}
        />
      ),
    },
    {
      title: "Update portfolio",
      icon: (
        <span>
          {portfolioUpdated && <CheckCircleTwoTone twoToneColor="#52c41a" />}
        </span>
      ),
      content: (
        <UpdatePortfolioStep
          portfolioId={selectedPortfolio}
          onPortfolioUpdated={onPortfolioUpdated}
        />
      ),
    },
  ];
  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      <Row>
        <Col span={24}>
          <Steps current={current} items={items} />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <div className="steps-content">{steps[current].content}</div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="steps-action">
            {current < steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => next()}
                disabled={isDisabled()}
              >
                Next
              </Button>
            )}
            {current > 0 && (
              <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                Previous
              </Button>
            )}
            <Button
              icon={<UpOutlined />}
              type="link"
              onClick={() => window.scrollTo(0, 0)}
            >
              Scroll to top
            </Button>
          </div>
        </Col>
      </Row>
    </Space>
  );
}
