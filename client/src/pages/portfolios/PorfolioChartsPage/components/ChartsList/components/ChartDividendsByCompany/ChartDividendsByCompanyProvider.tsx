import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Center, Loader, Stack, Title } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import ChartDividendsByCompany from "./ChartDividendsByCompany";
import { usePortfolioYearStatsByCompany } from "hooks/use-stats/use-portfolio-stats";

type Props = { selectedYear: string; currency: string };

export default function ChartDividendsByCompanyProvider({
  selectedYear,
  currency,
}: Props) {
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
          <Title order={5}>{t("Dividends by company")}</Title>
        </Center>
        <Center ref={ref}>
          <ChartDividendsByCompany
            data={statsData}
            width={width}
            currency={currency}
          />
        </Center>
      </Stack>
    );
  }
  return null;
}
