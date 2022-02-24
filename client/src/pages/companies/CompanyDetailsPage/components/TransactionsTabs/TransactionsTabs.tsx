import React, { ReactElement } from "react";
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

  return (
    <Tabs
      defaultActiveKey={query.get("tab") || "shares"}
      onChange={(activeKey: string) => {
        navigate({
          pathname: window.location.pathname,
          search: `?tab=${activeKey}`,
        });
      }}
    >
      <Tabs.TabPane tab={t("Shares")} key="shares">
        <SharesTabPane
          companyBaseCurrency={companyBaseCurrency}
          portfolioBaseCurrency={portfolioBaseCurrency}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab={t("Dividends")} key="dividends">
        <DividendsTabPane
          companyDividendsCurrency={companyDividendsCurrency}
          portfolioBaseCurrency={portfolioBaseCurrency}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab={t("Rights")} key="rights">
        <RightsTabPane
          companyBaseCurrency={companyBaseCurrency}
          portfolioBaseCurrency={portfolioBaseCurrency}
        />
      </Tabs.TabPane>
    </Tabs>
  );
}
