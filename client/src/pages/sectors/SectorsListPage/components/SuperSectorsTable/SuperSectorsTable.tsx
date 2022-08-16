import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Table } from "antd";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import { useSuperSectors } from "hooks/use-sectors/use-super-sectors";
import { ISector } from "types/sector";

export default function SuperSectorsTable() {
  const { t } = useTranslation();

  const { data: sectors, error, isFetching } = useSuperSectors();

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
    </div>
  );
}
