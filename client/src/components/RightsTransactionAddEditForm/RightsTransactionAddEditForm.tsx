import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Spin
} from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import { CompaniesContext } from "contexts/companies";
import { ExchangeRatesContext } from "contexts/exchange-rates";
import { PortfoliosContext } from "contexts/portfolios";
import { RightsTransactionsContext } from "contexts/rights-transactions";
import { IRightsTransactionFormFields } from "types/rights-transaction";

interface IProps {
  transactionId?: string;
}

export default function RightsTransactionAddEditForm({
  transactionId
}: IProps) {
  const [form] = Form.useForm();
  const dateFormat = "YYYY-MM-DD";

  const { company } = useContext(CompaniesContext);
  const { portfolio } = useContext(PortfoliosContext);
  const {
    isLoading: exchangeRateLoading,
    exchangeRate,
    get: getExchangeRate
  } = useContext(ExchangeRatesContext);
  const {
    transaction,
    create: addTransaction,
    update: updateTransaction
  } = useContext(RightsTransactionsContext);
  const [currentTransactionDate, setCurrentTransactionDate] = useState<string>(
    moment(new Date()).format(dateFormat)
  );
  const { t } = useTranslation();
  const fetchExchangeRate = async () => {
    if (company && portfolio) {
      getExchangeRate(
        company?.baseCurrency.code,
        portfolio?.baseCurrency.code,
        currentTransactionDate
      );
    }
  };

  useEffect(() => {
    if (exchangeRate) {
      form.setFieldsValue({
        exchangeRate: exchangeRate.exchangeRate
      });
    }
  }, [exchangeRate, form]);

  const handleAdd = (values: any) => {
    const {
      count,
      grossPricePerShare,
      type,
      totalCommission,
      exchangeRate: exchangeRateValue,
      notes
    } = values;

    if (!company || !portfolio) {
      message.error(
        "Company and Portfolio must be set in order to create a transaction"
      );
      return;
    }

    const newTransactionValues: IRightsTransactionFormFields = {
      count,
      grossPricePerShare,
      grossPricePerShareCurrency: company.baseCurrency.code,
      type,
      totalCommission,
      totalCommissionCurrency: company.baseCurrency.code,
      transactionDate: currentTransactionDate,
      notes,
      exchangeRate: exchangeRateValue,
      company: company.id,
      color: "#000",
      portfolio: portfolio.id
    };
    if (transactionId) {
      console.log(transactionId, newTransactionValues);
      updateTransaction(+transactionId, newTransactionValues);
    } else {
      console.log(newTransactionValues);
      addTransaction(newTransactionValues);
    }
  };

  const currentTransactionDateChange = (
    value: moment.Moment | null,
    dateString: string
  ) => {
    setCurrentTransactionDate(dateString);
    console.log(value);
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

  if (!portfolio || !company || (transactionId && !transaction)) {
    return <Spin />;
  }
  console.log(currentTransactionDate);
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleAdd}
      initialValues={{
        count: transaction?.count,
        grossPricePerShare: transaction?.grossPricePerShare,
        totalCommission: transaction?.totalCommission,
        exchangeRate: transaction?.exchangeRate,
        notes: transaction?.notes,
        transactionDate: transaction
          ? moment(transaction.transactionDate)
          : moment(currentTransactionDate),
        type: transaction ? transaction.type : "BUY"
      }}
    >
      <Form.Item
        name="count"
        label={t("Number of rights")}
        rules={[
          { required: true, message: t("Please input the number of rights") }
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
            message: t("Please input the gross price per right")
          }
        ]}
      >
        <InputNumber
          decimalSeparator="."
          addonAfter={`${company?.baseCurrency.symbol}`}
          min={0}
          step={0.001}
          // style={{ width: "100%" }}
        />
      </Form.Item>
      <Form.Item
        name="type"
        label={t("Operation's type")}
        rules={[
          { required: true, message: t("Please input the type of transaction") }
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
          { required: true, message: t("Please input the total commission") }
        ]}
      >
        <InputNumber
          addonAfter={`${company?.baseCurrency.symbol}`}
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
            message: t("Please input the date of the operation")
          }
        ]}
      >
        <DatePicker
          format={dateFormat}
          onChange={currentTransactionDateChange}
        />
      </Form.Item>

      {company.baseCurrency.code !== portfolio.baseCurrency.code && (
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="exchangeRate"
              label="Exchange rate"
              rules={[
                { required: true, message: t("Please input the exchange rate") }
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
                {t("Get exchange rate")} ({company.baseCurrency.code} to{" "}
                {portfolio.baseCurrency.code})
              </Button>
            </Form.Item>
          </Col>
        </Row>
      )}

      {/* {company.broker.toLowerCase().includes("ing") && (
        <div>
          <Divider plain>{t("ING only")}</Divider>
          <Typography.Text type="secondary">
            {t(
              `ING doesn't include a commission field, so it needs to be calculated. Commission and price will be recalculated from total.`
            )}
          </Typography.Text>

          <Form.Item name="total" label={t("Total (€)")}>
            <InputNumber
              decimalSeparator="."
              formatter={(value) => `€ ${value}`}
              min={0}
              step={0.001}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="default"
              htmlType="button"
              onClick={updateFieldsForING}
            >
              {t("Obtain Values from total")}
            </Button>
          </Form.Item>
          <Divider plain />
        </div>
      )} */}

      <Form.Item name="notes" label={t("Notes")}>
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {transactionId ? t("Edit transaction") : t("Add transaction")}
        </Button>
      </Form.Item>
    </Form>
  );
}

RightsTransactionAddEditForm.defaultProps = {
  transactionId: null
};
