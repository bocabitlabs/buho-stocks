import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Space, Tabs } from "antd";
import SectorAddEditForm from "../SectorAddEditForm/SectorAddEditForm";
import SectorsTable from "../SectorsTable/SectorsTable";
import SuperSectorAddEditForm from "../SuperSectorAddEditForm/SuperSectorAddEditForm";
import SuperSectorsTable from "../SuperSectorsTable/SuperSectorsTable";
import { useInitializeSectors } from "hooks/use-sectors/use-sectors";

type PositionType = "right";

export default function SectorsListTable() {
  const { t } = useTranslation();
  const { mutate: initializeSectors } = useInitializeSectors();
  const [addSectorModalVisible, setAddSectorModalVisible] = useState(false);
  const [addSuperSectorModalVisible, setAddSuperSectorModalVisible] =
    useState(false);

  const menuItems = [
    {
      key: "1",
      label: t("Add sector"),
    },
    {
      key: "2",
      label: t("Add super sector"),
    },
    {
      key: "3",
      label: t("Initialize sectors"),
    },
  ];
  const onMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "1") {
      setAddSectorModalVisible(true);
    }
    if (e.key === "2") {
      setAddSuperSectorModalVisible(true);
    }
    if (e.key === "3") {
      initializeSectors();
    }
  };

  const OperationsSlot: Record<PositionType, React.ReactNode> = {
    right: (
      <Dropdown
        menu={{ items: menuItems, onClick: onMenuClick }}
        key="company-add-header"
      >
        <Button type="primary">
          <Space>
            Actions
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    ),
  };

  const items = [
    { label: t("Sectors"), key: "1", children: <SectorsTable /> },
    { label: t("Super sectors"), key: "2", children: <SuperSectorsTable /> },
  ];

  const onCancel = () => {
    setAddSectorModalVisible(false);
  };

  const onSuperSectorCancel = () => {
    setAddSuperSectorModalVisible(false);
  };

  return (
    <>
      <Tabs items={items} tabBarExtraContent={OperationsSlot} />
      <SectorAddEditForm
        title={t("Add new sector")}
        okText={t("Create")}
        isModalVisible={addSectorModalVisible}
        onCreate={onCancel}
        onCancel={onCancel}
      />
      <SuperSectorAddEditForm
        title={t("Add new super sector")}
        okText={t("Create")}
        isModalVisible={addSuperSectorModalVisible}
        onCreate={onSuperSectorCancel}
        onCancel={onSuperSectorCancel}
      />
    </>
  );
}
