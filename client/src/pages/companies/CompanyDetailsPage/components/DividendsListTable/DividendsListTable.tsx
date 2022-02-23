import React, { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Spin, Table } from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import NotesRow from "components/NotesRow/NotesRow";
import {
  useDeleteDividendsTransaction,
  useDividendsTransactions,
} from "hooks/use-dividends-transactions/use-dividends-transactions";
import DividendsTransactionAddEditForm from "pages/companies/CompanyDetailsPage/components/DividendsTransactionAddEditForm/DividendsTransactionAddEditForm";
import { ICurrency } from "types/currency";
import { IDividendsTransaction } from "types/dividends-transaction";

interface IProps {
  companyDividendsCurrency: ICurrency;
  portfolioBaseCurrency: string;
}

export default function DividendsListTable({
  companyDividendsCurrency,
  portfolioBaseCurrency,
}: IProps): ReactElement {
  const { t } = useTranslation();
  const { companyId } = useParams();
  const { isFetching: loading, data: transactions } = useDividendsTransactions(
    +companyId!,
  );
  const { mutateAsync: deleteTransaction } = useDeleteDividendsTransaction();
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
      toast.success(t("Dividends transaction deleted successfully"));
    } catch (error) {
      toast.error(t(`Error deleting dividends transaction: ${error}`));
    }
  };

  if (loading) {
    return <Spin />;
  }
  const columns: any = [
    {
      title: t("Date"),
      dataIndex: "transactionDate",
      key: "openTime",
      sorter: (a: IDividendsTransaction, b: IDividendsTransaction) =>
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
            key={`market-delete-${record.key}`}
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
      transactions.map((transaction: IDividendsTransaction) => ({
        id: transaction.id,
        key: transaction.id,
        count: transaction.count,
        grossPricePerShare: transaction.grossPricePerShare,
        grossPricePerShareCurrency: transaction.grossPricePerShareCurrency,
        totalCommission: transaction.totalCommission,
        totalCommissionCurrency: transaction.totalCommissionCurrency,
        transactionDate: transaction.transactionDate,
        transactionTotal:
          +transaction.count * +transaction.grossPricePerShare -
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
      <DividendsTransactionAddEditForm
        title="Update dividends transaction"
        okText="Update"
        transactionId={selectedId}
        companyId={+companyId!}
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={onCancel}
        companyDividendsCurrency={companyDividendsCurrency}
        portfolioBaseCurrency={portfolioBaseCurrency}
      />
    </div>
  );
}
