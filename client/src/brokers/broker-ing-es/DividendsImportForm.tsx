import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography,
  InputNumber,
} from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import { formatINGRowForDividends, getCompanyFromTransaction } from "./utils";
import { useCurrencies } from "hooks/use-currencies/use-currencies";
import { useAddDividendsTransaction } from "hooks/use-dividends-transactions/use-dividends-transactions";
import { useExchangeRate } from "hooks/use-exchange-rates/use-exchange-rates";
import { ICompanyListItem } from "types/company";
import { ICurrency } from "types/currency";
import { IDividendsTransactionFormFields } from "types/dividends-transaction";
import { IPortfolio } from "types/portfolio";

interface IProps {
  inputData: Array<string>;
  portfolio: IPortfolio;
}

export default function DividendsImportForm({
  inputData,
  portfolio,
}: IProps): ReactElement {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [formSent, setFormSent] = useState(false);
  const [commissionLoading, setCommissionLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const {
    companyName,
    total,
    transactionDate: initialTransactionDate,
    count: initialCount,
    price,
  } = formatINGRowForDividends(inputData);
  const [selectedCompany, setSelectedCompany] = useState<
    ICompanyListItem | undefined
  >(getCompanyFromTransaction(companyName, portfolio));
  const [selectedCompanyCurrency, setSelectedCompanyCurrency] = useState(
    selectedCompany?.dividendsCurrency,
  );
  const [portfolioCurrency] = useState(portfolio.baseCurrency.code);
  const [transactionDate, setTransactionDate] = useState(
    initialTransactionDate.format("YYYY-MM-DD"),
  );
  const { mutate: createDividendsTransaction, isLoading: loading } =
    useAddDividendsTransaction();
  const { isFetching: currenciesLoading, data: currencies } = useCurrencies();
  const {
    isFetching: exchangeRateLoading,
    refetch,
    error: errorFetchingExchangeRate,
    data: exchangeRateData,
  } = useExchangeRate(
    selectedCompanyCurrency,
    portfolioCurrency,
    transactionDate,
  );

  const onCompanyChange = (value: number) => {
    const tempCompany = portfolio.companies.find(
      (element) => element.id === value,
    );
    if (tempCompany) {
      setSelectedCompany(tempCompany);
      setSelectedCompanyCurrency(tempCompany.dividendsCurrency);
      form.setFieldsValue({
        currency: tempCompany?.baseCurrency,
      });
    }
  };

  const onDateChange = (e: any) => {
    setTransactionDate(e.target.value);
  };

  const fetchExchangeRate = async () => {
    console.log("fetching exchange rate");
    console.log(form.getFieldValue("transactionDate"));
    if (selectedCompany && portfolio) {
      refetch();
    }
  };

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    if (!selectedCompany) {
      return;
    }

    const { count, commissionInCompanyCurrency, company, grossPricePerShare } =
      values;

    let exchangeRateValue = 1;
    if (selectedCompany.baseCurrency === portfolio.baseCurrency.code) {
      exchangeRateValue = 1;
    } else {
      exchangeRateValue = values.exchangeRate;
    }
    let formattedCommission = commissionInCompanyCurrency;
    if (formattedCommission < 0) {
      formattedCommission *= -1;
    }
    const grossPriceInNumber = (+grossPricePerShare).toFixed(3);
    const commissionInNumber = (+formattedCommission).toFixed(3);

    console.log(typeof grossPriceInNumber);
    const transaction: IDividendsTransactionFormFields = {
      count,
      grossPricePerShare: +grossPriceInNumber,
      grossPricePerShareCurrency: selectedCompany.baseCurrency,
      totalCommission: +commissionInNumber,
      totalCommissionCurrency: selectedCompany.baseCurrency,
      exchangeRate: exchangeRateValue,
      transactionDate,
      color: "#0066cc",
      notes: `Imported from ING-es CSV on ${moment(new Date()).format(
        "YYYY-MM-DD HH:mm:ss",
      )}`,
      company,
    };
    createDividendsTransaction({
      companyId: selectedCompany.id,
      newTransaction: transaction,
    });
    setFormSent(true);
  };

  const getPriceInCompanyCurrency = useCallback(async () => {
    setPriceLoading(true);
    console.debug("getting price in company currency");
    form.setFields([
      {
        name: "grossPricePerShare",
        errors: undefined,
      },
    ]);
    if (selectedCompany && portfolio) {
      if (selectedCompany?.dividendsCurrency === "EUR") {
        form.setFieldsValue({
          grossPricePerShare: price.toFixed(3),
        });
        console.log(`${total} - ${price * initialCount}`);
      } else {
        console.debug("getting exchange rate from API");
        const { data: exchangeRateResult } = await refetch();
        if (exchangeRateResult) {
          form.setFieldsValue({
            grossPricePerShare: (
              price * exchangeRateResult.exchangeRate
            ).toFixed(3),
          });
        } else {
          form.setFields([
            {
              name: "grossPricePerShare",
              errors: ["Unable to fetch the exchange rates for the given date"],
            },
          ]);
        }
      }
    }
    setPriceLoading(false);
  }, [form, initialCount, portfolio, price, refetch, selectedCompany, total]);

  const getCommissionInCompanyCurrency = async () => {
    setCommissionLoading(true);
    if (selectedCompany && portfolio) {
      if (selectedCompany?.baseCurrency !== "EUR") {
        refetch();
      }
    }
    setCommissionLoading(false);
  };

  useEffect(() => {
    getPriceInCompanyCurrency();
  }, [getPriceInCompanyCurrency]);

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
  }, [errorFetchingExchangeRate, exchangeRateData, form, t]);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      initialValues={{
        grossPricePerShare: price,
        count: initialCount,
        transactionDate: initialTransactionDate.format("YYYY-MM-DD"),
        currency: selectedCompany ? selectedCompany.baseCurrency : "",
        company: selectedCompany?.id,
      }}
    >
      <Row>
        <Typography.Title level={4}>
          {inputData[1]} {companyName}
        </Typography.Title>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="count"
            label={t("Count")}
            rules={[
              { required: true, message: t("Please input the shares count") },
            ]}
            help={`${t("Received")}: ${inputData[6]}`}
          >
            <Input placeholder={t("Count")} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="grossPricePerShare"
            label={t("Gross price per share")}
            rules={[{ required: true, message: t("Please input the price") }]}
            help={`${t("Received")}: ${inputData[7]}`}
          >
            <Input
              placeholder={t("Gross price per share")}
              addonAfter={`${selectedCompany?.dividendsCurrency}`}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="&nbsp;">
            <Button
              disabled={
                initialTransactionDate === null ||
                selectedCompany?.dividendsCurrency === undefined
              }
              onClick={getPriceInCompanyCurrency}
              loading={priceLoading}
              title={`EUR ${t("to")} ${selectedCompany?.dividendsCurrency}`}
            >
              {t("Get price")}
            </Button>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="company"
            label={t("Company")}
            rules={[{ required: true, message: t("Please input the company") }]}
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
        <Col span={6}>
          <Form.Item
            name="commissionInCompanyCurrency"
            label={t("Commission in company currency")}
            rules={[
              {
                required: true,
                message: t("Please input the commission of the transaction"),
              },
            ]}
            help={`${t("Received")}: ${t("Total")} = ${inputData[9]}`}
          >
            <InputNumber
              decimalSeparator="."
              min={0}
              step={0.001}
              style={{ width: "100%" }}
              disabled={exchangeRateLoading}
              addonAfter={`${selectedCompany?.dividendsCurrency}`}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="&nbsp;">
            <Button
              disabled={
                initialTransactionDate === null ||
                selectedCompany?.dividendsCurrency === undefined
              }
              onClick={getCommissionInCompanyCurrency}
              loading={commissionLoading}
              title={`EUR ${t("to")} ${selectedCompany?.dividendsCurrency}`}
            >
              {t("Get commission")}
            </Button>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="currency"
            label={t("Currency")}
            rules={[
              { required: true, message: t("Please input the currency") },
            ]}
          >
            <Select placeholder={t("Currency")} loading={currenciesLoading}>
              {currencies &&
                currencies.map((element: ICurrency) => (
                  <Select.Option key={element.code} value={element.code}>
                    {element.name} ({element.code})
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
            help={`${t("Received")}: ${inputData[0]}`}
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
              {t("Add dividends")}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
