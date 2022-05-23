import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Typography,
} from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import { useAddDividendsTransaction } from "hooks/use-dividends-transactions/use-dividends-transactions";
import { useExchangeRate } from "hooks/use-exchange-rates/use-exchange-rates";
import { ICompanyListItem } from "types/company";
import { IDividendsTransactionFormFields } from "types/dividends-transaction";
import { IPortfolio } from "types/portfolio";

interface IProps {
  inputData: any;
  portfolio: IPortfolio;
}

export default function IBDividendsImportForm({
  inputData,
  portfolio,
}: IProps): ReactElement {
  const [form] = Form.useForm();

  const indexes = {
    notes: 4,
    transactionTotal: 5,
    commissionIndex: 5,
    currency: 2,
    transactionDate: 3,
  };

  const notes = inputData.data[indexes.notes];
  const priceMatch = inputData.data[indexes.notes].match(/[+-]?\d+(\.\d+)/);
  const companyNameMatch = inputData.data[indexes.notes].match(/^(\w)+/g);
  const totalValue = +inputData.data[indexes.transactionTotal];
  const initialCompanyCurrency = inputData.data[indexes.currency];
  const initialCommission = inputData.commissions
    ? inputData.commissions[indexes.commissionIndex] * -1
    : 0;
  const initialTransactionDate = moment(
    inputData.data[indexes.transactionDate],
  );

  let initialCompanyTicker = "";
  if (companyNameMatch) {
    const [companyNameTemp] = companyNameMatch;
    initialCompanyTicker = companyNameTemp;
  }
  let initialCount: number = 0;
  let initialGrossPricePerShare: number = 0;
  if (totalValue && priceMatch && priceMatch[0]) {
    initialGrossPricePerShare = +priceMatch[0];
    initialCount = Math.round(totalValue / initialGrossPricePerShare);
  }

  const [formSent, setFormSent] = useState(false);
  const { t } = useTranslation();
  const [selectedCompany, setSelectedCompany] = useState<
    ICompanyListItem | undefined
  >(
    portfolio.companies.find(
      (element) => element.ticker === initialCompanyTicker,
    ),
  );
  const [selectedCompanyCurrency, setSelectedCompanyCurrency] = useState(
    selectedCompany?.dividendsCurrency,
  );
  const [portfolioCurrency] = useState(portfolio.baseCurrency.code);
  const [transactionDate, setTransactionDate] = useState(
    initialTransactionDate.format("YYYY-MM-DD"),
  );

  const {
    isRefetching: exchangeRateLoading,
    refetch,
    data: exchangeRateData,
    error: errorFetchingExchangeRate,
  } = useExchangeRate(
    selectedCompanyCurrency,
    portfolioCurrency,
    transactionDate,
  );
  const { mutate: createDividendsTransaction, isLoading: loading } =
    useAddDividendsTransaction();

  const onCompanyChange = (value: string) => {
    const tempCompany = portfolio.companies.find(
      (element) => element.id === +value,
    );
    if (tempCompany) {
      setSelectedCompany(tempCompany);
      setSelectedCompanyCurrency(tempCompany.dividendsCurrency);
    }
  };

  const onDateChange = (e: any) => {
    setTransactionDate(e.target.value);
  };

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    if (!selectedCompany) {
      console.log("No company selected");
      return;
    }

    const { count, commission, company, grossPricePerShare } = values;

    let exchangeRateValue = 1;
    if (selectedCompany.dividendsCurrency === portfolio.baseCurrency.code) {
      exchangeRateValue = 1;
    } else {
      exchangeRateValue = values.exchangeRate;
    }
    let formattedCommission = commission;
    if (formattedCommission < 0) {
      formattedCommission *= -1;
    }
    const grossPrice = (+grossPricePerShare).toFixed(3);
    const transaction: IDividendsTransactionFormFields = {
      count,
      grossPricePerShare: Number(grossPrice),
      grossPricePerShareCurrency: selectedCompany.dividendsCurrency,
      totalCommission: formattedCommission.toFixed(3),
      totalCommissionCurrency: selectedCompany.dividendsCurrency,
      exchangeRate: exchangeRateValue,
      transactionDate,
      color: "#0066cc",
      notes: `Imported from IB CSV on ${moment(new Date()).format(
        "YYYY-MM-DD HH:mm:ss",
      )}. ${notes}`,
      company,
    };
    console.debug(transaction);
    createDividendsTransaction({
      companyId: selectedCompany.id,
      newTransaction: transaction,
    });
    setFormSent(true);
  };

  const fetchExchangeRate = async () => {
    if (selectedCompany && portfolio) {
      console.debug(`fetching exchange rate for ${selectedCompany.ticker}`);
      refetch();
    }
  };

  useEffect(() => {
    if (exchangeRateData) {
      form.setFieldsValue({
        exchangeRate: exchangeRateData.exchangeRate,
      });
    } else if (errorFetchingExchangeRate) {
      form.setFields([
        {
          name: "exchangeRate",
          errors: [t("Unable to fetch the exchange rates for the given date")],
        },
      ]);
    }
  }, [exchangeRateData, t, errorFetchingExchangeRate, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        commission: initialCommission,
        grossPricePerShare: initialGrossPricePerShare,
        count: initialCount,
        transactionDate: initialTransactionDate.format("YYYY-MM-DD"),
        company: selectedCompany ? selectedCompany.id : undefined,
      }}
    >
      <Row>
        <Col>
          <Typography.Title level={4}>
            {initialCompanyTicker} ({initialCompanyCurrency})
          </Typography.Title>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="count"
            label={t("Count")}
            rules={[{ required: true, message: t("Please input the company") }]}
            help={`${t(
              "Received",
            )}: ${initialCount} = ${totalValue} (total) / ${initialGrossPricePerShare} (${t(
              "price per share",
            )})`}
          >
            <Input placeholder={t("Count")} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="grossPricePerShare"
            label={t("Gross price per share")}
            rules={[{ required: true, message: t("Please input the price") }]}
            help={`${t("Received")}: ${inputData.data[indexes.notes]}`}
          >
            <Input placeholder={t("Price")} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="commission"
            label={t("Commission")}
            rules={[
              { required: true, message: t("Please input the commission") },
            ]}
            help={`${t("Received")}: ${
              inputData.commissions
                ? `${inputData.commissions[4]} ${inputData.commissions[5]}`
                : t("Nothing")
            }`}
          >
            <Input placeholder={t("Commission")} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="company"
            label={t("Company")}
            rules={[{ required: true, message: t("Please select a company") }]}
            help={`${t("Received")}: ${initialCompanyTicker}`}
          >
            <Select placeholder={t("Company")} onChange={onCompanyChange}>
              {portfolio.companies.map((element) => (
                <Select.Option key={element.id} value={element.id}>
                  {element.name} ({element.ticker})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="transactionDate"
            label={t("Date")}
            rules={[{ required: true, message: t("Please input the date") }]}
            help={`${t("Received")}: ${
              inputData.data[indexes.transactionDate]
            }`}
          >
            <Input onChange={onDateChange} placeholder={t("Date")} />
          </Form.Item>
        </Col>

        {selectedCompany?.dividendsCurrency !== portfolio.baseCurrency.code && (
          <>
            <Col span={6}>
              <Form.Item
                name="exchangeRate"
                label={t("Exchange rate")}
                rules={[
                  {
                    required: true,
                    message: t("Please input the exchange rate"),
                  },
                ]}
                help={
                  selectedCompany?.dividendsCurrency &&
                  portfolio.baseCurrency.code &&
                  `${selectedCompany?.dividendsCurrency} to ${portfolio.baseCurrency.code}`
                }
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
            <Col span={6}>
              <Form.Item label="&nbsp;">
                <Button
                  disabled={initialTransactionDate === null || !selectedCompany}
                  onClick={fetchExchangeRate}
                  loading={exchangeRateLoading}
                  title={`${selectedCompany?.dividendsCurrency} to ${portfolio.baseCurrency.code}`}
                >
                  {t("Get exchange rate")}
                </Button>
              </Form.Item>
            </Col>
          </>
        )}
        <Col span={12}>
          <Form.Item label="&nbsp;">
            <Button
              type="primary"
              htmlType="submit"
              disabled={formSent}
              loading={loading}
              icon={formSent ? <CheckOutlined /> : null}
            >
              {t("Add dividend")}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
