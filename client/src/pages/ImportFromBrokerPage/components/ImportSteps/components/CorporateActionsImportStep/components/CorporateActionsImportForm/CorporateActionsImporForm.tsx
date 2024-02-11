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
import CompanyTickerSelect from "../../../../../CompanyTickerSelect/CompanyTickerSelect";
import ExchangeRateFetchButton from "../../../../../ExchangeRateFetchButton/ExchangeRateFetchButton";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { useAddRightsTransaction } from "hooks/use-rights-transactions/use-rights-transactions";
import { useAddSharesTransaction } from "hooks/use-shares-transactions/use-shares-transactions";
import { ICompany } from "types/company";
import { IRightsTransactionFormFields } from "types/rights-transaction";
import { ISharesTransactionFormFields } from "types/shares-transaction";

interface Props {
  portfolioId: number | undefined;
  corporateAction: any | boolean;
  onImported: Function;
}

export default function CorporateActionsImportForm({
  portfolioId,
  corporateAction,
  onImported,
}: Props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [formSent, setFormSent] = useState(false);
  const dateValue = Form.useWatch("date", form);

  const [selectedCompany, setSelectedCompany] = useState<ICompany | undefined>(
    undefined,
  );
  const { data: portfolio } = usePortfolio(portfolioId);
  const { mutate: createRightsTransaction, isLoading } =
    useAddRightsTransaction();
  const { mutate: createTradesTransaction, isLoading: isLoadingTrades } =
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

  const makeRightsTransaction = (values: any) => {
    const transaction: IRightsTransactionFormFields = {
      count: values.count < 0 ? -values.count : +values.count,
      totalAmount: values.amount,
      totalAmountCurrency: corporateAction.currency,
      totalCommission: values.commission,
      grossPricePerShare: values.price,
      grossPricePerShareCurrency: corporateAction.currency,
      totalCommissionCurrency: corporateAction.currency,
      exchangeRate: values.exchangeRate ? +values.exchangeRate : 1,
      transactionDate: values.date,
      notes: `Imported from IB CSV on ${moment(new Date()).format(
        "YYYY-MM-DD HH:mm:ss.",
      )}. ${values.description}`,
      company: values.company,
      type: values.type,
    };
    console.log(transaction);
    createRightsTransaction({
      newTransaction: transaction,
      updatePortfolio: false,
    });
  };

  const makeTradesTransaction = (values: any) => {
    const transaction: ISharesTransactionFormFields = {
      count: values.count < 0 ? -values.count : +values.count,
      totalAmount: values.amount,
      totalAmountCurrency: corporateAction.currency,
      totalCommission: values.commission,
      grossPricePerShare: values.price,
      grossPricePerShareCurrency: corporateAction.currency,
      totalCommissionCurrency: corporateAction.currency,
      exchangeRate: values.exchangeRate ? +values.exchangeRate : 1,
      transactionDate: values.date,
      notes: `Imported from IB CSV on ${moment(new Date()).format(
        "YYYY-MM-DD HH:mm:ss.",
      )}. ${values.description}`,
      company: values.company,
      type: values.type,
    };
    console.log(transaction);
    createTradesTransaction({
      newTransaction: transaction,
      updatePortfolio: false,
    });
  };

  const options1 = [
    { label: t("Buy"), value: "BUY" },
    { label: t("Sell"), value: "SELL" },
  ];
  const optionsTradeRight = [
    { label: t("Shares"), value: "SHARES" },
    { label: t("Rights"), value: "RIGHTS" },
  ];

  const onFormSubmit = (values: any) => {
    console.log("Success:", values);
    if (!selectedCompany) {
      console.log("No company selected");
      return;
    }

    const { transactionType } = values;

    if (transactionType === "RIGHTS") {
      makeRightsTransaction(values);
    } else {
      makeTradesTransaction(values);
    }

    setFormSent(false);
    onImported();
  };

  return (
    <Row style={{ marginTop: 10, marginBottom: 10 }}>
      <Col>
        <Card>
          <Typography.Title level={4}>
            {corporateAction.ticker} - {corporateAction.currency}
          </Typography.Title>
          <Typography.Paragraph>
            <Typography.Text type="secondary">
              {corporateAction.companyName} - ISIN: {corporateAction.isin}
            </Typography.Text>
          </Typography.Paragraph>
          <Form
            form={form}
            initialValues={{
              count: corporateAction.count,
              date: corporateAction.date,
              amount: corporateAction.total,
              price: corporateAction.price,
              commission: corporateAction.commission,
              description: corporateAction.description,
              type: corporateAction.count < 0 ? "SELL" : "BUY",
            }}
            onFinish={onFormSubmit}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={t("Date")}
                  name="date"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder={t<string>("Date of the transaction")}
                    name="date"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={t("Count")}
                  name="count"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="input placeholder" name="count" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("Type")}
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
                  label={t("Transaction's type")}
                  name="transactionType"
                  rules={[{ required: true }]}
                >
                  <Radio.Group
                    options={optionsTradeRight}
                    optionType="button"
                    buttonStyle="solid"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("Total")}
                  name="amount"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="input placeholder"
                    name="amount"
                    suffix={corporateAction.currency}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("Price")}
                  name="price"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="input placeholder"
                    name="price"
                    suffix={corporateAction.currency}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("Commission")}
                  name="commission"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="input placeholder"
                    name="commission"
                    suffix={corporateAction.currency}
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
                  help={`${t("Received from CSV")}: ${corporateAction.ticker}`}
                >
                  <CompanyTickerSelect
                    onSelect={onCompanyChange}
                    ticker={corporateAction.ticker}
                    portfolioId={portfolioId}
                    initialValue={selectedCompany?.id}
                  />
                </Form.Item>
              </Col>
              {corporateAction.currency !== portfolio?.baseCurrency.code && (
                <>
                  <Col span={6}>
                    <Form.Item
                      name="exchangeRate"
                      label={t("Exchange rate")}
                      help={
                        corporateAction.currency &&
                        portfolio?.baseCurrency.code &&
                        `${corporateAction.currency} to ${portfolio.baseCurrency.code}`
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
                      fromCurrency={corporateAction.currency}
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
                    loading={isLoading || isLoadingTrades}
                    disabled={formSent || !selectedCompany || !portfolio}
                  >
                    {t("Add corporate actions")}
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
