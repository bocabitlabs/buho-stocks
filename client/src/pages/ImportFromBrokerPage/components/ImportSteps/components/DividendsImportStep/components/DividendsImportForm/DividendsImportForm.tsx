import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Typography,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import CompanyTickerSelect from "../../../../../CompanyTickerSelect/CompanyTickerSelect";
import ExchangeRateFetchButton from "../../../../../ExchangeRateFetchButton/ExchangeRateFetchButton";
import { useAddDividendsTransaction } from "hooks/use-dividends-transactions/use-dividends-transactions";
import { usePortfolio } from "hooks/use-portfolios/use-portfolios";
import { ICompany } from "types/company";
import { IDividendsTransactionFormFields } from "types/dividends-transaction";

interface Props {
  portfolioId: number | undefined;
  dividend: any | boolean;
  onDividendImported: Function;
}

export default function DividendsImportForm({
  portfolioId,
  dividend,
  onDividendImported,
}: Props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [formSent, setFormSent] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState<ICompany | undefined>(
    undefined,
  );
  const { data: portfolio } = usePortfolio(portfolioId);
  const { mutate: createDividendsTransaction, isLoading } =
    useAddDividendsTransaction();

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

    const { commissions, amount, company, date, exchangeRate, description } =
      values;

    const transaction: IDividendsTransactionFormFields = {
      totalAmount: amount,
      totalAmountCurrency: dividend.currency,
      totalCommission: commissions,
      totalCommissionCurrency: dividend.currency,
      exchangeRate: exchangeRate ? +exchangeRate : 1,
      transactionDate: date,
      notes: `Imported from IB CSV on ${moment(new Date()).format(
        "YYYY-MM-DD HH:mm:ss.",
      )}. ${description}`,
      company,
    };
    console.log(transaction);
    createDividendsTransaction({
      companyId: selectedCompany.id,
      newTransaction: transaction,
    });
    setFormSent(true);
    onDividendImported();
  };
  return (
    <Row style={{ marginTop: 10, marginBottom: 10 }}>
      <Col>
        <Card>
          <Typography.Title level={4}>
            {dividend.ticker} - {dividend.currency}
          </Typography.Title>
          <Typography.Paragraph>
            <Typography.Text type="secondary">
              {dividend.companyName} - ISIN: {dividend.isin} - Market:{" "}
              {dividend.market}
            </Typography.Text>
          </Typography.Paragraph>

          <Form
            form={form}
            initialValues={{
              date: dividend.date,
              amount: dividend.amount,
              commissions: dividend.commissions,
              description: dividend.description,
            }}
            onFinish={onFormSubmit}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="Date" name="date">
                  <Input placeholder="Date of the dividend" name="date" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Amount" name="amount">
                  <Input
                    placeholder="input placeholder"
                    name="amount"
                    suffix={dividend.currency}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Commission" name="commissions">
                  <Input
                    placeholder="input placeholder"
                    name="commissions"
                    suffix={dividend.currency}
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
                  help={`${t("Received")}: ${dividend.ticker}`}
                >
                  <CompanyTickerSelect
                    onSelect={onCompanyChange}
                    ticker={dividend.ticker}
                    portfolioId={portfolioId}
                    initialValue={selectedCompany?.id}
                  />
                </Form.Item>
              </Col>
              {dividend.currency !== portfolio?.baseCurrency.code && (
                <>
                  <Col span={6}>
                    <Form.Item
                      name="exchangeRate"
                      label={`${t("Exchange rate")}`}
                      help={`${
                        dividend.currency &&
                        portfolio?.baseCurrency.code &&
                        `${dividend.currency} to ${portfolio.baseCurrency.code}`
                      }`}
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
                      fromCurrency={dividend.currency}
                      toCurrency={portfolio?.baseCurrency.code}
                      date={dividend.date}
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
                    Add dividend
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
