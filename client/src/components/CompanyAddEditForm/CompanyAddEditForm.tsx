import React, { ReactElement, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form, Input, Select, Spin, Switch } from "antd";
import ColorSelector from "components/ColorSelector/ColorSelector";
import CountrySelector from "components/CountrySelector/CountrySelector";
import { CompaniesContext } from "contexts/companies";
import { CurrenciesContext } from "contexts/currencies";
import { MarketsContext } from "contexts/markets";
import { SectorsContext } from "contexts/secctors";
import { ICurrency } from "types/currency";
import { IMarket } from "types/market";
import { ISector } from "types/sector";

interface AddEditFormProps {
  portfolioId: string;
  companyId?: string;
}

function CompanyAddEditForm({
  portfolioId,
  companyId
}: AddEditFormProps): ReactElement | null {
  const [form] = Form.useForm();
  const [color, setColor] = useState("#607d8b");
  const [country, setCountry] = useState("");
  const { t } = useTranslation();

  const {
    company,
    create: addCompany,
    getById: getCompanyById,
    update: updateCompany
  } = useContext(CompaniesContext);

  const { currencies, getAll: getAllCurrencies } =
    useContext(CurrenciesContext);
  const { markets, getAll: getAllMarkets } = useContext(MarketsContext);
  const { sectors, getAll: getAllSectors } = useContext(SectorsContext);

  useEffect(() => {
    if (companyId) {
      const id: number = +companyId;
      getCompanyById(id);
    }
  }, [companyId, getCompanyById]);

  useEffect(() => {
    const getAll = async () => {
      getAllCurrencies();
    };
    getAll();
  }, [getAllCurrencies]);

  useEffect(() => {
    const getAll = async () => {
      getAllMarkets();
    };
    getAll();
  }, [getAllMarkets]);

  useEffect(() => {
    const getAll = async () => {
      getAllSectors();
    };
    getAll();
  }, [getAllSectors]);

  useEffect(() => {
    if (companyId) {
      if (company) {
        setColor(company.color);
      }
    }
  }, [companyId, company]);

  const handleSubmit = (values: any) => {
    const {
      name,
      description,
      currency,
      dividendsCurrency,
      sector,
      market,
      ticker,
      altTickers,
      url,
      broker,
      isClosed
    } = values;
    const newCompany = {
      name,
      color,
      description,
      baseCurrency: currency,
      dividendsCurrency,
      sector,
      market,
      portfolio: +portfolioId,
      ticker,
      altTickers,
      url,
      broker,
      countryCode: country,
      isClosed
    };
    console.log(newCompany);

    if (companyId) {
      const id: number = +companyId;
      updateCompany(id, newCompany);
    } else {
      addCompany(newCompany);
    }
  };

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
  };

  const handleCountryChange = (newValue: string) => {
    console.debug(newValue);
    setCountry(newValue);
  };

  if (companyId && !company) {
    return <Spin />;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        name: company?.name
        // description: portfolio?.description,
        // hideClosedCompanies: portfolio?.hideClosedCompanies,
        // baseCurrencyId: portfolio?.baseCurrency
      }}
    >
      <Form.Item
        name="name"
        label={t("Name")}
        rules={[
          { required: true, message: t("Please input the name of the market") }
        ]}
      >
        <Input type="text" placeholder="NYSE, NASDAQ,..." />
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
      <Form.Item name="currency" label={t("Currency")}>
        <Select showSearch placeholder={t("Select a currency")} allowClear>
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
      <Form.Item name="dividendsCurrency" label={t("Dividends Currency")}>
        <Select
          showSearch
          placeholder={t("Select a currency for the dividends")}
          allowClear
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
      <Form.Item name="market" label={t("Market")}>
        <Select placeholder={t("Select a market")} allowClear>
          {markets &&
            markets.map((sectorItem: IMarket) => (
              <Select.Option
                value={sectorItem.id}
                key={`currency-${sectorItem.id}-${sectorItem.id}`}
              >
                {sectorItem.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item name="sector" label={t("Sector")}>
        <Select placeholder={t("Select a sector")} allowClear>
          {sectors &&
            sectors.map((sectorItem: ISector) => (
              <Select.Option
                value={sectorItem.id}
                key={`currency-${sectorItem.id}-${sectorItem.id}`}
              >
                {sectorItem.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item label={t("Is closed")} name="isClosed" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item name="ticker" label={t("Ticker")}>
        <Input type="text" />
      </Form.Item>
      <Form.Item name="altTickers" label={t("Altnernative tickers")}>
        <Input type="text" />
      </Form.Item>
      <Form.Item name="broker" label={t("Broker")}>
        <Input type="text" />
      </Form.Item>
      <Form.Item name="url" label={t("URL")}>
        <Input type="text" />
      </Form.Item>
      <Form.Item name="description" label={t("Description")}>
        <Input type="text" />
      </Form.Item>
      <Form.Item name="country" label={t("Country")}>
        <CountrySelector
          handleChange={handleCountryChange}
          initialValue={company?.countryCode}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {companyId ? t("Update company") : t("Add company")}
        </Button>
      </Form.Item>
    </Form>
  );
}

CompanyAddEditForm.defaultProps = {
  companyId: null
};

export default CompanyAddEditForm;
