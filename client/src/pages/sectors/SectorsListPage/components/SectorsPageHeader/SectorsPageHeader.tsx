import React, { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { Button, PageHeader } from "antd";
import SectorAddEditForm from "../SectorAddEditForm/SectorAddEditForm";
import SuperSectorAddEditForm from "../SuperSectorAddEditForm/SuperSectorAddEditForm";
import breadCrumbRender from "breadcrumbs";

interface Props {
  children: ReactNode;
}

function SectorsPageHeader({ children }: Props) {
  const { t } = useTranslation();
  const routes = [
    {
      path: `/app/sectors`,
      breadcrumbName: t("Sectors"),
    },
  ];
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
          onClick={showModal}
        >
          {t("Add sector")}
        </Button>,
        [
          <Button
            key="add-super-button"
            type="primary"
            icon={<PlusOutlined />}
            onClick={showSuperSectorModal}
          >
            {t("Add super sector")}
          </Button>,
        ],
      ]}
    >
      {children}
      <SectorAddEditForm
        title="Add new sector"
        okText="Create"
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={handleCancel}
      />
      <SuperSectorAddEditForm
        title="Add new super sector"
        okText="Create"
        isModalVisible={isSuperSectorModalVisible}
        onCreate={onCreateSuperSector}
        onCancel={handleSuperSectorCancel}
      />
    </PageHeader>
  );
}

export default SectorsPageHeader;
