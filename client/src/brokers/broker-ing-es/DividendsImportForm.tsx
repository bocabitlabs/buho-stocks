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
  InputNumber
} from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import useFetch from "use-http";
import { formatINGRowForDividends, getCompanyFromTransaction } from "./utils";
import { ICompany } from "types/company";
import { ICurrency } from "types/currency";
import { IDividendsTransactionFormFields } from "types/dividends-transaction";
import { IPortfolio } from "types/portfolio";

interface IProps {
  inputData: Array<string>;
  portfolio: IPortfolio;
}

export default function DividendsImportForm({
  inputData,
  portfolio
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
    price
  } = formatINGRowForDividends(inputData);
  const [selectedCompany, setSelectedCompany] = useState<ICompany | undefined>(
    getCompanyFromTransaction(companyName, portfolio)
  );
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const {
    loading: dividendsLoading,
    post: postDividendsTransaction,
    response: dividendsResponse
  } = useFetch(`companies/${selectedCompany?.id}/dividends`);
  const {
    loading: currenciesLoading,
    get: getCurrencies,
    response: currenciesResponse
  } = useFetch(`currencies`);
  const {
    loading: exchangeRateLoading,
    get: getExchangeRate,
    response: exchangeRateResponse
  } = useFetch("exchange-rates");

  useEffect(() => {
    const fetchCurrencies = async () => {
      const results = await getCurrencies();
      if (currenciesResponse.ok) {
        setCurrencies(results);
      }
    };
    fetchCurrencies();
  }, [getCurrencies, currenciesResponse]);

  const onCompanyChange = (value: string) => {
    const company = getCompanyFromTransaction(value, portfolio);
    console.log("total", total);
    setSelectedCompany(company);
    form.setFieldsValue({
      currency: company?.baseCurrency.code
    });
  };

  const fetchExchangeRate = async () => {
    console.log("fetching exchange rate");
    console.log(form.getFieldValue("transactionDate"));
    if (selectedCompany && portfolio) {
      const newExchangeRate = await getExchangeRate(
        `${selectedCompany?.baseCurrency.code}/${
          portfolio?.baseCurrency.code
        }/${form.getFieldValue("transactionDate")}`
      );
      if (exchangeRateResponse.ok) {
        console.log(newExchangeRate);
        form.setFieldsValue({
          exchangeRate: newExchangeRate.exchangeRate
        });
      } else {
        form.setFields([
          {
            name: "exchangeRate",
            errors: ["Unable to fetch the exchange rates for the given date"]
          }
        ]);
      }
    }
  };

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    if (!selectedCompany) {
      return;
    }

    const {
      count,
      commissionInCompanyCurrency,
      company,
      transactionDate,
      grossPricePerShare
    } = values;

    let exchangeRateValue = 1;
    if (selectedCompany.baseCurrency.code === portfolio.baseCurrency.code) {
      exchangeRateValue = 1;
    } else {
      exchangeRateValue = values.exchangeRate;
    }
    let formattedCommission = commissionInCompanyCurrency;
    if (formattedCommission < 0) {
      formattedCommission *= -1;
    }
    const transaction: IDividendsTransactionFormFields = {
      count,
      grossPricePerShare: grossPricePerShare.toFixed(3),
      grossPricePerShareCurrency: selectedCompany.baseCurrency.code,
      totalCommission: formattedCommission.toFixed(3),
      totalCommissionCurrency: selectedCompany.baseCurrency.code,
      exchangeRate: exchangeRateValue,
      transactionDate,
      color: "#0066cc",
      notes: `Imported from ING-es CSV on ${moment(new Date()).format(
        "YYYY-MM-DD HH:mm:ss"
      )}`,
      company,
      portfolio: portfolio.id
    };
    await postDividendsTransaction("/", transaction);
    if (dividendsResponse.ok) {
      setFormSent(true);
    }
  };

  const getPriceInCompanyCurrency = useCallback(async () => {
    setPriceLoading(true);
    if (selectedCompany && portfolio) {
      if (selectedCompany?.dividendsCurrency.code === "EUR") {
        form.setFieldsValue({
          grossPricePerShare: price.toFixed(3)
        });
        console.log(`${total} - ${price * initialCount}`);
      } else {
        const newExchangeRate = await getExchangeRate(
          `EUR/${selectedCompany?.baseCurrency.code}/${form.getFieldValue(
            "transactionDate"
          )}`
        );
        console.log(newExchangeRate);
        if (exchangeRateResponse.ok) {
          console.log(newExchangeRate);
          form.setFieldsValue({
            grossPricePerShare: (price * newExchangeRate.exchangeRate).toFixed(
              3
            )
          });
        } else {
          form.setFields([
            {
              name: "grossPricePerShare",
              errors: ["Unable to fetch the exchange rates for the given date"]
            }
          ]);
        }
      }
    }
    setPriceLoading(false);
  }, [
    exchangeRateResponse.ok,
    form,
    getExchangeRate,
    initialCount,
    portfolio,
    price,
    selectedCompany,
    total
  ]);

  const getCommissionInCompanyCurrency = async () => {
    setCommissionLoading(true);
    if (selectedCompany && portfolio) {
      if (selectedCompany?.dividendsCurrency.code === "EUR") {
        form.setFieldsValue({
          commissionInCompanyCurrency: (price * initialCount - total).toFixed(3)
        });
      } else {
        const newExchangeRate = await getExchangeRate(
          `EUR/${selectedCompany?.baseCurrency.code}/${form.getFieldValue(
            "transactionDate"
          )}`
        );
        if (exchangeRateResponse.ok) {
          console.log(newExchangeRate);
          form.setFieldsValue({
            commissionInCompanyCurrency: (
              price * initialCount * newExchangeRate.exchangeRate -
              total
            ).toFixed(3)
          });
        } else {
          form.setFields([
            {
              name: "commissionInCompanyCurrency",
              errors: ["Unable to fetch the exchange rates for the given date"]
            }
          ]);
        }
      }
    }
    setCommissionLoading(false);
  };

  useEffect(() => {
    getPriceInCompanyCurrency();
  }, [getPriceInCompanyCurrency]);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      initialValues={{
        grossPricePerShare: price,
        count: initialCount,
        transactionDate: initialTransactionDate.format("YYYY-MM-DD"),
        currency: selectedCompany ? selectedCompany.baseCurrency.code : "",
        company: selectedCompany?.name
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
              { required: true, message: t("Please input the shares count") }
            ]}
            help={`Received: ${inputData[6]}`}
          >
            <Input placeholder={t("Count")} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="grossPricePerShare"
            label={t("Price")}
            rules={[{ required: true, message: t("Please input the price") }]}
            help={`Received: ${inputData[7]}`}
          >
            <Input
              placeholder="Price"
              addonAfter={`${selectedCompany?.dividendsCurrency.symbol}`}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="&nbsp;">
            <Button
              disabled={
                initialTransactionDate === null ||
                selectedCompany?.dividendsCurrency.code === undefined
              }
              onClick={getPriceInCompanyCurrency}
              loading={priceLoading}
              title={`EUR to ${selectedCompany?.dividendsCurrency.code}`}
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
                <Select.Option key={element.id} value={element.name}>
                  {element.name} ({element.ticker})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="commissionInCompanyCurrency"
            label="Commission in company currency"
            rules={[
              {
                required: true,
                message: t("Please input the commission of the transaction")
              }
            ]}
            help={`Received: Total = ${inputData[9]}`}
          >
            <InputNumber
              decimalSeparator="."
              min={0}
              step={0.001}
              style={{ width: "100%" }}
              disabled={exchangeRateLoading}
              addonAfter={`${selectedCompany?.dividendsCurrency.symbol}`}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="&nbsp;">
            <Button
              disabled={
                initialTransactionDate === null ||
                selectedCompany?.dividendsCurrency.code === undefined
              }
              onClick={getCommissionInCompanyCurrency}
              loading={commissionLoading}
              title={`EUR to ${selectedCompany?.dividendsCurrency.code}`}
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
              { required: true, message: t("Please input the currency") }
            ]}
          >
            <Select placeholder={t("Currency")} loading={currenciesLoading}>
              {currencies.map((element: ICurrency) => (
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
            label="Date"
            rules={[{ required: true, message: "Please input the date" }]}
            help={`Received: ${inputData[0]}`}
          >
            <Input placeholder="Date" />
          </Form.Item>
        </Col>
        {selectedCompany?.dividendsCurrency.code !==
          portfolio.baseCurrency.code && (
          <>
            <Col span={6}>
              <Form.Item
                name="exchangeRate"
                label="Exchange rate"
                rules={[
                  {
                    required: true,
                    message: t("Please input the exchange rate")
                  }
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
            <Col span={6}>
              <Form.Item label="&nbsp;">
                <Button
                  disabled={initialTransactionDate === null || !selectedCompany}
                  onClick={fetchExchangeRate}
                  loading={exchangeRateLoading}
                  title={`${selectedCompany?.dividendsCurrency.code} to ${portfolio.baseCurrency.code}`}
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
              loading={dividendsLoading}
              icon={formSent ? <CheckOutlined /> : null}
            >
              Add dividends
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
