import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BarChart } from "@mantine/charts";
import { Center, Loader, Stack, Title } from "@mantine/core";
import i18next from "i18next";
import { CompanyYearStats } from "types/company-year-stats";

interface Props {
  stats: CompanyYearStats[];
  portfolioCurrency: string;
}

export default function ChartCompanyDividends({
  stats,
  portfolioCurrency,
}: Props) {
  const { t } = useTranslation();

  const { resolvedLanguage } = i18next;

  const numberFormatter = new Intl.NumberFormat(resolvedLanguage, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const chartStats = useMemo(() => {
    if (stats) {
      const newYears: number[] = [];
      const dividendsPerYear: {
        year: number;
        value: number;
      }[] = [];
      stats.forEach((year) => {
        if (!newYears.includes(year.year) && year.year !== 9999) {
          newYears.push(year.year);
          dividendsPerYear.push({
            year: year.year,
            value: Number(year.dividends),
          });
        }
      });
      return dividendsPerYear;
    }
  }, [stats]);

  if (!chartStats) {
    return <Loader />;
  }

  if (stats && portfolioCurrency && chartStats) {
    return (
      <Stack>
        <Center>
          <Title order={5}>{t("Dividends")}</Title>
        </Center>
        <Center>
          <BarChart
            h={400}
            data={chartStats}
            dataKey="year"
            series={[{ name: "value", color: "red" }]}
            valueFormatter={(value: number) =>
              `${numberFormatter.format(value)} ${portfolioCurrency}`
            }
          />
        </Center>
      </Stack>
    );
  }
  return null;
}
