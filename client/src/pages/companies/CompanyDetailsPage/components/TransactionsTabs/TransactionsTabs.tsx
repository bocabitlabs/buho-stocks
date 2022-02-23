import React, { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Tabs } from "antd";
import DividendsListTable from "../DividendsListTable/DividendsListTable";
import RightsListTable from "../RightsListTable/RightsListTable";
import SharesListTable from "../SharesListTable/SharesListTable";
import SharesTransactionAddEditForm from "../SharesTransactionAddEditForm/SharesTransactionAddEditForm";
import { useQueryParameters } from "hooks/use-query-params/use-query-params";
import DividendsTransactionAddEditForm from "pages/companies/CompanyDetailsPage/components/DividendsTransactionAddEditForm/DividendsTransactionAddEditForm";
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
  const { companyId } = useParams();
  const [isDividendsModalVisible, setIsDividendsModalVisible] = useState(false);
  const [isSharesModalVisible, setIsSharesModalVisible] = useState(false);

  const showDividendsModal = () => {
    setIsDividendsModalVisible(true);
  };

  const showSharesModal = () => {
    setIsSharesModalVisible(true);
  };

  const onDividendsCreate = (values: any) => {
    console.log("Received values of form: ", values);
    setIsDividendsModalVisible(false);
  };

  const onSharesCreate = (values: any) => {
    console.log("Received values of form: ", values);
    setIsSharesModalVisible(false);
  };

  const onDividendsCancel = () => {
    setIsDividendsModalVisible(false);
  };

  const onSharesCancel = () => {
    setIsDividendsModalVisible(false);
  };

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
          onClick={showSharesModal}
          style={{ marginBottom: 16 }}
        >
          {t("+ Shares")}
        </Button>
        <SharesTransactionAddEditForm
          title="Add shares transaction"
          okText="Create"
          companyId={+companyId!}
          isModalVisible={isSharesModalVisible}
          onCreate={onSharesCreate}
          onCancel={onSharesCancel}
          companyBaseCurrency={companyBaseCurrency}
          portfolioBaseCurrency={portfolioBaseCurrency}
        />
        <SharesListTable
          companyBaseCurrency={companyBaseCurrency}
          portfolioBaseCurrency={portfolioBaseCurrency}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab={t("Dividends")} key="dividends">
        <Button
          key="add-dividends-button"
          type="primary"
          onClick={showDividendsModal}
          style={{ marginBottom: 16 }}
        >
          {t("+ Dividends")}
        </Button>
        <DividendsTransactionAddEditForm
          title="Add dividends transaction"
          okText="Create"
          companyId={+companyId!}
          isModalVisible={isDividendsModalVisible}
          onCreate={onDividendsCreate}
          onCancel={onDividendsCancel}
          companyDividendsCurrency={companyDividendsCurrency}
          portfolioBaseCurrency={portfolioBaseCurrency}
        />
        <DividendsListTable
          companyDividendsCurrency={companyDividendsCurrency}
          portfolioBaseCurrency={portfolioBaseCurrency}
        />
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
