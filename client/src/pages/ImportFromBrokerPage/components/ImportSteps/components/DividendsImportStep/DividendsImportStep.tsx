import DividendsImportForm from "./components/DividendsImportForm/DividendsImportForm";

interface Props {
  dividends: any[];
  portfolioId: number | undefined;
  onDividendImported: Function;
}

export default function DividendsImportStep({
  dividends,
  portfolioId,
  onDividendImported,
}: Props) {
  return (
    <div>
      {dividends &&
        dividends.length > 0 &&
        dividends.map((dividend) => (
          <DividendsImportForm
            key={`${dividend.date}-${dividend.isin}`}
            dividend={dividend}
            portfolioId={portfolioId}
            onDividendImported={onDividendImported}
          />
        ))}
    </div>
  );
}
