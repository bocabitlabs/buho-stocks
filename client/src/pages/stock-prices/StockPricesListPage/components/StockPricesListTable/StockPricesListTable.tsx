import { useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Alert, Button, Popconfirm, Space, Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import StockPriceAddEditForm from "../StockPriceAddEditForm/StockPriceAddEditForm";
import {
  useDeleteStockPrice,
  useStockPrices,
} from "hooks/use-stock-prices/use-stock-prices";
import { IStockPrice } from "types/stock-prices";

type Pagination = {
  page: number;
  pageSize: number;
  sortBy: string;
  order: string;
};

type Action =
  | { type: "SET_PAGE"; page: number; pageSize: number }
  | { type: "SET_SORT_BY"; sortBy: string; order: string };

const paginationReducer = (state: Pagination, action: Action) => {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.page, pageSize: action.pageSize };
    case "SET_SORT_BY":
      return { ...state, sortBy: action.sortBy, order: action.order };
    default:
      return state;
  }
};

export default function StockPricesListTable() {
  const { t } = useTranslation();
  const [pagination, dispatch] = useReducer(paginationReducer, {
    page: 1,
    pageSize: 100,
    sortBy: "transactionDate",
    order: "descend",
  });
  const {
    data: exchangeRatesData,
    error,
    isFetching,
  } = useStockPrices(
    pagination.page,
    pagination.pageSize,
    pagination.sortBy,
    pagination.order,
  );

  const { mutate: deleteExchangeRate } = useDeleteStockPrice();
  const [selectedExchangeRateId, setSelectedExchangeRateId] = useState<
    number | undefined
  >(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (recordId: number) => {
    setSelectedExchangeRateId(recordId);
    setIsModalVisible(true);
  };

  const confirmDelete = async (recordId: number) => {
    deleteExchangeRate(recordId);
  };

  const onCreate = (values: any) => {
    console.log("Received values of form: ", values);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedExchangeRateId(undefined);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "key",
    },
    {
      title: t("Ticker"),
      dataIndex: "ticker",
      key: "ticker",
      sorter: (a, b) => a.ticker.localeCompare(b.ticker),
    },
    {
      title: t("Price"),
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: t("Currency"),
      dataIndex: "priceCurrency",
      key: "priceCurrency",
      sorter: (a, b) => a.priceCurrency.localeCompare(b.priceCurrency),
    },
    {
      title: t("Date"),
      dataIndex: "transactionDate",
      key: "transactionDate",
      sorter: (a, b) => a.transactionDate.localeCompare(b.transactionDate),
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
            title={`${t("Delete stock price")} ${record.name}?`}
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
      exchangeRatesData &&
      exchangeRatesData.results.map(
        (stockPrice: IStockPrice, index: number) => ({
          id: stockPrice.id,
          count: index + 1,
          key: stockPrice.id,
          price: stockPrice.price,
          priceCurrency: stockPrice.priceCurrency,
          transactionDate: stockPrice.transactionDate,
          ticker: stockPrice.ticker,
        }),
      )
    );
  };

  interface DataType {
    key: React.Key;
    id: number;
    count: number;
    price: number;
    priceCurrency: string;
    transactionDate: string;
    ticker: string;
  }

  const onChange: TableProps<DataType>["onChange"] = (
    paginatio,
    filters,
    sorter,
  ) => {
    dispatch({
      type: "SET_SORT_BY",
      sortBy: sorter.field,
      order: sorter.order,
    });
    // setPagination({ ...pagination, sortBy: sorter.field, order: sorter.order });
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
        onChange={onChange}
        pagination={{
          defaultPageSize: 100,
          current: pagination.page,
          total: exchangeRatesData?.count,
          pageSize: pagination.pageSize,
          onChange: (page, pageSize) => {
            dispatch({ type: "SET_PAGE", page, pageSize });
          },
        }}
      />
      <StockPriceAddEditForm
        title={t("Update stock price")}
        okText={t("Update")}
        id={selectedExchangeRateId}
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={handleCancel}
      />
    </div>
  );
}
