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
  return (
    <div>
      {trades &&
        trades.length > 0 &&
        trades.map((trade) => (
          <TradesImportForm
            key={`${trade.date}-${trade.companyIsin}`}
            trade={trade}
            portfolioId={portfolioId}
            onTradeImported={onTradeImported}
          />
        ))}
    </div>
  );
}
