import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  Alert,
  Button,
  Center,
  Grid,
  Loader,
  Modal,
  Text,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useCompanySearch } from "hooks/use-companies/use-companies-search";

type Props = {
  form: any;
};

export default function SearchButton({ form }: Props) {
  const { t } = useTranslation();

  const [
    companySearchOpened,
    { open: openCompanySearch, close: closeCompanySearch },
  ] = useDisclosure(false);

  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);
  const [debouncedSearch] = useDebouncedValue(searchValue, 300);

  const { data: searchData, isLoading } = useCompanySearch(debouncedSearch);

  return (
    <>
      <Button
        type="button"
        color="blue"
        onClick={() => {
          setSearchValue(form.getValues().ticker);
          openCompanySearch();
        }}
        loading={isLoading}
      >
        {t("Search company")}
      </Button>
      <Modal
        opened={companySearchOpened}
        onClose={closeCompanySearch}
        title={t("Company Search")}
      >
        <Text>
          {t("Do you want to set the company values from the search results?")}
        </Text>

        {isLoading && (
          <Center mt="md">
            <Loader />
          </Center>
        )}

        {!searchData && !isLoading && (
          <Alert mt={"md"} title={t("No results found")} color="yellow">
            {t("No search results for company")} {form.getValues().ticker}
          </Alert>
        )}

        {searchData?.shortName && (
          <Grid grow mt="md">
            <Grid.Col span={8}>
              <Text fw={700}>{t("Company name")}:</Text>
              <Text size="xs">
                {form.getValues().name} → {searchData?.shortName}
              </Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Button
                size="xs"
                variant="default"
                onClick={() =>
                  form.setFieldValue("name", searchData?.shortName)
                }
              >
                {t("Set field")}
              </Button>
            </Grid.Col>
          </Grid>
        )}
        {searchData?.exchange && (
          <Grid grow mt="md">
            <Grid.Col span={8}>
              <Text fw={700}>{t("Market")}:</Text>
              <Text size="xs">{searchData?.exchange}</Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Button
                size="xs"
                variant="default"
                disabled
                onClick={() =>
                  form.setFieldValue("market", searchData?.exchange)
                }
              >
                {t("Set field")}
              </Button>
            </Grid.Col>
          </Grid>
        )}
        {searchData?.financialCurrency && (
          <Grid grow mt="md">
            <Grid.Col span={8}>
              <Text fw={700}>{t("Currency")}:</Text>
              <Text size="xs">{searchData?.financialCurrency}</Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Button
                size="xs"
                variant="default"
                disabled
                onClick={() => {
                  form.setFieldValue(
                    "baseCurrency",
                    searchData?.financialCurrency,
                  );
                  form.setFieldValue(
                    "dividendsCurrency",
                    searchData?.financialCurrency,
                  );
                }}
              >
                {t("Set field")}
              </Button>
            </Grid.Col>
          </Grid>
        )}
        {searchData?.sectorDisp && (
          <Grid grow mt="md">
            <Grid.Col span={8}>
              <Text fw={700}>{t("Sector")}:</Text>
              <Text size="xs">{searchData?.sectorDisp}</Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Button
                size="xs"
                variant="default"
                disabled
                onClick={() =>
                  form.setFieldValue("sector", searchData?.sectorDisp)
                }
              >
                {t("Set field")}
              </Button>
            </Grid.Col>
          </Grid>
        )}
        {searchData?.irWebsite && (
          <Grid grow mt="md">
            <Grid.Col span={8}>
              <Text fw={700}>{t("URL")}:</Text>
              <Text size="xs">
                {form.getValues().url} → {searchData?.irWebsite}
              </Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Button
                size="xs"
                variant="default"
                onClick={() => form.setFieldValue("url", searchData?.irWebsite)}
              >
                {t("Set field")}
              </Button>
            </Grid.Col>
          </Grid>
        )}
        {searchData?.isin && (
          <Grid grow mt="md">
            <Grid.Col span={8}>
              <Text fw={700}>{t("ISIN")}:</Text>
              <Text size="xs">
                {form.getValues().isin} → {searchData?.isin}
              </Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Button
                size="xs"
                variant="default"
                onClick={() => form.setFieldValue("isin", searchData?.isin)}
              >
                {t("Set field")}
              </Button>
            </Grid.Col>
          </Grid>
        )}
        {searchData?.longBusinessSummary && (
          <Grid grow mt="md">
            <Grid.Col span={8}>
              <Text fw={700}>{t("Description")}:</Text>

              <Accordion defaultValue="">
                <Accordion.Item key={"description"} value={"description"}>
                  <Accordion.Control>
                    <Text size="xs">{t("Show old description")}</Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text size="xs">{form.getValues().description}</Text>
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item
                  key={"new-description"}
                  value={"new-description"}
                >
                  <Accordion.Control>
                    <Text size="xs">{t("Show new description")}</Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text size="xs">{searchData?.longBusinessSummary}</Text>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Grid.Col>
            <Grid.Col span={4}>
              <Button
                size="xs"
                variant="default"
                onClick={() =>
                  form.setFieldValue(
                    "description",
                    searchData?.longBusinessSummary,
                  )
                }
              >
                {t("Set field")}
              </Button>
            </Grid.Col>
          </Grid>
        )}
      </Modal>
    </>
  );
}
