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
import { ICompany } from "types/company";
import { IRightsTransactionFormFields } from "types/rights-transaction";

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

    const transaction: IRightsTransactionFormFields = {
      count: count < 0 ? -count : +count,
      totalAmount: amount,
      totalAmountCurrency: corporateAction.currency,
      totalCommission: commission,
      grossPricePerShare: price,
      grossPricePerShareCurrency: corporateAction.currency,
      totalCommissionCurrency: corporateAction.currency,
      exchangeRate: exchangeRate ? +exchangeRate : 1,
      transactionDate: date,
      notes: `Imported from IB CSV on ${moment(new Date()).format(
        "YYYY-MM-DD HH:mm:ss.",
      )}. ${description}`,
      company,
      type,
    };
    console.log(transaction);
    createRightsTransaction({
      newTransaction: transaction,
    });
    setFormSent(false);
    onImported();
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
                    suffix={corporateAction.currency}
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
                    suffix={corporateAction.currency}
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
                    suffix={corporateAction.currency}
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
                    suffix={corporateAction.currency}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="company"
                  label={t("Company")}
                  rules={[
                    { required: true, message: t("Please select a company") },
                  ]}
                  help={`${t("Received")}: ${corporateAction.ticker}`}
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
                          message: t("Please input the exchange rate"),
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
                <Form.Item label="Description" name="description">
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
                    Add right
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
