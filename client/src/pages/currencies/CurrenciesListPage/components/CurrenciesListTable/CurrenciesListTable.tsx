import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Alert, Button, Popconfirm, Space, Table } from "antd";
import CurrencyAddEditForm from "../CurrencyAddEditForm/CurrencyAddEditForm";
import {
  useCurrencies,
  useDeleteCurrency,
} from "hooks/use-currencies/use-currencies";
import { ICurrency } from "types/currency";

export default function CurrenciesListTable() {
  const { t } = useTranslation();
  const { data: currencies, error, isFetching } = useCurrencies();

  const { mutate: deleteCurrency } = useDeleteCurrency();
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<
    number | undefined
  >(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (recordId: number) => {
    setSelectedCurrencyId(recordId);
    setIsModalVisible(true);
  };

  const confirmDelete = async (recordId: number) => {
    deleteCurrency(recordId);
  };

  const onCreate = (values: any) => {
    console.log("Received values of form: ", values);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
      sorter: (a: ICurrency, b: ICurrency) => a.name.localeCompare(b.name),
    },
    {
      title: t("Code"),
      dataIndex: "code",
      key: "code",
      sorter: (a: ICurrency, b: ICurrency) => a.code.localeCompare(b.code),
    },
    {
      title: t("Symbol"),
      dataIndex: "symbol",
      key: "symbol",
      sorter: (a: ICurrency, b: ICurrency) => a.symbol.localeCompare(b.symbol),
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
            key={`currency-delete-${record.key}`}
            title={`${t("Delete currency")} ${record.name}?`}
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
      currencies &&
      currencies.map((currency: ICurrency, index: number) => ({
        id: currency.id,
        count: index + 1,
        key: currency.id,
        name: currency.name,
        code: currency.code,
        symbol: currency.symbol,
      }))
    );
  };

  if (error) {
    return (
      <Alert
        showIcon
        message={t("Unable to load currencies")}
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
      <CurrencyAddEditForm
        title={t("Update market")}
        okText={t("Update")}
        id={selectedCurrencyId}
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={handleCancel}
      />
    </div>
  );
}
