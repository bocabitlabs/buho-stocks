import React, { ReactNode } from "react";
import { PageHeader, Spin } from "antd";
import CountryFlag from "components/CountryFlag/CountryFlag";

interface Props {
  portfolioName: string;
  portfolioDescription: string;
  portfolioCountryCode: string;
  children: ReactNode;
}

function PortfolioDetailsPageHeader({
  portfolioName,
  portfolioDescription,
  portfolioCountryCode,
  children,
}: Props) {
  if (!portfolioName) {
    return <Spin />;
  }
  return (
    <PageHeader
      className="site-page-header"
      title={portfolioName}
      subTitle={portfolioDescription}
      tags={[
        <CountryFlag code={portfolioCountryCode} key={portfolioCountryCode} />,
      ]}
    >
      {children}
    </PageHeader>
  );
}

export default PortfolioDetailsPageHeader;
