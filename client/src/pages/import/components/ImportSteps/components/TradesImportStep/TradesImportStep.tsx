import { useTranslation } from "react-i18next";
import { Stack, Title } from "@mantine/core";
import TradesImportFormProvider from "./components/TradesImportForm/TradesImportFormProvider";
import { ICsvTradesRow } from "types/csv";

interface Props {
  trades: ICsvTradesRow[];
  portfolioId: number | undefined;
  onTradeImported: () => void;
}

export default function TradesImportStep({
  trades,
  portfolioId,
  onTradeImported,
}: Props) {
  const { t } = useTranslation();

  if (!portfolioId) {
    return <div>{t("Select a portfolio to import trades.")}</div>;
  }

  if (trades && trades.length > 0) {
    console.log(trades);
    return (
      <Stack>
        <Title order={2}>{t("Import shares")}</Title>
        {trades.map((trade) => (
          <TradesImportFormProvider
            key={trade.id}
            portfolioId={portfolioId}
            trade={trade}
            onImportedCallback={onTradeImported}
          />
        ))}
      </Stack>
    );
  }

  return <div>{t("No trades found on the CSV file")}</div>;
}
