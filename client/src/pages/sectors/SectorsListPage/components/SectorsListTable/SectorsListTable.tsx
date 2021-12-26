import React from "react";
import { Tabs } from "antd";
import SectorsTable from "../SectorsTable/SectorsTable";
import SuperSectorsTable from "../SuperSectorsTable/SuperSectorsTable";

export default function SectorsListTable() {
  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Sectors" key="1">
        <SectorsTable />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Super sectors" key="2">
        <SuperSectorsTable />
      </Tabs.TabPane>
    </Tabs>
  );
}
