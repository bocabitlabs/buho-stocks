import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Alert, Button, Popconfirm, Space, Table } from "antd";
import SuperSectorAddEditForm from "../SuperSectorAddEditForm/SuperSectorAddEditForm";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import {
  useDeleteSuperSector,
  useSuperSectors,
} from "hooks/use-sectors/use-super-sectors";
import { ISector } from "types/sector";

export default function SuperSectorsTable() {
  const { t } = useTranslation();

  const { data: sectors, error, isFetching } = useSuperSectors();
  const { mutate: deleteSector } = useDeleteSuperSector();
  const [selectedSectorId, setSelectedSectorId] = useState<number | undefined>(
    undefined,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (recordId: number) => {
    setSelectedSectorId(recordId);
    setIsModalVisible(true);
  };

  const confirmDelete = async (recordId: number) => {
    deleteSector(recordId);
  };

  const onCreate = (values: any) => {
    console.log("Received values of form: ", values);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedSectorId(undefined);
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
      sorter: (a: ISector, b: ISector) => a.name.localeCompare(b.name),
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
            key={`sector-delete-${record.key}`}
            title={`${t("Delete super sector")} ${record.name}?`}
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
      sectors &&
      sectors.map((element: ISector, index: number) => ({
        id: element.id,
        count: index + 1,
        key: element.id,
        name: element.name,
        isSuperSector: element.isSuperSector,
        superSector: element.superSector,
      }))
    );
  };

  if (isFetching) {
    return <LoadingSpin />;
  }

  if (error) {
    return (
      <Alert
        showIcon
        message={t("Unable to load super sectors")}
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
      />
      <SuperSectorAddEditForm
        title={t("Update super sector")}
        okText={t("Update")}
        id={selectedSectorId}
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={handleCancel}
      />
    </div>
  );
}
