import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Table } from "antd";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import { useSectors } from "hooks/use-sectors/use-sectors";
import { ISector } from "types/sector";

export default function SectorsTable() {
  const { t } = useTranslation();

  const { data: sectors, error, isFetching } = useSectors();

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
      render: (text: string) => <strong>{t(text)}</strong>,
      sorter: (a: ISector, b: ISector) => a.name.localeCompare(b.name),
    },
    {
      title: t("Super sector"),
      dataIndex: "superSector",
      key: "superSector",
      render: (text: string) => t(text),
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
        color: element.color,
        superSector: element.superSector?.name,
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
    </div>
  );
}
