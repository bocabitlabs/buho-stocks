import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "antd";

interface Props {
  portfolioId: string;
  children: ReactNode;
}

function CompanyAddPageHeader({ portfolioId, children }: Props) {
  const { t } = useTranslation();

  return (
    <PageHeader
      className="site-page-header"
      title={t(`Add new company to portfolio `) + portfolioId}
    >
      {children}
    </PageHeader>
  );
}

export default CompanyAddPageHeader;
