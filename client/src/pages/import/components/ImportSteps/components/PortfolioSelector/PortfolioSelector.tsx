import { useTranslation } from "react-i18next";
import { Group, Loader, Select, Stack, Text } from "@mantine/core";
import { usePortfolios } from "hooks/use-portfolios/use-portfolios";
import { IPortfolio } from "types/portfolio";

interface Props {
  onSelect: (portfolioId: number) => void;
}

export default function PortfolioSelector({ onSelect }: Props) {
  const { t } = useTranslation();
  const {
    data,
    isLoading,
    // error: errorFetchingPortfolios,
  } = usePortfolios();

  const onPortfolioSelect = (value: string | null) => {
    if (value === null) {
      return;
    }
    onSelect(+value);
  };

  const selectOptions = data?.map((portfolio: IPortfolio) => ({
    value: portfolio.id.toString(),
    label: portfolio.name,
  }));

  if (isLoading || !data) {
    return <Loader />;
  }

  return (
    <Stack>
      <Text>
        {t("Select a portfolio to import transactions and the dividends.")}
      </Text>
      <Group>
        <Select
          onChange={onPortfolioSelect}
          data={selectOptions}
          searchable
          placeholder={t<string>("Select a portfolio")}
        />
      </Group>
    </Stack>
  );
}
