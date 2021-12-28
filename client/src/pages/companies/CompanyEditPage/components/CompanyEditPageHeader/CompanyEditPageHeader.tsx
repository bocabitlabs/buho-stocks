import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, PageHeader, Popconfirm } from "antd";
import CountryFlag from "components/CountryFlag/CountryFlag";

interface Props {
  companyName: string;
  companyTicker: string;
  companyCountryCode: string;
  children: ReactNode;
}

function CompanyEditPageHeader({
  companyName,
  companyTicker,
  companyCountryCode,
  children,
}: Props) {
  const { t } = useTranslation();

  const params = useParams();
  const { companyId } = params;
  // const companyIdString: string = companyId!;

  function confirmDelete() {
    // deleteCompanyById(+companyIdString);
  }

  return (
    <PageHeader
      className="site-page-header"
      title={`${companyName} - ${companyTicker} - (#${companyId})`}
      tags={[
        <CountryFlag code={companyCountryCode} key={companyCountryCode} />,
      ]}
      extra={[
        <Popconfirm
          key="portfolio-delete-header"
          title="Delete this company?"
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

export default CompanyEditPageHeader;
