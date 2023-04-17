import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "antd";
import CountryFlag from "components/CountryFlag/CountryFlag";
import countries from "utils/countries";

interface Props {
  handleChange: any;
  initialValue?: string;
}

export default function CountrySelector({
  handleChange,
  initialValue,
}: Props): ReactElement {
  const { t } = useTranslation();

  const getLabel = (element: any) => (
    <div className="demo-option-label-item">
      <span
        role="img"
        aria-label={element.name}
        style={{ paddingRight: "1em" }}
      >
        <CountryFlag code={element.code} />
      </span>
      {element.name}
    </div>
  );
  return (
    <Select
      placeholder={t("Select a country")}
      style={{ width: "100%" }}
      onChange={handleChange}
      optionLabelProp="label"
      value={initialValue}
      defaultValue={initialValue}
      data-testid="country-selector"
    >
      {Object.keys(countries).map((key: string) => {
        const element = countries[key];
        return (
          <Select.Option
            key={element.key}
            value={element.code}
            label={getLabel(element)}
          >
            {getLabel(element)}
          </Select.Option>
        );
      })}
    </Select>
  );
}

CountrySelector.defaultProps = {
  initialValue: "",
};
