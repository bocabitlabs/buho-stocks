import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { Button, PageHeader } from "antd";
import breadCrumbRender from "breadcrumbs";

interface Props {
  children: ReactNode;
}
function MarketsPageHeader({ children }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const routes = [
    {
      path: `/app/markets`,
      breadcrumbName: t("Markets"),
    },
  ];
  return (
    <PageHeader
      className="site-page-header"
      title={t("Markets")}
      breadcrumb={{ routes }}
      breadcrumbRender={breadCrumbRender}
      extra={[
        <Button
          key="add-button"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            navigate("add");
          }}
        >
          {t("Add market")}
        </Button>,
      ]}
    >
      {children}
    </PageHeader>
  );
}

export default MarketsPageHeader;
