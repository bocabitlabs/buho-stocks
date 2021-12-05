import React, { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader, Spin } from "antd";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { CompaniesContext } from "contexts/companies";

const SharesTransactionEditPageHeader: FC = ({ children }) => {
  const { t } = useTranslation();
  const { company } = useContext(CompaniesContext);

  if (!company) {
    return <Spin />;
  }
  return (
    <PageHeader
      className="site-page-header"
      title={`${t("Edit sares transaction for")} ${company?.name} (${
        company.ticker
      })`}
      tags={[
        <CountryFlag code={company.countryCode} key={company.countryCode} />
      ]}
    >
      {children}
    </PageHeader>
  );
};

export default SharesTransactionEditPageHeader;
