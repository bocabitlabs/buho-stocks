import React, { ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  DeleteOutlined,
  LineChartOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, PageHeader, Popconfirm, Spin } from "antd";
import breadCrumbRender from "breadcrumbs";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { AlertMessagesContext } from "contexts/alert-messages";
import { useDeletePortfolio } from "hooks/use-portfolios/use-portfolios";

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { createSuccess, createError } = useContext(AlertMessagesContext);
  const { mutateAsync: deletePortfolio } = useDeletePortfolio();
  const routes = [
    {
      path: `/app/portfolios/${id}`,
      breadcrumbName: portfolioName,
    },
  ];
  const confirmDelete = async () => {
    try {
      await deletePortfolio({ portfolioId: +id! });
      createSuccess(t("Portfolio deleted successfully"));
      navigate(-1);
    } catch (error) {
      createError(t("Error deleting portfolio"));
    }
  };

  if (!portfolioName) {
    return <Spin />;
  }
  return (
    <PageHeader
      className="site-page-header"
      title={portfolioName}
      subTitle={portfolioDescription}
      breadcrumb={{ routes }}
      breadcrumbRender={breadCrumbRender}
      tags={[
        <CountryFlag code={portfolioCountryCode} key={portfolioCountryCode} />,
      ]}
      extra={[
        <Button
          key="company-view-logs"
          icon={<UnorderedListOutlined />}
          onClick={() => {
            navigate(`log`);
          }}
          title={t("View portfolio logs")}
        />,
        <Button
          key="company-view-charts"
          icon={<LineChartOutlined />}
          onClick={() => {
            navigate(`charts`);
          }}
          title={t("View portfolio charts")}
        />,
        <Button
          type="primary"
          key="company-add-header"
          icon={<PlusOutlined />}
          onClick={() => {
            navigate(`companies/add`);
          }}
        >
          {t("Company")}
        </Button>,
        <Popconfirm
          key="portfolio-delete-header"
          title="Delete this portfolio?"
          onConfirm={() => confirmDelete()}
          okText={t("Yes")}
          cancelText={t("No")}
        >
          <Button icon={<DeleteOutlined />} danger>
            {t("Delete")}
          </Button>
        </Popconfirm>,
      ]}
    >
      {children}
    </PageHeader>
  );
}

export default PortfolioDetailsPageHeader;
