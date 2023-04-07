import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { DeleteOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Collapse,
  Modal,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import BenchmarkYearAddForm from "../BenchmarkYearAddForm/BenchmarkYearAddForm";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import { useDeleteBenchmarkYear } from "hooks/use-benchmarks/use-benchmark-years";
import { useBenchmark } from "hooks/use-benchmarks/use-benchmarks";
import { IBenchmarkYear } from "types/benchmark";

interface BenchmarkModalProps {
  id: number;
  title: string;
  isModalVisible: boolean;
  onCancel: () => void;
}

function BenchmarkDetailsModal({
  title,
  isModalVisible,
  onCancel,
  id,
}: BenchmarkModalProps): ReactElement | null {
  // const [form] = Form.useForm();
  const { t } = useTranslation();
  const { mutate: deleteBenchmarkYear } = useDeleteBenchmarkYear();
  const {
    data: benchmark,
    error: errorFetching,
    isFetching,
    isSuccess,
  } = useBenchmark(id);

  const confirmDelete = async (recordId: number) => {
    if (benchmark) {
      deleteBenchmarkYear({ id: recordId, benchmarkId: benchmark.id });
    }
  };

  const getData = () => {
    return (
      benchmark &&
      benchmark.years &&
      benchmark.years.map((year: IBenchmarkYear, index: number) => ({
        id: year.id,
        count: index + 1,
        key: year.id,
        returnPercentage: year.returnPercentage,
        year: year.year,
        value: year.value,
        valueCurrency: year.valueCurrency,
      }))
    );
  };

  const columns: any = [
    {
      title: "#",
      dataIndex: "count",
      key: "count",
    },
    {
      title: t("Year"),
      dataIndex: "year",
      key: "year",
    },
    {
      title: t("Return"),
      dataIndex: "returnPercentage",
      key: "returnPercentage",
      render: (text: string) => <span>{text} %</span>,
    },
    {
      title: t("Value"),
      dataIndex: "value",
      key: "value",
      render: (text: string, record: IBenchmarkYear) => (
        <span>
          {text} {record.valueCurrency}
        </span>
      ),
    },
    {
      title: t("Action"),
      key: "action",
      render: (text: string, record: any) => (
        <Space size="middle">
          {/* //       <Button
    //         data-testid="editButton"
    //         icon={<EditOutlined />}
    //         onClick={() => showModal(record.id)}
    //       /> */}
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

  return (
    <Modal
      okType="primary"
      open={isModalVisible}
      title={title}
      afterClose={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Close
        </Button>,
      ]}
      onCancel={onCancel}
    >
      {isFetching && <LoadingSpin />}
      {errorFetching && (
        <Alert
          showIcon
          message={t("Unable to load benchmark")}
          description={errorFetching.message}
          type="error"
        />
      )}
      {isSuccess && (
        <div>
          <Typography.Title level={5}>{benchmark.name}</Typography.Title>
          <Collapse defaultActiveKey={[]}>
            <Collapse.Panel header="Add a new year" key="1">
              <BenchmarkYearAddForm benchmarkId={benchmark.id} />
            </Collapse.Panel>
          </Collapse>
          <Table
            style={{ marginTop: 16 }}
            columns={columns}
            dataSource={getData()}
            loading={isFetching}
          />
        </div>
      )}
    </Modal>
  );
}

export default BenchmarkDetailsModal;
