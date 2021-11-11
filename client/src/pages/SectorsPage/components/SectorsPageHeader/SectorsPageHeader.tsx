import React, { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { PlusOutlined } from "@ant-design/icons";
import { Button, PageHeader } from "antd";
import getRoute, { SECTORS_ADD_ROUTE } from "routes";

const SectorsPageHeader: FC<ReactNode> = ({ children }) => {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <PageHeader
      className="site-page-header"
      title={t("Sectors")}
      extra={[
        <Button
          key="add-button"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            history.push(getRoute(SECTORS_ADD_ROUTE));
          }}
        >
          {t("Add sector")}
        </Button>
      ]}
    >
      {children}
    </PageHeader>
  );
};

export default SectorsPageHeader;
