import { useTranslation } from "react-i18next";
import { Stack, Title } from "@mantine/core";
import TradesImportFormProvider from "./components/TradesImportForm/TradesImportFormProvider";

interface Props {
  trades: any[];
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
    return (
      <Stack>
        <Title order={2}>{t("Import shares")}</Title>
        {trades.map((trade: any) => (
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
