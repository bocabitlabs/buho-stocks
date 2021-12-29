import React, { ReactElement, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Select, Spin, Switch } from "antd";
import useFetch from "use-http";
import ColorSelector from "components/ColorSelector/ColorSelector";
import CountrySelector from "components/CountrySelector/CountrySelector";
import { AlertMessagesContext } from "contexts/alert-messages";
import { ICurrency } from "types/currency";
import { IPortfolio } from "types/portfolio";

interface AddEditFormProps {
  portfolioId?: string;
}

function PortfolioAddEditForm({
  portfolioId,
}: AddEditFormProps): ReactElement | null {
  const [form] = Form.useForm();
  const [color, setColor] = useState("#607d8b");
  const [country, setCountry] = useState("");
  const { createSuccess, createError } = useContext(AlertMessagesContext);
  const [portfolio, setPortfolio] = useState<IPortfolio | null>(null);
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const { t } = useTranslation();
  const { get, post, put, response, loading, cache } = useFetch("portfolios/");
  const {
    get: getCurrencies,
    response: currenciesResponse,
    loading: currenciesLoading,
  } = useFetch("currencies/");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      const result = await get(portfolioId);
      if (response.ok) {
        setPortfolio(result);
      }
    };
    const fetchCurrencies = async () => {
      const result = await getCurrencies();
      if (currenciesResponse.ok) {
        setCurrencies(result);
      }
    };

    if (portfolioId) {
      fetchPortfolio();
    }
    fetchCurrencies();
  }, [portfolioId, get, getCurrencies, response, currenciesResponse]);

  useEffect(() => {
    if (portfolioId) {
      if (portfolio) {
        setColor(portfolio.color);
        setCountry(portfolio.countryCode);
      }
    }
  }, [portfolioId, portfolio]);

  const handleSubmit = async (values: any) => {
    const { name, description, baseCurrencyId, hideClosedCompanies } = values;
    const newPortfolio = {
      name,
      color,
      description,
      baseCurrency: baseCurrencyId,
      hideClosedCompanies,
      countryCode: country,
    };
    console.log(newPortfolio);

    if (portfolioId) {
      const id: number = +portfolioId;
      await put(`${id}/`, newPortfolio);
      if (!response.ok) {
        createError(t("Cannot update portfolio"));
      } else {
        cache.clear();
        createSuccess(t("Portfolio has been updated"));
        navigate(-1);
      }
    } else {
      await post("/", newPortfolio);
      if (!response.ok) {
        createError(t("Cannot create portfolio"));
      } else {
        cache.clear();
        createSuccess(t("Portfolio has been created"));
        navigate(-1);
      }
    }
  };

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
  };

  const handleCountryChange = (newValue: string) => {
    console.debug(newValue);
    setCountry(newValue);
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        name: portfolio?.name,
        description: portfolio?.description,
        hideClosedCompanies: portfolio?.hideClosedCompanies,
        baseCurrencyId: portfolio?.baseCurrency,
      }}
    >
      <Form.Item
        name="name"
        label={t("Name")}
        rules={[
          {
            required: true,
            message: t("Please input the name of the portfolio"),
          },
        ]}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item
        label={
          <div>
            {t("Color")}:{" "}
            <svg
              width="35"
              height="35"
              viewBox="0 0 35 35"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="10"
                y="10"
                width="25"
                height="25"
                rx="5"
                ry="5"
                fill={color}
              />
            </svg>
          </div>
        }
      >
        <ColorSelector color={color} handleColorChange={handleColorChange} />
      </Form.Item>
      <Form.Item name="baseCurrencyId" label={t("Base currency")}>
        <Select
          showSearch
          placeholder={t("Select a base currency")}
          allowClear
          loading={currenciesLoading}
        >
          {currencies &&
            currencies.map((item: ICurrency) => (
              <Select.Option
                value={item.code}
                key={`currency-${item.code}-${item.code}`}
              >
                {item.name} ({item.code})
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item name="country" label={t("Country")}>
        <CountrySelector
          handleChange={handleCountryChange}
          initialValue={portfolio?.countryCode}
        />
      </Form.Item>
      <Form.Item
        label={t("Hide closed companies")}
        name="hideClosedCompanies"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      <Form.Item name="description" label={t("Description")}>
        <Input type="text" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {portfolioId ? t("Update portfolio") : t("Add portfolio")}
        </Button>
      </Form.Item>
    </Form>
  );
}

PortfolioAddEditForm.defaultProps = {
  portfolioId: null,
};

export default PortfolioAddEditForm;
