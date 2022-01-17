import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { Button, PageHeader } from "antd";
import breadCrumbRender from "breadcrumbs";

interface Props {
  children: ReactNode;
}

function SectorsPageHeader({ children }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const routes = [
    {
      path: `/app/sectors`,
      breadcrumbName: t("Sectors"),
    },
  ];
  return (
    <PageHeader
      className="site-page-header"
      title={t("Sectors")}
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
          {t("Add sector")}
        </Button>,
        [
          <Button
            key="add-super-button"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              navigate("super/add");
            }}
          >
            {t("Add super sector")}
          </Button>,
        ],
      ]}
    >
      {children}
    </PageHeader>
  );
}

export default SectorsPageHeader;
