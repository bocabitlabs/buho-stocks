import { useTranslation } from "react-i18next";
import { Group, Select, SelectProps } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import CountryFlag from "components/CountryFlag/CountryFlag";
import countries from "utils/countries";

interface Props {
  form: any;
  fieldName?: string;
}

export default function CountrySelector({
  form,
  fieldName = "countryCode",
}: Readonly<Props>) {
  const { t } = useTranslation();

  const countriesOptions = countries?.map((country: any) => ({
    value: country.code,
    label: t(country.name),
  }));

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => (
    <Group flex="1" gap="xs">
      <CountryFlag code={option.value} width={15} />
      {option.label}
      {checked && (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <IconCheck style={{ marginInlineStart: "auto" }} />
      )}
    </Group>
  );

  return (
    <Select
      mt="md"
      withAsterisk
      searchable
      label={t("Country")}
      data={countriesOptions}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...form.getInputProps(fieldName)}
      required
      renderOption={renderSelectOption}
    />
  );
}
