import React, { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Spin, Table } from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import RightsTransactionAddEditForm from "../RightsTransactionAddEditForm/RightsTransactionAddEditForm";
import { BuySellLabel } from "components/BuySellLabel/BuySellLabel";
import NotesRow from "components/NotesRow/NotesRow";
import {
  useDeleteRightsTransaction,
  useRightsTransactions,
} from "hooks/use-rights-transactions/use-rights-transactions";
import { ICurrency } from "types/currency";
import { IRightsTransaction } from "types/rights-transaction";

interface IProps {
  companyBaseCurrency: ICurrency;
  portfolioBaseCurrency: string;
}

export default function RightsListTable({
  companyBaseCurrency,
  portfolioBaseCurrency,
}: IProps): ReactElement {
  const { t } = useTranslation();
  const { companyId } = useParams();
  const { isFetching: loading, data: transactions } = useRightsTransactions(
    +companyId!,
  );
  const { mutateAsync: deleteTransaction } = useDeleteRightsTransaction();
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (recordId: number) => {
    setSelectedId(recordId);
    setIsModalVisible(true);
  };

  const onCreate = (values: any) => {
    console.log("Received values of form: ", values);
    setIsModalVisible(false);
  };

  const onCancel = () => {
    setIsModalVisible(false);
  };
  const confirmDelete = async (recordId: number) => {
    try {
      await deleteTransaction({
        companyId: +companyId!,
        transactionId: recordId,
      });
      toast.success(t("Rights transaction deleted successfully"));
    } catch (error) {
      toast.error(t(`Error deleting rights transaction: ${error}`));
    }
  };

  if (loading) {
    return <Spin />;
  }
  const columns: any = [
    {
      title: t("Type"),
      dataIndex: "type",
      key: "type",
      render: (text: string) => <BuySellLabel value={text} />,
      sorter: (a: IRightsTransaction, b: IRightsTransaction) =>
        a.type.localeCompare(b.type),
    },
    {
      title: t("Date"),
      dataIndex: "transactionDate",
      key: "openTime",
      sorter: (a: IRightsTransaction, b: IRightsTransaction) =>
        a.transactionDate.localeCompare(b.transactionDate),
      render: (text: string) => moment(new Date(text)).format("DD/MM/YYYY"),
    },
    {
      title: t("Count"),
      dataIndex: "count",
      key: "count",
      render: (text: string) => text,
    },
    {
      title: t("Gross price per share"),
      dataIndex: "grossPricePerShare",
      key: "grossPricePerShare",
      render: (text: number, record: any) =>
        `${(+text).toFixed(2)} ${record.grossPricePerShareCurrency}`,
    },
    {
      title: t("Total commission"),
      dataIndex: "totalCommission",
      key: "totalCommission",
      render: (text: number, record: any) =>
        `${(+text).toFixed(2)} ${record.totalCommissionCurrency}`,
    },
    {
      title: t("Total"),
      dataIndex: "transactionTotal",
      key: "transactionTotal",
      render: (text: number, record: any) =>
        `${(+text).toFixed(2)} ${record.grossPricePerShareCurrency}`,
    },
    {
      title: t("Action"),
      key: "action",
      render: (text: string, record: any) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record.id)}
          />
          <Popconfirm
            key={`delete-${record.key}`}
            title={`Delete transaction ${record.name}?`}
            onConfirm={() => confirmDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const getData = () => {
    return (
      transactions &&
      transactions.map((transaction: IRightsTransaction) => ({
        id: transaction.id,
        key: transaction.id,
        count: transaction.count,
        type: transaction.type,
        grossPricePerShare: transaction.grossPricePerShare,
        grossPricePerShareCurrency: transaction.grossPricePerShareCurrency,
        totalCommission: transaction.totalCommission,
        totalCommissionCurrency: transaction.totalCommissionCurrency,
        transactionDate: transaction.transactionDate,
        transactionTotal:
          +transaction.count * +transaction.grossPricePerShare +
          +transaction.totalCommission,
        notes: transaction.notes,
      }))
    );
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <div>
      <Table
        size="small"
        columns={columns}
        bordered
        dataSource={getData()}
        scroll={{ x: 800 }}
        expandable={{
          expandedRowRender: NotesRow,
          rowExpandable: (record) =>
            record.notes !== "undefined" && record.notes !== undefined,
        }}
      />
      <RightsTransactionAddEditForm
        title="Update rights transaction"
        okText="Update"
        companyId={+companyId!}
        transactionId={selectedId}
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={onCancel}
        companyBaseCurrency={companyBaseCurrency}
        portfolioBaseCurrency={portfolioBaseCurrency}
      />
    </div>
  );
}
