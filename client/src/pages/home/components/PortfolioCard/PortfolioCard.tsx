import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "antd";
import PortfolioAllStats from "./components/PortfolioAllStats/PortfolioAllStats";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { IPortfolio } from "types/portfolio";

interface Props {
  portfolio: IPortfolio;
}

export default function PortfolioCard({ portfolio }: Props): ReactElement {
  const { t } = useTranslation();

  return (
    <Card
      title={portfolio.name}
      hoverable
      extra={<CountryFlag code={portfolio.baseCurrency.code} />}
    >
      {portfolio.companies.length} {t("companies")}
      <PortfolioAllStats portfolioId={portfolio.id} />
    </Card>
  );
}
