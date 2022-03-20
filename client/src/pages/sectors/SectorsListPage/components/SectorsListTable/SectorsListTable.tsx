import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Tabs } from "antd";
import SectorAddEditForm from "../SectorAddEditForm/SectorAddEditForm";
import SectorsTable from "../SectorsTable/SectorsTable";
import SuperSectorAddEditForm from "../SuperSectorAddEditForm/SuperSectorAddEditForm";
import SuperSectorsTable from "../SuperSectorsTable/SuperSectorsTable";

export default function SectorsListTable() {
  const { t } = useTranslation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSuperSectorModalVisible, setIsSuperSectorModalVisible] =
    useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onCreate = (values: any) => {
    console.log("Received values of form: ", values);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const showSuperSectorModal = () => {
    setIsSuperSectorModalVisible(true);
  };

  const onCreateSuperSector = (values: any) => {
    console.log("Received values of form: ", values);
    setIsSuperSectorModalVisible(false);
  };

  const handleSuperSectorCancel = () => {
    setIsSuperSectorModalVisible(false);
  };
  return (
    <>
      <Tabs
        defaultActiveKey="1"
        tabBarExtraContent={
          <>
            <Button
              key="add-button"
              type="primary"
              icon={<PlusOutlined />}
              onClick={showModal}
              style={{ marginRight: "10px" }}
            >
              {t("Add sector")}
            </Button>

            <Button
              key="add-super-button"
              type="primary"
              icon={<PlusOutlined />}
              onClick={showSuperSectorModal}
            >
              {t("Add super sector")}
            </Button>
          </>
        }
      >
        <Tabs.TabPane tab={t("Sectors")} key="1">
          <SectorsTable />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t("Super sectors")} key="2">
          <SuperSectorsTable />
        </Tabs.TabPane>
      </Tabs>
      <SectorAddEditForm
        title={t("Add new sector")}
        okText={t("Create")}
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={handleCancel}
      />
      <SuperSectorAddEditForm
        title={t("Add new super sector")}
        okText={t("Create")}
        isModalVisible={isSuperSectorModalVisible}
        onCreate={onCreateSuperSector}
        onCancel={handleSuperSectorCancel}
      />
    </>
  );
}
