import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Tabs } from "antd";
import DividendsListTable from "../DividendsListTable/DividendsListTable";
import RightsListTable from "../RightsListTable/RightsListTable";
import SharesListTable from "../SharesListTable/SharesListTable";
import { useQueryParameters } from "hooks/use-query-params/use-query-params";

export default function TransactionsTabs(): ReactElement {
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
        <Button
          key="add-shares-button"
          type="primary"
          onClick={() => {
            navigate(`shares/add`);
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
            navigate(`dividends/add`);
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
            navigate(`rights/add`);
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
