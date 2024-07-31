import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { rem, Tabs } from "@mantine/core";
import {
  IconCashBanknote,
  IconMoneybag,
  IconPigMoney,
} from "@tabler/icons-react";
import DividendsTabPane from "./components/DividendsTabPane/DividendsTabPane";
import RightsTabPane from "./components/RightsTabPane/RightsTabPane";
import SharesTabPane from "./components/SharesTabPane/SharesTabPane";
import { useQueryParameters } from "hooks/use-query-params/use-query-params";
import { ICurrency } from "types/currency";

interface IProps {
  companyBaseCurrency: ICurrency;
  companyDividendsCurrency: ICurrency;
  portfolioBaseCurrency: string;
}

export default function TransactionsTabs({
  companyBaseCurrency,
  companyDividendsCurrency,
  portfolioBaseCurrency,
}: IProps): ReactElement {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const query = useQueryParameters();
  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <Tabs
      defaultValue={query.get("tab") || "dividends"}
      onChange={(activeKey) => {
        navigate({
          pathname: window.location.pathname,
          search: `?tab=${activeKey}`,
        });
      }}
    >
      <Tabs.List>
        <Tabs.Tab
          value="dividends"
          leftSection={<IconPigMoney style={iconStyle} />}
        >
          {t("Dividends")}
        </Tabs.Tab>
        <Tabs.Tab
          value="shares"
          leftSection={<IconCashBanknote style={iconStyle} />}
        >
          {t("Shares")}
        </Tabs.Tab>
        <Tabs.Tab
          value="rights"
          leftSection={<IconMoneybag style={iconStyle} />}
        >
          {t("Rights")}
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="dividends">
        <DividendsTabPane
          companyDividendsCurrency={companyDividendsCurrency}
          portfolioBaseCurrency={portfolioBaseCurrency}
        />
      </Tabs.Panel>

      <Tabs.Panel value="shares">
        <SharesTabPane
          companyBaseCurrency={companyBaseCurrency}
          portfolioBaseCurrency={portfolioBaseCurrency}
        />
      </Tabs.Panel>

      <Tabs.Panel value="rights">
        <RightsTabPane
          companyBaseCurrency={companyBaseCurrency}
          portfolioBaseCurrency={portfolioBaseCurrency}
        />
      </Tabs.Panel>
    </Tabs>
    // <Tabs
    //   items={items}
    //   defaultActiveKey={query.get("tab") || "dividends"}
    //   onChange={(activeKey: string) => {
    //     navigate({
    //       pathname: window.location.pathname,
    //       search: `?tab=${activeKey}`,
    //     });
    //   }}
    // />
  );
}
