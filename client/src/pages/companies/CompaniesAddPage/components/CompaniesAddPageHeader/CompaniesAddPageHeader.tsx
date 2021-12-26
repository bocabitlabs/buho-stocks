import React, { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "antd";

interface Props {
  portfolioId: string;
  children: ReactNode;
}

const CompanyAddPageHeader: FC<Props> = ({ portfolioId, children }: Props) => {
  const { t } = useTranslation();

  return (
    <PageHeader
      className="site-page-header"
      title={t(`Add new company to portfolio `) + portfolioId}
    >
      {children}
    </PageHeader>
  );
};

export default CompanyAddPageHeader;
