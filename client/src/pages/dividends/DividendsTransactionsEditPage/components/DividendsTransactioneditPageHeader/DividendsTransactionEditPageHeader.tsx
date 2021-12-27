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

function DividendsTransactionEditPageHeader({
  companyName,
  companyTicker,
  companyCountryCode,
  children
}: Props) {
  const { t } = useTranslation();

  return (
    <PageHeader
      className="site-page-header"
      title={`${t(
        "Edit dividends transaction for"
      )} ${companyName} (${companyTicker})`}
      tags={[
        <CountryFlag code={companyCountryCode} key={companyCountryCode} />
      ]}
    >
      {children}
    </PageHeader>
  );
}

export default DividendsTransactionEditPageHeader;
