import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Alert, Button, Popconfirm, Space, Table } from "antd";
import BenchmarkAddEditForm from "../BenchmarkAddEditForm/BenchmarkAddEditForm";
import BenchmarkDetailsModal from "../BenchmarkDetailsModal/BenchmarkDetailsModal";
import {
  useBenchmarks,
  useDeleteBenchmark,
} from "hooks/use-benchmarks/use-benchmarks";
import { IBenchmark } from "types/benchmark";

export default function CurrenciesListTable() {
  const { t } = useTranslation();
  const { data: benchmarks, error, isFetching } = useBenchmarks();

  const { mutate: deleteBenchmark } = useDeleteBenchmark();
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<
    number | undefined
  >(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  const showModal = (recordId: number) => {
    setSelectedBenchmarkId(recordId);
    setIsModalVisible(true);
  };

  const showDetailsModal = (recordId: number) => {
    setSelectedBenchmarkId(recordId);
    setIsDetailsModalVisible(true);
  };

  const handleDetailsCancel = () => {
    setIsDetailsModalVisible(false);
    setSelectedBenchmarkId(undefined);
  };

  const confirmDelete = async (recordId: number) => {
    deleteBenchmark(recordId);
  };

  const onCreate = (values: any) => {
    console.log("Received values of form: ", values);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedBenchmarkId(undefined);
  };

  const columns: any = [
    {
      title: "#",
      dataIndex: "count",
      key: "count",
    },
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      render: (text: string, record: IBenchmark) => (
        <Button onClick={() => showDetailsModal(record.id)} type="link">
          {text}
        </Button>
      ),
      sorter: (a: IBenchmark, b: IBenchmark) => a.name.localeCompare(b.name),
    },
    {
      title: t("Action"),
      key: "action",
      render: (text: string, record: any) => (
        <Space size="middle">
          <Button
            data-testid="editButton"
            icon={<EditOutlined />}
            onClick={() => showModal(record.id)}
          />
          <Popconfirm
            key={`benchmark-delete-${record.key}`}
            title={`${t("Delete benchmark")} ${record.name}?`}
            onConfirm={() => confirmDelete(record.id)}
            okText={t("Yes")}
            cancelText={t("No")}
          >
            <Button
              data-testid="deleteButton"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const getData = () => {
    return (
      benchmarks &&
      benchmarks.map((currency: IBenchmark, index: number) => ({
        id: currency.id,
        count: index + 1,
        key: currency.id,
        name: currency.name,
      }))
    );
  };

  if (error) {
    return (
      <Alert
        showIcon
        message={t("Unable to load benchmarks")}
        description={error.message}
        type="error"
      />
    );
  }

  return (
    <div>
      <Table
        scroll={{ x: 600 }}
        style={{ marginTop: 16 }}
        columns={columns}
        dataSource={getData()}
        loading={isFetching}
      />
      <BenchmarkAddEditForm
        title={t("Update benchmark")}
        okText={t("Update")}
        id={selectedBenchmarkId}
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={handleCancel}
      />
      {selectedBenchmarkId && (
        <BenchmarkDetailsModal
          title={t("Benchmark details")}
          id={selectedBenchmarkId}
          isModalVisible={isDetailsModalVisible}
          onCancel={handleDetailsCancel}
        />
      )}
    </div>
  );
}
