import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Checkbox,
  Group,
  Modal,
  Select,
  TextInput,
  Image,
  Text,
  Input,
  Grid,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { NotesField } from "./components/NotesField/NotesField";
import SearchButton from "./components/SearchButton/SearchButton";
import CountrySelector from "components/CountrySelector/CountrySelector";
import { ICompany, ICompanyFormFields } from "types/company";
import { ICurrency } from "types/currency";
import { IMarket } from "types/market";
import { ISector } from "types/sector";

interface Props {
  portfolioId: number;
  company: ICompany | undefined;
  isUpdate?: boolean;
  isVisible: boolean;
  currencies: ICurrency[];
  sectors: ISector[];
  markets: IMarket[];
  onCloseCallback: () => void;
  onSubmitCallback: (values: ICompanyFormFields) => void;
}

function CompanyForm({
  isVisible,
  portfolioId,
  company = undefined,
  isUpdate = false,
  currencies,
  markets,
  sectors,
  onCloseCallback = () => {},
  onSubmitCallback = () => {},
}: Readonly<Props>) {
  const { t } = useTranslation();
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const getBase64 = (
    img: Blob,
    callback: (fileRead: string | ArrayBuffer | null) => void,
  ) => {
    console.log(img);
    const reader = new FileReader();
    console.log("reader result is not null");
    console.log(reader.result);
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const previews = files.map((file) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={randomId()}
        src={imageUrl}
        h={100}
        w={"auto"}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
      />
    );
  });

  const form = useForm<ICompanyFormFields>({
    mode: "uncontrolled",
    initialValues: {
      name: company ? company.name : "",
      description: company ? company.description : "",
      ticker: company ? company.ticker : "",
      altTickers: company ? company?.altTickers : "",
      broker: company ? company?.broker : "",
      logo: company ? company.logo : "",
      url: company ? company.url : "",
      sector: company ? company.sector.id.toString() : undefined,
      portfolio: portfolioId,
      baseCurrency: company ? company.baseCurrency.code : "",
      dividendsCurrency: company ? company.dividendsCurrency.code : "",
      market: company ? company.market.id.toString() : undefined,
      isClosed: company ? company.isClosed : false,
      isin: company ? company.isin : "",
      countryCode: company ? company.countryCode : "",
      color: "#2196F3",
    },
  });

  const handleImagesUpload = (uploadedFiles: FileWithPath[]) => {
    setFiles(uploadedFiles);

    getBase64(uploadedFiles[0], (base64: string | ArrayBuffer | null) => {
      if (typeof base64 === "string") {
        form.setFieldValue("logo", base64);
      }
    });
  };

  const onSubmit = (values: ICompanyFormFields) => {
    onSubmitCallback(values);
  };

  const hideModal = () => {
    form.reset();
    onCloseCallback();
  };

  const baseCurrenciesOptions = currencies?.map((currency: ICurrency) => ({
    value: currency.code,
    label: t(currency.name),
  }));

  const marketsOptions = markets?.map((market: IMarket) => ({
    value: market.id.toString(),
    label: market.name,
  }));

  const sectorsOptions = sectors?.map((sector: ISector) => ({
    value: sector.id.toString(),
    label: sector.name,
  }));

  const onCountryChange = (value: string | null) => {
    if (value) {
      form.setFieldValue("region", value);
    }
  };

  return (
    <Modal
      opened={isVisible}
      title={isUpdate ? t("Update company") : t("Add new company")}
      onClose={onCloseCallback}
      size="lg"
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Grid>
          <Grid.Col span={12}>
            <Group align="flex-end">
              <TextInput
                withAsterisk
                label={t("Ticker")}
                key={form.key("ticker")}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...form.getInputProps("ticker")}
              />
              <SearchButton form={form} />
            </Group>
          </Grid.Col>
        </Grid>
        <TextInput
          mt="md"
          withAsterisk
          label={t("Name")}
          key={form.key("name")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("name")}
        />
        <TextInput
          mt="md"
          withAsterisk
          label={t("Alternative tickers")}
          key={form.key("altTickers")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("altTickers")}
        />
        <TextInput
          mt="md"
          withAsterisk
          label={t("ISIN")}
          key={form.key("isin")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("isin")}
        />
        <Grid justify="flex-end" align="flex-end">
          <Grid.Col span={6}>
            <Input.Wrapper mt="md" label={t("Logo")}>
              <Dropzone
                mt="md"
                maxFiles={1}
                accept={IMAGE_MIME_TYPE}
                onDrop={handleImagesUpload}
              >
                <Text ta="center">{t("Drop an image or click here")}</Text>
              </Dropzone>
            </Input.Wrapper>
          </Grid.Col>

          <Grid.Col span={6}>
            {previews}
            {company?.logo && previews.length == 0 && (
              <Image src={company.logo} alt={company.name} h={100} w={"auto"} />
            )}
          </Grid.Col>
        </Grid>
        <Select
          mt="md"
          withAsterisk
          searchable
          label={t("Base currency")}
          data={baseCurrenciesOptions}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("baseCurrency")}
          required
        />
        <Select
          mt="md"
          withAsterisk
          searchable
          label={t("Dividends currency")}
          data={baseCurrenciesOptions}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("dividendsCurrency")}
          required
        />
        <Select
          mt="md"
          withAsterisk
          searchable
          label={t("Market")}
          data={marketsOptions}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("market")}
          required
        />
        <Select
          mt="md"
          withAsterisk
          searchable
          label={t("Sector")}
          data={sectorsOptions}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("sector")}
          required
        />
        <Checkbox
          mt="md"
          label={t("Is closed?")}
          key={form.key("isClosed")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("isClosed", { type: "checkbox" })}
        />

        <TextInput
          mt="md"
          withAsterisk
          label={t("Broker")}
          key={form.key("broker")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("broker")}
        />
        <TextInput
          mt="md"
          label={t("URL")}
          key={form.key("url")}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps("url")}
        />
        <CountrySelector
          onChange={onCountryChange}
          value={form.getValues().countryCode}
        />

        <Input.Wrapper mt="md" label={t("Description")}>
          <NotesField content={company?.description} form={form} />
        </Input.Wrapper>

        <Group justify="space-between" mt="md">
          <Button type="button" color="gray" onClick={hideModal}>
            {t("Cancel")}
          </Button>
          <Button type="submit" color="blue">
            {company ? t("Update") : t("Create")}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default CompanyForm;
