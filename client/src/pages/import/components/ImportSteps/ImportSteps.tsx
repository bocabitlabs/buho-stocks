import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Group, Stepper } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
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
  const { t } = useTranslation();

  const [active, setActive] = useState(0);
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  // Step 1
  const [selectedPortfolio, setSelectedPortfolio] = useState<
    number | undefined
  >(undefined);
  // Step 2
  const [parsingComplete, setParsingComplete] = useState(false);
  const [parsedCsvData, setParsedCsvData] = useState<string[]>([]);
  // Step 3
  const [dividends, setDividends] = useState<any[]>([]);
  const [importedDividendsCount, setImportedDividendsCount] =
    useState<number>(0);
  // Step 4
  const [trades, setTrades] = useState<any[]>([]);
  const [importedTradesCount, setImportedTradesCount] = useState<number>(0);
  // Step 5
  const [corporateActions, setCorporateActions] = useState<any[]>([]);
  const [importedCorporateActionsCount, setImportedCorporateActionsCount] =
    useState<number>(0);
  // Step 6
  const [portfolioUpdated, setPortfolioUpdated] = useState(false);

  const onPortfolioSelect = (value: any) => {
    setSelectedPortfolio(value);
  };

  const nextStep = useCallback(() => {
    if (active === 0 && !selectedPortfolio) return;
    if (active === 1 && !parsedCsvData.length) return;

    setActive((current) => (current < 5 ? current + 1 : current));
    window.scrollTo(0, 0);
  }, [active, parsedCsvData, selectedPortfolio]);

  const onCsvParsingComplete = (value: any) => {
    setParsedCsvData(value);
    const dividendsFound = processDividendsData(value);
    setDividends(dividendsFound);
    const corporateActionsFound = processCorporateActionsData(value);
    setCorporateActions(corporateActionsFound);
    const tradesFound = processTradesData(value);
    setTrades(tradesFound);
    setParsingComplete(true);
  };

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

  useEffect(() => {
    if (active === 1 && parsingComplete) {
      nextStep();
    }
  }, [active, nextStep, parsingComplete]);

  return (
    <>
      <Stepper active={active}>
        <Stepper.Step label={t("Select a portfolio")}>
          <PortfolioSelector onSelect={onPortfolioSelect} />
        </Stepper.Step>
        <Stepper.Step label={t("Parse IB's CSV file")}>
          <DragAndDropCsvParser onComplete={onCsvParsingComplete} />
        </Stepper.Step>
        <Stepper.Step
          label={t("Import dividends")}
          completedIcon={
            importedDividendsCount >= trades.length && <IconCheck />
          }
        >
          <DividendsImportStep
            dividends={dividends}
            portfolioId={selectedPortfolio}
            onDividendImported={onDividendImported}
          />
        </Stepper.Step>
        <Stepper.Step
          label={t("Import trades")}
          completedIcon={importedTradesCount >= trades.length && <IconCheck />}
        >
          <TradesImportStep
            trades={trades}
            portfolioId={selectedPortfolio}
            onTradeImported={onTradeImported}
          />
        </Stepper.Step>
        <Stepper.Step
          label={t("Import corporate actions")}
          completedIcon={
            importedCorporateActionsCount >= corporateActions.length && (
              <IconCheck />
            )
          }
        >
          <CorporateActionsImportStep
            corporateActions={corporateActions}
            portfolioId={selectedPortfolio}
            onImportedCallback={onCorporateActionImported}
          />
        </Stepper.Step>
        <Stepper.Step
          label={t("Update portfolio")}
          completedIcon={portfolioUpdated && <IconCheck />}
        >
          <UpdatePortfolioStep
            portfolioId={selectedPortfolio}
            onPortfolioUpdated={onPortfolioUpdated}
          />
        </Stepper.Step>
        <Stepper.Completed>
          {t(
            "Import completed. You can now wait until the portfolio is updated",
          )}
        </Stepper.Completed>
      </Stepper>

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>Next step</Button>
      </Group>
    </>
  );
}
