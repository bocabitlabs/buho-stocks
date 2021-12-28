import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";

interface IProps {
  action: string | null;
  setAction: (action: string | null) => void;
}

export default function ImportExportSelector({
  action,
  setAction,
}: IProps): ReactElement {
  const { t } = useTranslation();
  console.log(action);
  return (
    <div>
      <Button
        onClick={() => setAction("import")}
        type="primary"
        icon={<DownloadOutlined />}
        size="large"
      >
        {t("Import")}
      </Button>
      <Divider type="vertical">{t("OR")}</Divider>
      <Button
        onClick={() => setAction("export")}
        type="primary"
        icon={<UploadOutlined />}
        size="large"
      >
        {t("Export")}
      </Button>
    </div>
  );
}
