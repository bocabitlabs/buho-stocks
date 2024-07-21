import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Alert } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { List } from "antd";
import PortfolioCard from "../PortfolioCard/PortfolioCard";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import { usePortfolios } from "hooks/use-portfolios/use-portfolios";

export default function PortfolioList(): ReactElement {
  const { t } = useTranslation();
  const { isFetching, data: portfolios, error } = usePortfolios();
  const icon = <IconAlertTriangle />;

  if (isFetching) {
    return <LoadingSpin />;
  }

  if (error) {
    return (
      <Alert
        icon={icon}
        title={t("Unable to load portfolios")}
        variant="filled"
        color="red"
      >
        {error.message}
      </Alert>
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
        <Link to={`/portfolios/${item.id}`}>
          <List.Item>
            <PortfolioCard portfolio={item} />
          </List.Item>
        </Link>
      )}
    />
  );
}
