import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Typography,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { useAddSharesTransaction } from "hooks/use-shares-transactions/use-shares-transactions";
import CompanyTickerSelect from "pages/ImportFromBrokerPage/components/CompanyTickerSelect/CompanyTickerSelect";
import ExchangeRateFetchButton from "pages/ImportFromBrokerPage/components/ExchangeRateFetchButton/ExchangeRateFetchButton";
import { ICompany } from "types/company";
import { ISharesTransactionFormFields } from "types/shares-transaction";

interface Props {
  portfolioId: number | undefined;
  trade: any | boolean;
  onTradeImported: Function;
}

export default function TradesImportForm({
  portfolioId,
  trade,
  onTradeImported,
}: Props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [formSent, setFormSent] = useState(false);
  const dateValue = Form.useWatch("date", form);

  const [selectedCompany, setSelectedCompany] = useState<ICompany | undefined>(
    undefined,
  );
  const { data: portfolio } = usePortfolio(portfolioId);
  const { mutate: createTradesTransaction, isLoading } =
    useAddSharesTransaction();

  const onCompanyChange = useCallback(
    (value: any) => {
      setSelectedCompany(value);
      form.setFieldValue("company", value.id);
    },
    [form],
  );

  const onExchangeRateChange = (value: any) => {
    form.setFieldsValue({
      exchangeRate: value,
    });
  };

  const onExchangeError = () => {
    form.setFields([
      {
        name: "exchangeRate",
        errors: [t("Unable to fetch the exchange rates for the given date")],
      },
    ]);
  };

  const onFormSubmit = (values: any) => {
    console.log("Success:", values);
    if (!selectedCompany) {
      console.log("No company selected");
      return;
    }

    const {
      commission,
      amount,
      company,
      date,
      exchangeRate,
      price,
      description,
      count,
      type,
    } = values;

    console.log(values);

    const commissionFixed = commission ? Number((+commission).toFixed(3)) : 0;

    const transaction: ISharesTransactionFormFields = {
      count: count < 0 ? -count : +count,
      totalAmount: amount,
      totalAmountCurrency: trade.currency,
      totalCommission: commissionFixed,
      grossPricePerShare: price,
      grossPricePerShareCurrency: trade.currency,
      totalCommissionCurrency: trade.currency,
      exchangeRate: exchangeRate ? +exchangeRate : 1,
      transactionDate: date,
      notes: `Imported from IB CSV on ${moment(new Date()).format(
        "YYYY-MM-DD HH:mm:ss.",
      )}. ${description}`,
      company,
      type,
    };
    console.log(transaction);
    createTradesTransaction({
      newTransaction: transaction,
      updatePortfolio: false,
    });
    setFormSent(true);
    onTradeImported();
  };
  const options1 = [
    { label: t("Buy"), value: "BUY" },
    { label: t("Sell"), value: "SELL" },
  ];
  return (
    <Row style={{ marginTop: 10, marginBottom: 10 }}>
      <Col>
        <Card>
          <Typography.Title level={4}>
            {trade.ticker} - {trade.currency}
          </Typography.Title>
          <Typography.Paragraph>
            <Typography.Text type="secondary">
              {trade.companyName} - ISIN: {trade.companyISIN} - {t("Market")}:{" "}
              {trade.market}
            </Typography.Text>
          </Typography.Paragraph>

          <Form
            form={form}
            initialValues={{
              count: trade.count,
              date: trade.date,
              amount: trade.total,
              price: trade.price,
              commission: trade.commission ? trade.commission.toFixed(3) : 0,
              description: trade.description,
              type: trade.count < 0 ? "SELL" : "BUY",
            }}
            onFinish={onFormSubmit}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Date"
                  name="date"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Date of the transaction" name="date" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Count"
                  name="count"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="input placeholder"
                    name="count"
                    suffix={trade.currency}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Type"
                  name="type"
                  rules={[{ required: true }]}
                >
                  <Radio.Group
                    options={options1}
                    optionType="button"
                    buttonStyle="solid"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Amount"
                  name="amount"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="input placeholder"
                    name="amount"
                    suffix={trade.currency}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Price per share"
                  name="price"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="input placeholder"
                    name="price"
                    suffix={trade.currency}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Commission"
                  name="commission"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="input placeholder"
                    name="commission"
                    suffix={trade.currency}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="company"
                  label={t("Company")}
                  rules={[
                    {
                      required: true,
                      message: t<string>("Please select a company"),
                    },
                  ]}
                  help={`${t("Received from CSV")}: ${trade.ticker}`}
                >
                  <CompanyTickerSelect
                    onSelect={onCompanyChange}
                    ticker={trade.ticker}
                    portfolioId={portfolioId}
                    initialValue={selectedCompany?.id}
                  />
                </Form.Item>
              </Col>
              {trade.currency !== portfolio?.baseCurrency.code && (
                <>
                  <Col span={6}>
                    <Form.Item
                      name="exchangeRate"
                      label={t("Exchange rate")}
                      help={
                        trade.currency &&
                        portfolio?.baseCurrency.code &&
                        `${trade.currency} to ${portfolio.baseCurrency.code}`
                      }
                      rules={[
                        {
                          required: true,
                          message: t<string>("Please input the exchange rate"),
                        },
                      ]}
                    >
                      <InputNumber
                        decimalSeparator="."
                        min={0}
                        step={0.001}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <ExchangeRateFetchButton
                      fromCurrency={trade.currency}
                      toCurrency={portfolio?.baseCurrency.code}
                      date={dateValue}
                      onChange={onExchangeRateChange}
                      onError={onExchangeError}
                    />
                  </Col>
                </>
              )}
              <Col span={24}>
                <Form.Item label={t("Description")} name="description">
                  <TextArea
                    placeholder="input placeholder"
                    name="description"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={formSent ? <CheckOutlined /> : null}
                    loading={isLoading}
                    disabled={formSent || !selectedCompany || !portfolio}
                  >
                    {t("Add trade")}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
