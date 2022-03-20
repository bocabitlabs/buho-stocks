import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Alert, Button, Popconfirm, Space, Table } from "antd";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import {
  useSuperSectors,
  useDeleteSuperSector,
} from "hooks/use-sectors/use-super-sectors";
import SuperSectorAddEditForm from "pages/sectors/SectorsListPage/components/SuperSectorAddEditForm/SuperSectorAddEditForm";
import getRoute, { SECTORS_ROUTE } from "routes";
import { ISector } from "types/sector";

export default function SuperSectorsTable() {
  const { t } = useTranslation();

  const { data: sectors, error, isFetching } = useSuperSectors();
  const { mutateAsync: deleteSector } = useDeleteSuperSector();
  const [selectedSectorId, setSelectedSectorId] = useState<number | undefined>(
    undefined,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showSectorModal = (recordId: number) => {
    setSelectedSectorId(recordId);
    setIsModalVisible(true);
  };

  const onCreate = (values: any) => {
    console.log("Received values of form: ", values);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const confirmDelete = async (recordId: number) => {
    try {
      await deleteSector(recordId);
      toast.success(t("Super sector deleted successfully"));
    } catch (err) {
      toast.error(t(`Error deleting super sector: ${err}`));
    }
  };

  const columns: any = [
    {
      title: "",
      dataIndex: "color",
      key: "color",
      render: (text: string) => (
        <svg height="20" width="20">
          <circle cx="10" cy="10" r="10" fill={text} />
        </svg>
      ),
    },
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      render: (text: string, record: ISector) => (
        <Button type="link" onClick={() => showSectorModal(record.id)}>
          {text}
        </Button>
      ),
      sorter: (a: ISector, b: ISector) => a.name.localeCompare(b.name),
    },
    {
      title: t("Action"),
      key: "action",
      render: (text: string, record: any) => (
        <Space size="middle">
          <Link to={`${getRoute(SECTORS_ROUTE)}/super/${record.id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            key={`market-delete-${record.key}`}
            title={`${t("Delete super sector")} ${record.name}?`}
            onConfirm={() => confirmDelete(record.id)}
            okText={t("Yes")}
            cancelText={t("No")}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const getData = () => {
    return (
      sectors &&
      sectors.map((element: ISector) => ({
        id: element.id,
        key: element.id,
        name: element.name,
        color: element.color,
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
        message={t("Unable to load sectors")}
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
        sectorId={selectedSectorId}
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={handleCancel}
      />
    </div>
  );
}
