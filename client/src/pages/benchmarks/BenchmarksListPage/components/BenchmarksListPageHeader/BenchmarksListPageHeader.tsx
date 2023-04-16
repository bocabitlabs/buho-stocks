import React, { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@ant-design/pro-layout";
import { Dropdown, MenuProps, Typography, theme } from "antd";
import BenchmarkAddEditForm from "../BenchmarkAddEditForm/BenchmarkAddEditForm";
import breadCrumbRender from "breadcrumbs";
import { useInitializeBenchmarks } from "hooks/use-benchmarks/use-benchmarks";

interface Props {
  children: ReactNode;
}
const { useToken } = theme;

function BenchmarksListPageHeader({ children }: Props) {
  const { t } = useTranslation();
  const { mutate: initializeBenchmarks } = useInitializeBenchmarks();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { token } = useToken();
  const routes = [
    {
      path: `/benchmarks`,
      title: t("Benchmarks"),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onCreate = (values: any) => {
    console.log("Received values of form: ", values);
    setIsModalVisible(false);
  };

  const onCancel = () => {
    setIsModalVisible(false);
  };

  const onMenuClick: MenuProps["onClick"] = (e) => {
    console.log("click", e);
    if (e.key === "1") {
      console.log("Initializing benchmarks");
      initializeBenchmarks();
    }
  };

  const items = [
    {
      key: "1",
      label: t("Initialize benchmarks"),
    },
  ];

  return (
    <PageHeader
      className="site-page-header"
      style={{ background: token.colorBgContainer }}
      title={<Typography.Title level={2}>{t("Benchmarks")}</Typography.Title>}
      breadcrumb={{ items: routes }}
      breadcrumbRender={breadCrumbRender}
      extra={[
        <Dropdown.Button
          menu={{ items, onClick: onMenuClick }}
          type="primary"
          key="company-add-header"
          onClick={showModal}
        >
          {t("Add benchmark")}
        </Dropdown.Button>,
      ]}
    >
      {children}
      <BenchmarkAddEditForm
        title={t("Add new benchmark")}
        okText={t("Create")}
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={onCancel}
      />
    </PageHeader>
  );
}

export default BenchmarksListPageHeader;
