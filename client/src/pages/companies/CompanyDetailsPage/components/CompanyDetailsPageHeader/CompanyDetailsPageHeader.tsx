import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, PageHeader, Popconfirm } from "antd";
import useFetch from "use-http";

interface Props {
  companyName: string;
  companyTicker: string;
  companyLogo: string;
  children: ReactNode;
}

function CompanyDetailsPageHeader({
  companyName,
  companyTicker,
  companyLogo,
  children
}: Props) {
  const { t } = useTranslation();
  const params = useParams();
  const { id, companyId } = params;
  const companyIdString: string = companyId!;
  const { del: deleteCompany } = useFetch(`portfolios/${id}/companies`);

  function confirmDelete() {
    deleteCompany(`${+companyIdString}/`);
  }

  return (
    <PageHeader
      className="site-page-header"
      title={`${companyName} (${companyTicker})`}
      avatar={{ src: companyLogo }}
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
        </Popconfirm>
      ]}
    >
      {children}
    </PageHeader>
  );
}

export default CompanyDetailsPageHeader;
