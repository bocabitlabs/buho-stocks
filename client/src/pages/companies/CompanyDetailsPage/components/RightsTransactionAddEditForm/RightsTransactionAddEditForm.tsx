import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import { useExchangeRate } from "hooks/use-exchange-rates/use-exchange-rates";
import {
  useAddRightsTransaction,
  useRightsTransaction,
  useUpdateRightsTransaction,
} from "hooks/use-rights-transactions/use-rights-transactions";
import { ICurrency } from "types/currency";
import { IRightsTransactionFormFields } from "types/rights-transaction";

interface IProps {
  transactionId?: number;
  companyId: number;
  companyBaseCurrency: ICurrency;
  portfolioBaseCurrency: string;
  title: string;
  okText: string;
  isModalVisible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
}

export default function RightsTransactionAddEditForm({
  transactionId,
  companyId,
  companyBaseCurrency,
  portfolioBaseCurrency,
  title,
  okText,
  isModalVisible,
  onCreate,
  onCancel,
}: IProps) {
  const [form] = Form.useForm();
  const dateFormat = "YYYY-MM-DD";
  const [currentTransactionDate, setCurrentTransactionDate] = useState<string>(
    moment(new Date()).format(dateFormat),
  );

  const { t } = useTranslation();
  const { isFetching: exchangeRateLoading, refetch } = useExchangeRate(
    companyBaseCurrency.code,
    portfolioBaseCurrency,
    currentTransactionDate,
  );

  const { mutate: updateTransaction, isLoading: isUpdateLoading } =
    useUpdateRightsTransaction();
  const { mutate: createTransaction, isLoading: isCreateLoading } =
    useAddRightsTransaction();

  const {
    data: transaction,
    error: errorFetchingTransaction,
    isSuccess,
    isFetching,
  } = useRightsTransaction(companyId, transactionId);

  const fetchExchangeRate = async () => {
    const { data: exchangeRateResult } = await refetch();
    if (exchangeRateResult) {
      console.debug(exchangeRateResult);
      form.setFieldsValue({
        exchangeRate: exchangeRateResult.exchangeRate,
      });
    } else {
      form.setFields([
        {
          name: "exchangeRate",
          errors: [t("Unable to fetch the exchange rates for the given date")],
        },
      ]);
    }
  };

  const handleSubmit = async (values: any) => {
    const {
      count,
      grossPricePerShare,
      type,
      totalCommission,
      exchangeRate: exchangeRateValue,
      notes,
    } = values;

    const newTransactionValues: IRightsTransactionFormFields = {
      count,
      grossPricePerShare,
      grossPricePerShareCurrency: companyBaseCurrency.code,
      type,
      totalCommission,
      totalCommissionCurrency: companyBaseCurrency.code,
      transactionDate: currentTransactionDate,
      notes,
      exchangeRate: exchangeRateValue ? +exchangeRateValue : 1,
      company: +companyId!,
      color: "#000",
    };
    if (transactionId) {
      updateTransaction({
        companyId: newTransactionValues.company,
        transactionId,
        newTransaction: newTransactionValues,
      });
    } else {
      createTransaction({
        companyId: newTransactionValues.company,
        newTransaction: newTransactionValues,
      });
    }
  };

  const currentTransactionDateChange = (
    value: moment.Moment | null,
    dateString: string,
  ) => {
    setCurrentTransactionDate(dateString);
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
    if (transaction) {
      form.setFieldsValue({
        count: transaction.count,
        grossPricePerShare: transaction.grossPricePerShare,
        totalCommission: transaction.totalCommission,
        exchangeRate: transaction.exchangeRate,
        notes: transaction.notes,
        transactionDate: moment(transaction.transactionDate),
        type: transaction.type,
      });
      setCurrentTransactionDate(transaction.transactionDate);
    }
  }, [form, transaction]);

  return (
    <Modal
      visible={isModalVisible}
      title={title}
      okText={okText}
      cancelText={t("Cancel")}
      onCancel={onCancel}
      onOk={handleFormSubmit}
      confirmLoading={isCreateLoading || isUpdateLoading}
    >
      {isFetching && <LoadingSpin />}
      {errorFetchingTransaction && (
        <Alert
          showIcon
          message={t("Unable to load transaction")}
          description={errorFetchingTransaction.message}
          type="error"
        />
      )}
      {(isSuccess || !transactionId) && (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="count"
            label={t("Number of rights")}
            rules={[
              {
                required: true,
                message: t("Please input the number of rights"),
              },
            ]}
          >
            <InputNumber min={0} step={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="grossPricePerShare"
            label={t("Gross price per right")}
            rules={[
              {
                required: true,
                message: t("Please input the gross price per share"),
              },
            ]}
          >
            <InputNumber
              decimalSeparator="."
              addonAfter={`${companyBaseCurrency.code}`}
              min={0}
              step={0.001}
            />
          </Form.Item>
          <Form.Item
            name="type"
            label={t("Operation's type")}
            rules={[
              {
                required: true,
                message: t("Please input the type of transaction"),
              },
            ]}
          >
            <Select placeholder={t("Select an option")}>
              <Select.Option value="BUY">{t("Buy")}</Select.Option>
              <Select.Option value="SELL">{t("Sell")}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="totalCommission"
            label={t("Total commission")}
            rules={[
              {
                required: true,
                message: t("Please input the total commission"),
              },
            ]}
          >
            <InputNumber
              addonAfter={`${companyBaseCurrency.code}`}
              decimalSeparator="."
              min={0}
              step={0.001}
            />
          </Form.Item>
          <Form.Item
            name="transactionDate"
            label={t("Transaction's date")}
            rules={[
              {
                required: true,
                message: t("Please input the date of the operation"),
              },
            ]}
          >
            <DatePicker
              format={dateFormat}
              onChange={currentTransactionDateChange}
            />
          </Form.Item>
          {companyBaseCurrency.code !== portfolioBaseCurrency && (
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  name="exchangeRate"
                  label={t("Exchange rate")}
                  rules={[
                    {
                      required: true,
                      message: t("Please input the exchange rate"),
                    },
                  ]}
                >
                  <InputNumber
                    decimalSeparator="."
                    min={0}
                    step={0.001}
                    style={{ width: "100%" }}
                    disabled={exchangeRateLoading}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="&nbsp;">
                  <Button
                    disabled={currentTransactionDate === null}
                    onClick={fetchExchangeRate}
                    loading={exchangeRateLoading}
                  >
                    {t("Get exchange rate")} ({companyBaseCurrency.code} to{" "}
                    {portfolioBaseCurrency})
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          )}

          <Form.Item name="notes" label={t("Notes")}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

RightsTransactionAddEditForm.defaultProps = {
  transactionId: undefined,
};
