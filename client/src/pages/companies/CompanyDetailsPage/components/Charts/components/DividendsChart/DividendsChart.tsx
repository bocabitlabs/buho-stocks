import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BarChart } from "@mantine/charts";
import { Center, Loader, Stack, Title } from "@mantine/core";
import i18next from "i18next";

interface Props {
  stats: any;
  portfolioCurrency: string;
}

export default function DividendsChart({ stats, portfolioCurrency }: Props) {
  const { t } = useTranslation();

  const { resolvedLanguage } = i18next;

  const numberFormatter = new Intl.NumberFormat(resolvedLanguage, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (stats) {
      const newYears: any = [];
      //     const dividends: any = [];
      const dividendsPerYear: any = [];
      stats.forEach((year: any) => {
        if (
          !newYears.includes(year.year) &&
          year.year !== "all" &&
          year.year !== 9999
        ) {
          newYears.push(year.year);
          // dividends.push(Number(year.dividends));
          dividendsPerYear.push({
            year: year.year,
            value: Number(year.dividends),
          });
        }
      });
      console.log(dividendsPerYear);
      setData(dividendsPerYear);
    }
  }, [stats, t]);

  if (!data) {
    return <Loader />;
  }

  if (stats && portfolioCurrency && data) {
    console.log(portfolioCurrency);
    return (
      <Stack>
        <Center>
          <Title order={5}>{t("Dividends")}</Title>
        </Center>
        <Center>
          <BarChart
            h={400}
            data={data}
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
  return <div>HELLO</div>;
}
