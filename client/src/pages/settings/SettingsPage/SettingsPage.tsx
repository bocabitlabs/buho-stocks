import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid, rem, Tabs } from "@mantine/core";
import {
  IconCashBanknote,
  IconCurrencyDollar,
  IconSettings,
} from "@tabler/icons-react";
import SettingsForm from "./components/SettingsForm/SettingsForm";
import SettingsPageHeader from "./components/SettingsHeader/SettingsHeader";
import StockPricesListTable from "./components/StockPricesListTable/StockPricesListTable";
import ExchangeRatesListTable from "pages/settings/SettingsPage/components/ExchangeRatesListTable/ExchangeRatesListTable";

export default function SettingsPage(): ReactElement {
  const { t } = useTranslation();
  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <Grid p={20}>
      <Grid.Col span={12}>
        <SettingsPageHeader />
      </Grid.Col>
      <Grid.Col span={12}>
        <Tabs defaultValue="settings">
          <Tabs.List>
            <Tabs.Tab
              value="settings"
              leftSection={<IconSettings style={iconStyle} />}
            >
              {t("Application Settings")}
            </Tabs.Tab>
            <Tabs.Tab
              value="exchange-rates"
              leftSection={<IconCurrencyDollar style={iconStyle} />}
            >
              {t("Exchange Rates")}
            </Tabs.Tab>
            <Tabs.Tab
              value="stock-prices"
              leftSection={<IconCashBanknote style={iconStyle} />}
            >
              {t("Stock Prices")}
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="settings">
            <SettingsForm />
          </Tabs.Panel>

          <Tabs.Panel value="exchange-rates">
            <ExchangeRatesListTable />
          </Tabs.Panel>

          <Tabs.Panel value="stock-prices">
            <StockPricesListTable />
          </Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
