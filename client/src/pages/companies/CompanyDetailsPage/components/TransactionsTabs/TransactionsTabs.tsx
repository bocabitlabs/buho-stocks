import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import DividendsTabPane from "../DividendsTabPane/DividendsTabPane";
import RightsTabPane from "../RightsTabPane/RightsTabPane";
import SharesTabPane from "../SharesTabPane/SharesTabPane";
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

  const items = [
    {
      label: t("Dividends"),
      key: "dividends",
      children: (
        <DividendsTabPane
          companyDividendsCurrency={companyDividendsCurrency}
          portfolioBaseCurrency={portfolioBaseCurrency}
        />
      ),
    },
    {
      label: t("Shares"),
      key: "shares",
      children: (
        <SharesTabPane
          companyBaseCurrency={companyBaseCurrency}
          portfolioBaseCurrency={portfolioBaseCurrency}
        />
      ),
    },
    {
      label: t("Rights"),
      key: "rights",
      children: (
        <RightsTabPane
          companyBaseCurrency={companyBaseCurrency}
          portfolioBaseCurrency={portfolioBaseCurrency}
        />
      ),
    },
  ];

  return (
    <Tabs
      items={items}
      defaultActiveKey={query.get("tab") || "dividends"}
      onChange={(activeKey: string) => {
        navigate({
          pathname: window.location.pathname,
          search: `?tab=${activeKey}`,
        });
      }}
    />
  );
}
