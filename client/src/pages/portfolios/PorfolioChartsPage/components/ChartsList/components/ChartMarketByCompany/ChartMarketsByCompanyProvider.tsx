import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Center, Loader, Stack, Title } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import ChartMarketByCompany from "./ChartMarketByCompany";
import { usePortfolioYearStatsByCompany } from "hooks/use-stats/use-portfolio-stats";

interface Props {
  selectedYear: string;
}

export default function ChartMarketsByCompanyProvider({ selectedYear }: Props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const {
    data: statsData,
    isLoading,
    isError,
    error,
  } = usePortfolioYearStatsByCompany(+id!, selectedYear);
  const { ref, width } = useElementSize();
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <div>{error.message ? error.message : t("An error occurred")}</div>;
  }

  if (statsData) {
    return (
      <Stack>
        <Center>
          <Title order={5}>{t("Markets")}</Title>
        </Center>
        <Center ref={ref}>
          <ChartMarketByCompany data={statsData} width={width} />
        </Center>
      </Stack>
    );
  }
  return null;
}
