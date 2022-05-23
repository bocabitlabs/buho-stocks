import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";

interface IProps {
  setAction: (action: string | null) => void;
}

export default function ImportDataSelector({
  setAction,
}: IProps): ReactElement {
  const { t } = useTranslation();

  return (
    <div>
      <Button
        onClick={() => setAction("app-data")}
        type="primary"
        icon={<DownloadOutlined />}
        size="large"
      >
        {t("Import App Data")}
      </Button>
      <Divider type="vertical">{t("OR")}</Divider>
      <Button
        onClick={() => setAction("broker")}
        type="primary"
        icon={<DownloadOutlined />}
        size="large"
      >
        {t("Import from broker")}
      </Button>
    </div>
  );
}
