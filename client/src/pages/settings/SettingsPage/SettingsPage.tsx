import React, { ReactElement, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Loader, rem, Tabs } from "@mantine/core";
import {
  IconCashBanknote,
  IconCurrencyDollar,
  IconSettings,
} from "@tabler/icons-react";
import SettingsFormProvider from "./components/SettingsForm/SettingsFormProvider";
import SettingsPageHeader from "./components/SettingsHeader/SettingsHeader";
import StockPricesListTable from "./components/StockPricesListTable/StockPricesListTable";
import {
  LanguageContext,
  LanguageProvider,
} from "components/ListLanguageProvider/ListLanguageProvider";
import ExchangeRatesListTable from "pages/settings/SettingsPage/components/ExchangeRatesListTable/ExchangeRatesListTable";

function ExchangeRatesListTableContent() {
  const mrtLocalization = useContext(LanguageContext);

  return mrtLocalization ? (
    <ExchangeRatesListTable mrtLocalization={mrtLocalization} />
  ) : (
    <Loader />
  );
}

function StockPricesListTableContent() {
  const mrtLocalization = useContext(LanguageContext);

  return mrtLocalization ? (
    <StockPricesListTable mrtLocalization={mrtLocalization} />
  ) : (
    <Loader />
  );
}

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
            <SettingsFormProvider />
          </Tabs.Panel>

          <Tabs.Panel value="exchange-rates">
            <LanguageProvider>
              <ExchangeRatesListTableContent />
            </LanguageProvider>
          </Tabs.Panel>

          <Tabs.Panel value="stock-prices">
            <LanguageProvider>
              <StockPricesListTableContent />
            </LanguageProvider>
          </Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
