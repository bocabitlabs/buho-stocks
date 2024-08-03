import { useTranslation } from "react-i18next";
import { Stack, Title } from "@mantine/core";
import DividendsImportFormProvider from "./components/DividendsImportForm/DividendsImportFormProvider";

interface Props {
  dividends: any[];
  portfolioId: number | undefined;
  onDividendImported: () => void;
}

export default function DividendsImportStep({
  dividends,
  portfolioId,
  onDividendImported,
}: Props) {
  const { t } = useTranslation();

  if (!portfolioId) {
    return <div>{t("Select a portfolio to import dividends.")}</div>;
  }

  if (dividends && dividends.length > 0) {
    return (
      <Stack>
        <Title order={2}>{t("Import dividends")}</Title>
        {dividends.map((dividend: any) => (
          <DividendsImportFormProvider
            key={dividend.id}
            dividend={dividend}
            portfolioId={portfolioId}
            onImportedCallback={onDividendImported}
          />
        ))}
      </Stack>
    );
  }

  return <div>{t("No dividends found on the CSV file")}</div>;
}
