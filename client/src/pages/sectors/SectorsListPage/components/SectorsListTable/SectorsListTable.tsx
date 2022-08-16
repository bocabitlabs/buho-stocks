import React from "react";
import { useTranslation } from "react-i18next";
import { Tabs } from "antd";
import SectorsTable from "../SectorsTable/SectorsTable";
import SuperSectorsTable from "../SuperSectorsTable/SuperSectorsTable";

export default function SectorsListTable() {
  const { t } = useTranslation();

  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab={t("Sectors")} key="1">
        <SectorsTable />
      </Tabs.TabPane>
      <Tabs.TabPane tab={t("Super sectors")} key="2">
        <SuperSectorsTable />
      </Tabs.TabPane>
    </Tabs>
  );
}
