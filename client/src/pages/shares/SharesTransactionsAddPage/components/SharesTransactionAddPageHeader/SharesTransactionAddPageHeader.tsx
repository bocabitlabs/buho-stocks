import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "antd";
import CountryFlag from "components/CountryFlag/CountryFlag";

interface Props {
  companyName: string;
  companyTicker: string;
  companyCountryCode: string;
  children: ReactNode;
}

const SharesTransactionAddPageHeader = ({
  companyName,
  companyTicker,
  companyCountryCode,
  children
}: Props) => {
  const { t } = useTranslation();

  return (
    <PageHeader
      className="site-page-header"
      title={`${t("Add a new shares to")} ${companyName} (${companyTicker})`}
      tags={[
        <CountryFlag code={companyCountryCode} key={companyCountryCode} />
      ]}
    >
      {children}
    </PageHeader>
  );
};

export default SharesTransactionAddPageHeader;
