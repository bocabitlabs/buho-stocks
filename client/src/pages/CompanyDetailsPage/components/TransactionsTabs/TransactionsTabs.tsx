import React, { ReactElement, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Spin, Tabs } from "antd";
import DividendsListTable from "../DividendsListTable/DividendsListTable";
import RightsListTable from "../RightsListTable/RightsListTable";
import SharesListTable from "../SharesListTable/SharesListTable";
import { CompaniesContext } from "contexts/companies";
import { useQueryParameters } from "hooks/use-query-params/use-query-params";

// interface Props {}

export default function TransactionsTabs(): ReactElement {
  const { t } = useTranslation();
  const history = useHistory();
  const { isLoading, company } = useContext(CompaniesContext);
  const query = useQueryParameters();
  console.log(query);

  if (isLoading || !company) {
    return <Spin />;
  }

  return (
    <Tabs
      defaultActiveKey={query.get("tab") || "shares"}
      onChange={(activeKey: string) => {
        console.debug("Tab click");
        console.log(activeKey);
        history.push({
          pathname: window.location.pathname,
          search: `?tab=${activeKey}`
        });
      }}
    >
      <Tabs.TabPane tab={t("Shares")} key="shares">
        <Button
          key="add-shares-button"
          type="primary"
          onClick={() => {
            history.push(
              `/app/portfolios/${company.portfolio}/companies/${company.id}/shares/add`
            );
          }}
          style={{ marginBottom: 16 }}
        >
          {t("+ Shares")}
        </Button>
        <SharesListTable />
      </Tabs.TabPane>
      <Tabs.TabPane tab={t("Dividends")} key="dividends">
        <Button
          key="add-dividends-button"
          type="primary"
          onClick={() => {
            history.push(
              `/app/portfolios/${company.portfolio}/companies/${company.id}/dividends/add`
            );
          }}
          style={{ marginBottom: 16 }}
        >
          {t("+ Dividends")}
        </Button>
        <DividendsListTable />
      </Tabs.TabPane>
      <Tabs.TabPane tab={t("Rights")} key="rights">
        <Button
          key="add-rights-button"
          type="primary"
          onClick={() => {
            history.push(
              `/app/portfolios/${company.portfolio}/companies/${company.id}/rights/add`
            );
          }}
          style={{ marginBottom: 16 }}
        >
          {t("+ Rights")}
        </Button>
        <RightsListTable />
      </Tabs.TabPane>
    </Tabs>
  );
}
