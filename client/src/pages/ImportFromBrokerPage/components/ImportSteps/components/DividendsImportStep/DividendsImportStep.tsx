import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  if (dividends && dividends.length > 0) {
    return (
      <div>
        {dividends.map((dividend: any) => (
          <DividendsImportForm
            key={dividend.id}
            dividend={dividend}
            portfolioId={portfolioId}
            onDividendImported={onDividendImported}
          />
        ))}
      </div>
    );
  }

  return <div>{t("No dividends found on the CSV file")}</div>;
}
