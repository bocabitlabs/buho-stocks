import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import { useExchangeRate } from "hooks/use-exchange-rates/use-exchange-rates";
import {
  useAddSharesTransaction,
  useUpdateSharesTransaction,
} from "hooks/use-shares-transactions/use-shares-transactions";
import { ICurrency } from "types/currency";
import {
  ISharesTransaction,
  ISharesTransactionFormFields,
} from "types/shares-transaction";

interface IProps {
  transaction?: ISharesTransaction | undefined;
  companyBaseCurrency: ICurrency;
  portfolioBaseCurrency: ICurrency;
}

export default function SharesTransactionAddEditForm({
  transaction,
  companyBaseCurrency,
  portfolioBaseCurrency,
}: IProps) {
  const [form] = Form.useForm();
  const dateFormat = "YYYY-MM-DD";
  const { id, companyId } = useParams();
  const navigate = useNavigate();
  const [currentTransactionDate, setCurrentTransactionDate] = useState<string>(
    moment(new Date()).format(dateFormat),
  );

  const { t } = useTranslation();
  const { isFetching: exchangeRateLoading, refetch } = useExchangeRate(
    companyBaseCurrency.code,
    portfolioBaseCurrency.code,
    currentTransactionDate,
  );

  const { mutateAsync: updateTransaction } = useUpdateSharesTransaction();
  const { mutateAsync: createTransaction } = useAddSharesTransaction();

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
          errors: ["Unable to fetch the exchange rates for the given date"],
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

    const newTransactionValues: ISharesTransactionFormFields = {
      count,
      grossPricePerShare,
      grossPricePerShareCurrency: companyBaseCurrency.code,
      type,
      totalCommission,
      totalCommissionCurrency: companyBaseCurrency.code,
      transactionDate: currentTransactionDate,
      notes,
      exchangeRate: +exchangeRateValue,
      company: +companyId!,
      color: "#000",
      portfolio: +id!,
    };
    if (transaction) {
      try {
        await updateTransaction({
          companyId: newTransactionValues.company,
          transactionId: transaction.id,
          newTransaction: newTransactionValues,
        });
        toast.success(t("Transaction has been updated"));
        navigate(-1);
      } catch (error) {
        toast.error(t("Cannot update transaction"));
      }
    } else {
      try {
        await createTransaction({
          companyId: newTransactionValues.company,
          newTransaction: newTransactionValues,
        });
        toast.success(t("Transaction has been created"));
        navigate(-1);
      } catch (error) {
        toast.error(t("Cannot create transaction"));
      }
    }
  };

  const currentTransactionDateChange = (
    value: moment.Moment | null,
    dateString: string,
  ) => {
    setCurrentTransactionDate(dateString);
  };

  // const updateFieldsForING = () => {
  //   const count = form.getFieldValue("count");
  //   const price = form.getFieldValue("price");
  //   let total = form.getFieldValue("total");
  //   const exchangeRate = form.getFieldValue("exchangeRate");

  //   total *= 1 / exchangeRate;
  //   const totalInvested = +count * +price;
  //   let newCommission = total - totalInvested;

  //   if (newCommission < 0) {
  //     newCommission *= -1;
  //   }

  //   form.setFieldsValue({
  //     commission: newCommission
  //   });
  // };

  // if (!portfolio || !company || (transactionId && !transaction)) {
  //   return <Spin />;
  // }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        count: transaction?.count,
        grossPricePerShare: transaction?.grossPricePerShare,
        totalCommission: transaction?.totalCommission,
        exchangeRate: transaction?.exchangeRate,
        notes: transaction?.notes,
        transactionDate: transaction
          ? moment(transaction.transactionDate)
          : moment(currentTransactionDate),
        type: transaction ? transaction.type : "BUY",
      }}
    >
      <Form.Item
        name="count"
        label={t("Number of shares")}
        rules={[
          { required: true, message: t("Please input the number of shares") },
        ]}
      >
        <InputNumber min={0} step={1} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="grossPricePerShare"
        label={t("Gross price per share")}
        rules={[
          {
            required: true,
            message: t("Please input the gross price per share"),
          },
        ]}
      >
        <InputNumber
          decimalSeparator="."
          addonAfter={`${companyBaseCurrency.symbol}`}
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
          { required: true, message: t("Please input the total commission") },
        ]}
      >
        <InputNumber
          addonAfter={`${companyBaseCurrency.symbol}`}
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
      {companyBaseCurrency.code !== portfolioBaseCurrency.code && (
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="exchangeRate"
              label="Exchange rate"
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
                {portfolioBaseCurrency.code})
              </Button>
            </Form.Item>
          </Col>
        </Row>
      )}

      <Form.Item name="notes" label={t("Notes")}>
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {transaction ? t("Edit transaction") : t("Add transaction")}
        </Button>
      </Form.Item>
    </Form>
  );
}

SharesTransactionAddEditForm.defaultProps = {
  transaction: undefined,
};
