import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Alert, List } from "antd";
import PortfolioCard from "../PortfolioCard/PortfolioCard";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import { usePortfolios } from "hooks/use-portfolios/use-portfolios";
import { IPortfolio } from "types/portfolio";

export default function PortfolioList(): ReactElement {
  const { t } = useTranslation();
  const { isFetching, data: portfolios, error } = usePortfolios();

  if (isFetching) {
    return <LoadingSpin />;
  }

  if (error) {
    return (
      <Alert
        showIcon
        message={t("Unable to load portfolios")}
        description={error.message}
        type="error"
      />
    );
  }

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 3,
        xxl: 4,
      }}
      dataSource={portfolios}
      renderItem={(item) => (
        <Link to={`/app/portfolios/${(item as IPortfolio).id}`}>
          <List.Item>
            <PortfolioCard portfolio={item as IPortfolio} />
          </List.Item>
        </Link>
      )}
    />
  );
}
