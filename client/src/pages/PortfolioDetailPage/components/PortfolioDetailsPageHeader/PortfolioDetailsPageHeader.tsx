import React, { FC, ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, PageHeader, Popconfirm, Spin } from "antd";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { PortfoliosContext } from "contexts/portfolios";

interface Props {
  children: ReactNode;
}

export interface IParams {
  id: string;
}

const PortfolioDetailsPageHeader: FC<Props> = ({ children }: Props) => {
  const { t } = useTranslation();
  const { portfolio, deleteById: deletePortfolioById } =
    useContext(PortfoliosContext);
  const history = useHistory();
  const params = useParams<IParams>();
  const { id } = params;
  console.log("ID: ", id);

  function confirm() {
    deletePortfolioById(+id);
  }

  if (!portfolio) {
    return <Spin />;
  }
  return (
    <PageHeader
      className="site-page-header"
      title={portfolio?.name}
      subTitle={portfolio?.description}
      tags={[
        <CountryFlag code={portfolio.countryCode} key={portfolio.countryCode} />
      ]}
      extra={[
        <Button
          type="primary"
          key="company-add-header"
          icon={<PlusOutlined />}
          onClick={() => {
            history.push(`/app/portfolios/${id}/companies/add`);
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
