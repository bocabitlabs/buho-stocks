import React, { ReactElement, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Form,
  Input,
  Select,
  Spin,
  Switch,
  Upload,
} from "antd";
import useFetch from "use-http";
import CountrySelector from "components/CountrySelector/CountrySelector";
import { AlertMessagesContext } from "contexts/alert-messages";
import { ICompany } from "types/company";
import { ICurrency } from "types/currency";
import { IMarket } from "types/market";
import { ISector } from "types/sector";

interface AddEditFormProps {
  portfolioId: string;
  companyId?: string;
}

function CompanyAddEditForm({
  portfolioId,
  companyId,
}: AddEditFormProps): ReactElement | null {
  const [form] = Form.useForm();
  const [countryCode, setCountryCode] = useState("");
  const { t } = useTranslation();
  const { createError, createSuccess } = useContext(AlertMessagesContext);

  const [company, setCompany] = useState<ICompany | null>(null);
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const [markets, setMarkets] = useState<IMarket[]>([]);
  const [sectors, setSectors] = useState<ISector[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [base64File, setBas64File] = useState<any>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const { response, get, put, post, cache, loading } = useFetch(
    `portfolios/${portfolioId}/companies`,
  );
  const {
    get: getCurrencies,
    response: currenciesResponse,
    loading: currenciesLoading,
  } = useFetch("currencies");
  const {
    response: marketsResponse,
    get: getMarkets,
    loading: marketsLoading,
  } = useFetch("markets");
  const {
    response: sectorsResponse,
    get: getSectors,
    loading: sectorsLoading,
  } = useFetch("sectors");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadInitialCompany() {
      const initialCompany = await get(`${companyId}/`);
      if (response.ok) {
        setCompany(initialCompany);
        setCountryCode(initialCompany.countryCode);
      }
    }
    if (companyId) {
      loadInitialCompany();
    }
  }, [response.ok, get, companyId]);

  useEffect(() => {
    async function loadInitialCurrencies() {
      const initialCompany = await getCurrencies();
      if (currenciesResponse.ok) setCurrencies(initialCompany);
    }
    loadInitialCurrencies();
  }, [currenciesResponse.ok, getCurrencies]);
  useEffect(() => {
    async function loadInitialMarkets() {
      const initialMarkets = await getMarkets();
      if (marketsResponse.ok) setMarkets(initialMarkets);
    }
    loadInitialMarkets();
  }, [marketsResponse.ok, getMarkets]);
  useEffect(() => {
    async function loadInitialSectors() {
      const initialSectors = await getSectors();
      if (sectorsResponse.ok) setSectors(initialSectors);
    }
    loadInitialSectors();
  }, [sectorsResponse.ok, getSectors]);

  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleSubmit = async (values: any) => {
    const {
      name,
      description,
      baseCurrency,
      dividendsCurrency,
      sector,
      market,
      ticker,
      altTickers,
      url,
      broker,
      isClosed,
    } = values;
    const newCompany = {
      name,
      color: "#2196F3",
      description,
      baseCurrency,
      dividendsCurrency,
      sector,
      market,
      logo: base64File,
      portfolio: +portfolioId,
      ticker,
      altTickers,
      url,
      broker,
      countryCode,
      isClosed,
    };

    if (companyId) {
      const id: number = +companyId;
      await put(`${id}/`, newCompany);
      if (!response.ok) {
        createError(t("Cannot update company"));
      } else {
        cache.clear();
        createSuccess(t("Company has been updated"));
        navigate(-1);
      }
    } else {
      await post("/", newCompany);
      if (!response.ok) {
        createError(t("Cannot create company"));
      } else {
        cache.clear();
        createSuccess(t("Company has been created"));
        navigate(-1);
      }
    }
  };

  const handleCountryChange = (newValue: string) => {
    setCountryCode(newValue);
  };

  const handleUpload = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    console.log(newFileList[0]);
    setFileName(newFileList[0].name);
    getBase64(newFileList[0].originFileObj, (imageUrl: any) => {
      setBas64File(imageUrl);
    });
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
        name: company?.name,
        description: company?.description,
        ticker: company?.ticker,
        altTickers: company?.altTickers,
        broker: company?.broker,
        url: company?.url,
        sector: company?.sector.id,
        baseCurrency: company?.baseCurrency.code,
        dividendsCurrency: company?.dividendsCurrency.code,
        market: company?.market.id,
        isClosed: company?.isClosed,
        countryCode: company?.countryCode,
      }}
    >
      <Form.Item
        name="name"
        label={t("Name")}
        rules={[
          {
            required: true,
            message: t("Please input the name of the company"),
          },
        ]}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item name="ticker" label={t("Ticker")}>
        <Input type="text" />
      </Form.Item>
      <Form.Item name="altTickers" label={t("Altnernative tickers")}>
        <Input type="text" />
      </Form.Item>
      <Form.Item name="logo" label="Company Logo">
        <Upload
          showUploadList={false}
          name="logo"
          fileList={fileList}
          onChange={handleUpload}
          beforeUpload={() => false} // return false so that antd doesn't upload the picture right away
        >
          {company?.logo && !fileName && (
            <Avatar src={company.logo} style={{ marginRight: 10 }} />
          )}
          <Button icon={<PlusOutlined />}>Upload</Button>{" "}
          {fileName ? `Selected ${fileName}` : ""}
        </Upload>
      </Form.Item>
      <Form.Item name="baseCurrency" label={t("Currency")}>
        <Select
          showSearch
          placeholder={t("Select a currency")}
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
      <Form.Item name="dividendsCurrency" label={t("Dividends Currency")}>
        <Select
          showSearch
          placeholder={t("Select a currency for the dividends")}
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
      <Form.Item name="market" label={t("Market")}>
        <Select
          placeholder={t("Select a market")}
          allowClear
          loading={marketsLoading}
        >
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
        <Select
          placeholder={t("Select a sector")}
          allowClear
          loading={sectorsLoading}
        >
          {sectors &&
            sectors.map((sectorItem: ISector) => (
              <Select.Option
                value={sectorItem.id}
                key={`sector-${sectorItem.id}-${sectorItem.id}`}
              >
                {sectorItem.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item label={t("Is closed")} name="isClosed" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item name="broker" label={t("Broker")}>
        <Input type="text" />
      </Form.Item>
      <Form.Item name="url" label={t("URL")}>
        <Input type="text" />
      </Form.Item>
      <Form.Item name="countryCode" label={t("Country")}>
        <CountrySelector
          handleChange={handleCountryChange}
          initialValue={countryCode}
        />
      </Form.Item>
      <Form.Item name="description" label={t("Description")}>
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {companyId ? t("Update company") : t("Add company")}
        </Button>
      </Form.Item>
    </Form>
  );
}

CompanyAddEditForm.defaultProps = {
  companyId: null,
};

export default CompanyAddEditForm;
