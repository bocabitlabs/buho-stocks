import { useTranslation } from "react-i18next";
import TradesImportForm from "./components/TradesImportForm/TradesImportForm";

interface Props {
  trades: any[];
  portfolioId: number | undefined;
  onTradeImported: Function;
}

export default function TradesImportStep({
  trades,
  portfolioId,
  onTradeImported,
}: Props) {
  const { t } = useTranslation();

  if (trades && trades.length > 0) {
    return (
      <div>
        {trades.map((trade: any) => (
          <TradesImportForm
            key={trade.id}
            portfolioId={portfolioId}
            trade={trade}
            onTradeImported={onTradeImported}
          />
        ))}
      </div>
    );
  }

  return <div>{t("No trades found on the CSV file")}</div>;
}
