import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  Affix,
  Button,
  Grid,
  Paper,
  rem,
  Select,
  Stack,
  Transition,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";
import ChartBrokerByCompany from "./components/ChartBrokerByCompany/ChartBrokerByCompany";
import ChartCurrenciesByCompany from "./components/ChartCurrenciesByCompany/ChartCurrenciesByCompany";
import ChartDividendsByCompany from "./components/ChartDividendsByCompany/ChartDividendsByCompany";
import ChartInvestedByCompany from "./components/ChartInvestedByCompany/ChartInvestedByCompany";
import ChartInvestedByCompanyYearly from "./components/ChartInvestedByCompanyYearly/ChartInvestedByCompanyYearly";
import ChartMarketByCompany from "./components/ChartMarketByCompany/ChartMarketByCompany";
import ChartPortfolioDividendsPerMonth from "./components/ChartPortfolioDividendsPerMonth/ChartPortfolioDividendsPerMonth";
import ChartSectorsByCompany from "./components/ChartSectorsByCompany/ChartSectorsByCompany";
import ChartSuperSectorsByCompany from "./components/ChartSuperSectorsByCompany/ChartSuperSectorsByCompany";
import ChartValueByCompany from "./components/ChartValueByCompany/ChartValueByCompany";
import ChartPortfolioDividends from "components/ChartPortfolioDividends/ChartPortfolioDividends";
import ChartPortfolioReturnsProvider from "components/ChartPortfolioReturns/ChartPortfolioReturnsProvider";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";

export default function ChartsList() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(
    new Date().getFullYear().toString(),
  );
  const [scroll, scrollTo] = useWindowScroll();

  const { data: portfolio } = usePortfolio(+id!);

  useEffect(() => {
    async function loadFirstYear() {
      const currentYear = new Date().getFullYear();
      const newYears = [];
      if (portfolio && portfolio.firstYear != null) {
        for (
          let index = +currentYear;
          index >= +portfolio.firstYear;
          index -= 1
        ) {
          newYears.push(index.toString());
        }
        setYears(newYears);
      }
    }
    loadFirstYear();
  }, [portfolio]);

  return (
    <Grid>
      <Grid.Col span={6}>
        <Paper p="xl" shadow="xs">
          <ChartPortfolioReturnsProvider />
        </Paper>
      </Grid.Col>
      <Grid.Col span={6}>
        <Paper p="xl" shadow="xs">
          <ChartPortfolioDividends />
        </Paper>
      </Grid.Col>

      <Grid.Col span={12}>
        <Paper p="xl" shadow="xs">
          <ChartPortfolioDividendsPerMonth />
        </Paper>
      </Grid.Col>

      <Affix position={{ bottom: 20, right: 20 }}>
        <Paper p="md" shadow="xs">
          <Stack>
            <Select
              label={t("Select a year")}
              style={{ width: 120 }}
              onChange={setSelectedYear}
              data={years}
              value={selectedYear ?? new Date().getFullYear().toString()}
            />
            <Transition transition="slide-up" mounted={scroll.y > 0}>
              {(transitionStyles) => (
                <Button
                  leftSection={
                    <IconArrowUp style={{ width: rem(16), height: rem(16) }} />
                  }
                  style={transitionStyles}
                  onClick={() => scrollTo({ y: 0 })}
                >
                  Scroll to top
                </Button>
              )}
            </Transition>
          </Stack>
        </Paper>
      </Affix>

      {selectedYear && (
        <>
          <Grid.Col span={12}>
            <Paper p="xl" shadow="xs">
              <ChartInvestedByCompany
                selectedYear={selectedYear}
                currency={portfolio?.baseCurrency.code}
              />
            </Paper>
          </Grid.Col>

          <Grid.Col span={12}>
            <Paper p="xl" shadow="xs">
              <ChartInvestedByCompanyYearly
                selectedYear={selectedYear}
                currency={portfolio?.baseCurrency.code}
              />
            </Paper>
          </Grid.Col>

          <Grid.Col span={12}>
            <Paper p="xl" shadow="xs">
              <ChartValueByCompany
                selectedYear={selectedYear}
                currency={portfolio?.baseCurrency.code}
              />
            </Paper>
          </Grid.Col>
          <Grid.Col span={12}>
            <Paper p="xl" shadow="xs">
              <ChartDividendsByCompany selectedYear={selectedYear} />
            </Paper>
          </Grid.Col>
          <Grid.Col span={6}>
            <Paper p="xl" shadow="xs">
              <ChartSectorsByCompany selectedYear={selectedYear} />
            </Paper>
          </Grid.Col>
          <Grid.Col span={6}>
            <Paper p="xl" shadow="xs">
              <ChartSuperSectorsByCompany selectedYear={selectedYear} />
            </Paper>
          </Grid.Col>
          <Grid.Col span={4}>
            <Paper p="xl" shadow="xs">
              <ChartCurrenciesByCompany selectedYear={selectedYear} />
            </Paper>
          </Grid.Col>
          <Grid.Col span={4}>
            <Paper p="xl" shadow="xs">
              <ChartBrokerByCompany selectedYear={selectedYear} />
            </Paper>
          </Grid.Col>
          <Grid.Col span={4}>
            <Paper p="xl" shadow="xs">
              <ChartMarketByCompany selectedYear={selectedYear} />
            </Paper>
          </Grid.Col>
        </>
      )}
    </Grid>
  );
}
