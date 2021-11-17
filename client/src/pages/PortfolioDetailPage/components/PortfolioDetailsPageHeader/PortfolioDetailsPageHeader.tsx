import React, { FC, ReactNode, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, PageHeader, Popconfirm, Spin } from "antd";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { PortfoliosContext } from "contexts/portfolios";

interface Props {
  portfolioId: number;
  children: ReactNode;
}

const PortfolioDetailsPageHeader: FC<Props> = ({
  portfolioId,
  children
}: Props) => {
  const { t } = useTranslation();
  const {
    portfolio,
    getById: getPortfolioById,
    deleteById: deletePortfolioById
  } = useContext(PortfoliosContext);
  const history = useHistory();

  function confirm() {
    deletePortfolioById(portfolioId);
  }

  useEffect(() => {
    console.log(`Get portfolio details by ID:${+portfolioId}`);
    const getDetails = async () => {
      getPortfolioById(portfolioId);
    };
    getDetails();
  }, [getPortfolioById, portfolioId]);

  if (!portfolio) {
    return <Spin />;
  }
  return (
    <PageHeader
      className="site-page-header"
      title={portfolio?.name}
      subTitle={portfolio?.description}
      tags={[
        <CountryFlag
          code={portfolio.baseCurrency.country}
          key={portfolio.baseCurrency.country}
        />
      ]}
      extra={[
        <Button
          type="primary"
          key="company-add-header"
          icon={<PlusOutlined />}
          onClick={() => {
            history.push(`/app/portfolios/${portfolioId}/companies/add`);
          }}
        >
          {t("Company")}
        </Button>,
        <Popconfirm
          key="portfolio-delete-header"
          title="Delete this portfolio?"
          onConfirm={() => confirm()}
          okText={t("Yes")}
          cancelText={t("No")}
        >
          <Button icon={<DeleteOutlined />} danger>
            {t("Delete")}
          </Button>
        </Popconfirm>
      ]}
    >
      {children}
    </PageHeader>
  );
};

export default PortfolioDetailsPageHeader;
