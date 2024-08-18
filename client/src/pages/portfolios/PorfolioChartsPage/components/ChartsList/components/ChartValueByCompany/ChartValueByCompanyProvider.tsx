import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Center, Loader, Stack, Title } from "@mantine/core";
import ChartValueByCompany from "./ChartValueByCompany";
import { usePortfolioYearStatsByCompany } from "hooks/use-stats/use-portfolio-stats";

type Props = { selectedYear: string; currency: string };

export default function ChartValueByCompanyProvider({
  selectedYear,
  currency,
}: Props) {
  const { id } = useParams();
  const { t } = useTranslation();
  const {
    data: statsData,
    isLoading,
    isError,
    error,
  } = usePortfolioYearStatsByCompany(+id!, selectedYear);
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
          <Title order={5}>
            {t("Portfolio value by company (accumulated)")}
          </Title>
        </Center>
        <Center>
          <ChartValueByCompany data={statsData} currency={currency} />
        </Center>
      </Stack>
    );
  }
  return null;
}
