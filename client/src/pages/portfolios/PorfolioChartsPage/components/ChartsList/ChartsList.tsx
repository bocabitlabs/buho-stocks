import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  Affix,
  Button,
  Container,
  Grid,
  Paper,
  rem,
  Select,
  Stack,
  Transition,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";
import ChartBrokerByCompanyProvider from "./components/ChartBrokerByCompany/ChartBrokerByCompanyProvider";
import ChartCurrenciesByCompanyProvider from "./components/ChartCurrenciesByCompany/ChartCurrenciesByCompanyProvider";
import ChartDividendsByCompanyProvider from "./components/ChartDividendsByCompany/ChartDividendsByCompanyProvider";
import ChartInvestedByCompanyProvider from "./components/ChartInvestedByCompany/ChartInvestedByCompanyProvider";
import ChartInvestedByCompanyYearlyProvider from "./components/ChartInvestedByCompanyYearly/ChartInvestedByCompanyYearlyProvider";
import ChartMarketsByCompanyProvider from "./components/ChartMarketByCompany/ChartMarketsByCompanyProvider";
import ChartPortfolioDividendsPerMonthProvider from "./components/ChartPortfolioDividendsPerMonth/ChartPortfolioDividendsPerMonthProvider";
import ChartSectorsByCompanyProvider from "./components/ChartSectorsByCompany/ChartSectorsByCompanyProvider";
import ChartSuperSectorsByCompanyProvider from "./components/ChartSuperSectorsByCompany/ChartSuperSectorsByCompanyProvider";
import ChartValueByCompanyProvider from "./components/ChartValueByCompany/ChartValueByCompanyProvider";
import ChartPortfolioDividendsProvider from "components/ChartPortfolioDividends/ChartPortfolioDividendsProvider";
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
      <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
        <Paper p="xl" shadow="xs">
          <ChartPortfolioReturnsProvider />
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
        <Paper p="xl" shadow="xs">
          <ChartPortfolioDividendsProvider />
        </Paper>
      </Grid.Col>

      <Grid.Col span={12}>
        <Paper p="xl" shadow="xs">
          <ChartPortfolioDividendsPerMonthProvider />
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
                  {t("Scroll to top")}
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
              <ChartInvestedByCompanyProvider
                selectedYear={selectedYear}
                currency={portfolio?.baseCurrency.code}
              />
            </Paper>
          </Grid.Col>

          <Grid.Col span={12}>
            <Paper p="xl" shadow="xs">
              <ChartInvestedByCompanyYearlyProvider
                selectedYear={selectedYear}
                currency={portfolio?.baseCurrency.code}
              />
            </Paper>
          </Grid.Col>

          <Grid.Col span={12}>
            <Paper p="xl" shadow="xs">
              <ChartValueByCompanyProvider
                selectedYear={selectedYear}
                currency={portfolio?.baseCurrency.code}
              />
            </Paper>
          </Grid.Col>
          <Grid.Col span={12}>
            <Container size="xs">
              <Paper p="xl" shadow="xs">
                <ChartDividendsByCompanyProvider
                  selectedYear={selectedYear}
                  currency={portfolio?.baseCurrency.code}
                />
              </Paper>
            </Container>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Paper p="xl" shadow="xs">
              <ChartSectorsByCompanyProvider selectedYear={selectedYear} />
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Paper p="xl" shadow="xs">
              <ChartSuperSectorsByCompanyProvider selectedYear={selectedYear} />
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <Paper p="xl" shadow="xs">
              <ChartCurrenciesByCompanyProvider selectedYear={selectedYear} />
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <Paper p="xl" shadow="xs">
              <ChartBrokerByCompanyProvider selectedYear={selectedYear} />
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <Paper p="xl" shadow="xs">
              <ChartMarketsByCompanyProvider selectedYear={selectedYear} />
            </Paper>
          </Grid.Col>
        </>
      )}
    </Grid>
  );
}
