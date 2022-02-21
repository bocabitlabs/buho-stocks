import React, { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Input, Select, Switch, Upload } from "antd";
import CountrySelector from "components/CountrySelector/CountrySelector";
import {
  useAddCompany,
  useUpdateCompany,
} from "hooks/use-companies/use-companies";
import { useCurrencies } from "hooks/use-currencies/use-currencies";
import { useMarkets } from "hooks/use-markets/use-markets";
import { useSectors } from "hooks/use-sectors/use-sectors";
import { ICompany } from "types/company";
import { ICurrency } from "types/currency";
import { IMarket } from "types/market";
import { ISector } from "types/sector";

interface AddEditFormProps {
  portfolioId: string;
  company?: ICompany;
}

function CompanyAddEditForm({
  portfolioId,
  company,
}: AddEditFormProps): ReactElement | null {
  const [form] = Form.useForm();
  const [countryCode, setCountryCode] = useState(
    company ? company.countryCode : "",
  );
  const { t } = useTranslation();

  const [fileList, setFileList] = useState<any[]>([]);
  const [base64File, setBas64File] = useState<any>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const { data: currencies, isFetching: currenciesLoading } = useCurrencies();
  const { data: markets, isFetching: marketsLoading } = useMarkets();
  const { data: sectors, isFetching: sectorsLoading } = useSectors();
  const { mutateAsync: createCompany, isLoading: createLoading } =
    useAddCompany();
  const { mutateAsync: updateCompany, isLoading: updateLoading } =
    useUpdateCompany();

  const navigate = useNavigate();

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

    if (company) {
      try {
        await updateCompany({
          portfolioId: +portfolioId,
          companyId: company.id,
          newCompany,
        });
        toast.success(t("Company has been updated"));
        navigate(-1);
      } catch (error) {
        toast.error(t("Cannot update company"));
      }
    } else {
      try {
        await createCompany({ portfolioId: +portfolioId, newCompany });
        toast.success(t("Company has been created"));
        navigate(-1);
      } catch (error) {
        toast.error(t("Cannot create company"));
      }
    }
  };

  const handleCountryChange = (newValue: string) => {
    setCountryCode(newValue);
  };

  const handleUpload = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    setFileName(newFileList[0].name);
    getBase64(newFileList[0].originFileObj, (imageUrl: any) => {
      setBas64File(imageUrl);
    });
  };

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
        <Button
          type="primary"
          htmlType="submit"
          loading={createLoading || updateLoading}
        >
          {company ? t("Update company") : t("Add company")}
        </Button>
      </Form.Item>
    </Form>
  );
}

CompanyAddEditForm.defaultProps = {
  company: undefined,
};

export default CompanyAddEditForm;
