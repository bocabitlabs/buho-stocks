import React, {
  ReactElement,
  useEffect,
  useState,
  //  useContext, useState
} from "react";
import { useTranslation } from "react-i18next";
import { CheckOutlined } from "@ant-design/icons";
import {
  Row,
  Form,
  Typography,
  Col,
  Input,
  Button,
  Select,
  InputNumber,
} from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import { useExchangeRate } from "hooks/use-exchange-rates/use-exchange-rates";
import { useAddSharesTransaction } from "hooks/use-shares-transactions/use-shares-transactions";
import { ICompanyListItem } from "types/company";
import { IPortfolio } from "types/portfolio";
import { ISharesTransactionFormFields } from "types/shares-transaction";

interface IProps {
  inputData: Array<string>;
  portfolio: IPortfolio;
}

export default function IBTradesImportForm({
  inputData,
  portfolio,
}: IProps): ReactElement {
  const initialCompanyCurrency = inputData[4];
  const initialCompanyTicker = inputData[5];
  const initialCount = +inputData[7];
  const initialTransactionDate = moment(inputData[6]);
  const initialGrossPricePerShare = +inputData[8];
  let initialCommission = +inputData[11];
  if (initialCommission < 0) {
    initialCommission *= -1;
  }

  const [form] = Form.useForm();
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
    isRefetching: exchangeRateRefetching,
    isFetching: exchangeRateFetching,
    refetch,
    data: exchangeRateData,
    error: errorFetchingExchangeRate,
    isRefetchError: errorRefetchingExchangeRate,
  } = useExchangeRate(
    selectedCompanyCurrency,
    portfolioCurrency,
    transactionDate,
  );

  const { mutate: createSharesTransaction, isLoading: loading } =
    useAddSharesTransaction();

  const onCompanyChange = (value: string) => {
    const tempCompany = portfolio.companies.find((element) => {
      console.log(element.id, value);
      return element.id === +value;
    });
    if (tempCompany) {
      setSelectedCompany(tempCompany);
      setSelectedCompanyCurrency(tempCompany.dividendsCurrency);
    }
  };

  const onDateChange = (e: any) => {
    setTransactionDate(e.target.value);
  };

  const onFinish = async (values: any) => {
    if (!selectedCompany) {
      console.error("No company selected");
      return;
    }

    const { count, commission, company, grossPricePerShare } = values;

    let exchangeRateValue = 1;
    if (selectedCompany.baseCurrency === portfolio.baseCurrency.code) {
      exchangeRateValue = 1;
    } else {
      exchangeRateValue = values.exchangeRate;
    }
    let formattedCommission = commission;
    if (formattedCommission < 0) {
      formattedCommission *= -1;
    }

    const grossPrice = (+grossPricePerShare).toFixed(3);
    const transaction: ISharesTransactionFormFields = {
      count,
      grossPricePerShare: Number(grossPrice),
      grossPricePerShareCurrency: selectedCompany.baseCurrency,
      totalCommission: formattedCommission.toFixed(3),
      totalCommissionCurrency: selectedCompany.baseCurrency,
      exchangeRate: exchangeRateValue,
      transactionDate,
      color: "#0066cc",
      notes: `Imported from IB CSV on ${moment(new Date()).format(
        "YYYY-MM-DD HH:mm:ss",
      )}`,
      company,
      type: "BUY",
    };
    createSharesTransaction({
      companyId: selectedCompany.id,
      newTransaction: transaction,
    });
    setFormSent(true);
  };

  const fetchExchangeRate = async () => {
    console.log("fetching exchange rate");
    console.log(form.getFieldValue("transactionDate"));
    if (selectedCompany && portfolio) {
      refetch();
    }
  };

  useEffect(() => {
    if (exchangeRateData) {
      form.setFieldsValue({
        exchangeRate: exchangeRateData.exchangeRate,
      });
    }
  }, [exchangeRateData, form]);

  useEffect(() => {
    console.log("Calling useEffect");
    if (errorFetchingExchangeRate || errorRefetchingExchangeRate) {
      console.log(t("Unable to fetch the exchange rates for the given date"));
      form.setFields([
        {
          name: "exchangeRate",
          errors: [t("Unable to fetch the exchange rates for the given date")],
        },
      ]);
    }
  }, [errorFetchingExchangeRate, errorRefetchingExchangeRate, form, t]);
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
            help={`${t("Received")}: ${inputData[7]}`}
          >
            <Input placeholder={t("Count")} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="grossPricePerShare"
            label={t("Gross price per share")}
            rules={[{ required: true, message: t("Please input the price") }]}
            help={`${t("Received")}: ${inputData[8]}`}
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
            help={`${t("Received")}: ${inputData[11]}`}
          >
            <Input placeholder={t("Commission")} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="company"
            label={t("Company")}
            rules={[{ required: true, message: t("Please select a company") }]}
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
            help={`${t("Received")}: ${inputData[6]}`}
          >
            <Input onChange={onDateChange} placeholder={t("Date")} />
          </Form.Item>
        </Col>
        {selectedCompany?.baseCurrency !== portfolio.baseCurrency.code && (
          <>
            <Col span={6}>
              <Form.Item
                name="exchangeRate"
                label={`${t("Exchange rate")} ${
                  selectedCompany?.baseCurrency &&
                  portfolio.baseCurrency.code &&
                  `(${selectedCompany?.baseCurrency} to ${portfolio.baseCurrency.code}`
                })`}
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
                  disabled={exchangeRateFetching || exchangeRateRefetching}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="&nbsp;">
                <Button
                  disabled={initialTransactionDate === null || !selectedCompany}
                  onClick={fetchExchangeRate}
                  loading={exchangeRateFetching || exchangeRateRefetching}
                  title={`${selectedCompany?.baseCurrency} to ${portfolio.baseCurrency.code}`}
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
              {t("Add transaction")}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
