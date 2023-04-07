import React, { ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert, DatePicker, Form, Input, Modal } from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import {
  useAddStockPrice,
  useStockPrice,
  useUpdateStockPrice,
} from "hooks/use-stock-prices/use-stock-prices";
import { IStockPriceFormFields } from "types/stock-prices";

interface AddEditFormProps {
  id?: number;
  title: string;
  okText: string;
  isModalVisible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
}

function StockPriceAddEditForm({
  title,
  okText,
  isModalVisible,
  onCreate,
  onCancel,
  id,
}: AddEditFormProps): ReactElement | null {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dateFormat = "YYYY-MM-DD";

  const { mutate: create } = useAddStockPrice();
  const { mutate: update } = useUpdateStockPrice();
  const {
    data: stockPriceData,
    error: errorFetching,
    isFetching,
    isSuccess,
  } = useStockPrice(id);

  const handleSubmit = async (values: any) => {
    const { ticker, price, priceCurrency, transactionDate } = values;
    const newStockPrice: IStockPriceFormFields = {
      ticker,
      price,
      priceCurrency,
      transactionDate: transactionDate.format(dateFormat),
    };

    if (id) {
      update({
        id: +id,
        newStockPrice,
      });
    } else {
      create(newStockPrice);
    }
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      await handleSubmit(values);
      form.resetFields();
      onCreate(values);
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  useEffect(() => {
    if (stockPriceData) {
      form.setFieldsValue({
        ticker: stockPriceData.ticker,
        transactionDate: moment(stockPriceData.transactionDate),
        price: stockPriceData.price,
        priceCurrency: stockPriceData.priceCurrency,
      });
    }
  }, [form, stockPriceData]);

  return (
    <Modal
      open={isModalVisible}
      title={title}
      okText={okText}
      cancelText={t("Cancel")}
      onCancel={onCancel}
      afterClose={onCancel}
      onOk={handleFormSubmit}
    >
      {isFetching && <LoadingSpin />}
      {errorFetching && (
        <Alert
          showIcon
          message={t("Unable to load currency")}
          description={errorFetching.message}
          type="error"
        />
      )}
      {(isSuccess || !id) && (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="ticker"
            label={t("Ticker")}
            rules={[
              {
                required: true,
                message: t("Please input the ticker"),
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            name="price"
            label={t("Price")}
            rules={[
              {
                required: true,
                message: t("Please input the price"),
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            name="priceCurrency"
            label={t("Currency")}
            rules={[
              {
                required: true,
                message: t("Please input the currency"),
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            name="transactionDate"
            label={t("Date")}
            rules={[
              {
                required: true,
                message: t("Please input the date"),
              },
            ]}
          >
            <DatePicker format={dateFormat} />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

StockPriceAddEditForm.defaultProps = {
  id: undefined,
};

export default StockPriceAddEditForm;
