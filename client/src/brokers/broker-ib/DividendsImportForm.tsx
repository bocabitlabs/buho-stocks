import React, { ReactElement, useState } from "react";
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
  Typography
} from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import useFetch from "use-http";
import { ICompany } from "types/company";
import { IDividendsTransactionFormFields } from "types/dividends-transaction";
import { IPortfolio } from "types/portfolio";

interface IProps {
  inputData: any;
  portfolio: IPortfolio;
}

export default function IBDividendsImportForm({
  inputData,
  portfolio
}: IProps): ReactElement {
  const [form] = Form.useForm();

  const indexes = {
    notes: 4,
    transactionTotal: 5,
    commissionIndex: 5,
    currency: 2,
    transactionDate: 3
  };

  const notes = inputData.data[indexes.notes];
  const priceMatch = inputData.data[indexes.notes].match(/[+-]?\d+(\.\d+)/);
  const companyNameMatch = inputData.data[indexes.notes].match(/^(\w)+/g);
  const totalValue = +inputData.data[indexes.transactionTotal];
  const initialCompanyCurrency = inputData.data[indexes.currency];
  const initialCommission = inputData.commissions
    ? inputData.commissions[indexes.commissionIndex] * -1
    : 0;
  // const initialCompanyCurrency = inputData[4];
  // const initialCompanyTicker = inputData[5];
  // const initialCount = +inputData[7];
  const initialTransactionDate = moment(
    inputData.data[indexes.transactionDate]
  );
  // const initialGrossPricePerShare = +inputData[8];
  // const initialCommission = +inputData[11];

  console.log("portfolio", portfolio);
  console.log("priceMatch", priceMatch);
  console.log("initialTransactionDate", initialTransactionDate);
  console.log("notes", notes);
  console.log("totalValue", totalValue);
  console.log("companyNameMatch", companyNameMatch);
  console.log("initialCompanyCurrency", initialCompanyCurrency);

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

  console.log("companyTicker", initialCompanyTicker);
  console.log("count", initialCount);
  console.log("price", initialGrossPricePerShare);
  console.log("commission", initialCommission);
  console.log("commissions", inputData.commissions);

  const [formSent, setFormSent] = useState(false);
  const { t } = useTranslation();
  const [selectedCompany, setSelectedCompany] = useState<ICompany | undefined>(
    portfolio.companies.find(
      (element) => element.ticker === initialCompanyTicker
    )
  );
  const {
    loading: exchangeRateLoading,
    get: getExchangeRate,
    response: exchangeRateResponse
  } = useFetch("exchange-rates");
  const {
    loading: dividendsLoading,
    post: postDividendsTransaction,
    response: dividendsResponse
  } = useFetch(`companies/${selectedCompany?.id}/dividends`);

  const onCompanyChange = (value: string) => {
    const tempCompany = portfolio.companies.find(
      (element) => element.ticker === value
    );
    if (tempCompany) {
      setSelectedCompany(tempCompany);
    }
  };

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    if (!selectedCompany) {
      return;
    }

    const { count, commission, company, transactionDate, grossPricePerShare } =
      values;

    let exchangeRateValue = 1;
    if (selectedCompany.baseCurrency.code === portfolio.baseCurrency.code) {
      exchangeRateValue = 1;
    } else {
      exchangeRateValue = values.exchangeRate;
    }
    let formattedCommission = commission;
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
      notes: `Imported from IB CSV on ${moment(new Date()).format(
        "YYYY-MM-DD HH:mm:ss"
      )}. ${notes}`,
      company,
      portfolio: portfolio.id
    };
    console.debug(transaction);
    await postDividendsTransaction("/", transaction);
    if (dividendsResponse.ok) {
      setFormSent(true);
    }
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
        company: selectedCompany ? selectedCompany.id : undefined
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
            label="Count"
            rules={[{ required: true, message: "Please input the company" }]}
            help={`Received: ${initialCount} = ${totalValue} (total) / ${initialGrossPricePerShare} (price per share)`}
          >
            <Input placeholder="Count" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="grossPricePerShare"
            label="Gross price per share"
            rules={[{ required: true, message: "Please input the price" }]}
            help={`Received: ${inputData.data[indexes.notes]}`}
          >
            <Input placeholder="Price" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="commission"
            label="Commission"
            rules={[{ required: true, message: "Please input the commission" }]}
            help={`Received: ${
              inputData.commissions
                ? `${inputData.commissions[4]} ${inputData.commissions[5]}`
                : "Nothing"
            }`}
          >
            <Input placeholder="Commission" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="company"
            label="Company"
            rules={[{ required: true, message: "Please select a company" }]}
            help={`Received: ${initialCompanyTicker}`}
          >
            <Select placeholder="Company" onChange={onCompanyChange}>
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
            label="Date"
            rules={[{ required: true, message: "Please input the date" }]}
            help={`Received: ${inputData.data[indexes.transactionDate]}`}
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
              Add transaction
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
