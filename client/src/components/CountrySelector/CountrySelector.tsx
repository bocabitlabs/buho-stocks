import { useTranslation } from "react-i18next";
import { Group, Select, SelectProps } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import CountryFlag from "components/CountryFlag/CountryFlag";
import countries from "utils/countries";

interface Props {
  fieldName?: string;
  value: string;
  onChange: (value: string | null) => void;
}

export default function CountrySelector({
  fieldName = "countryCode",
  value,
  onChange,
}: Readonly<Props>) {
  const { t } = useTranslation();

  const countriesOptions = countries?.map((country) => ({
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
      {checked && <IconCheck style={{ marginInlineStart: "auto" }} />}
    </Group>
  );

  return (
    <Select
      mt="md"
      withAsterisk
      searchable
      label={t("Country")}
      data={countriesOptions}
      id={fieldName}
      name={fieldName}
      value={value}
      onChange={onChange}
      required
      renderOption={renderSelectOption}
      data-testid="country-selector"
    />
  );
}
