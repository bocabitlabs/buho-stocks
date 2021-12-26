import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "antd";
import countries from "utils/countries";
import FlagIcon from "utils/flag-icon";

interface Props {
  handleChange: any;
  initialValue?: string;
}

export default function CountrySelector({
  handleChange,
  initialValue
}: Props): ReactElement {
  const { t } = useTranslation();

  const getLabel = (element: any) => (
    <div className="demo-option-label-item">
      <span
        role="img"
        aria-label={element.name}
        style={{ paddingRight: "1em" }}
      >
        <FlagIcon code={element.code} size="lg" />
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
    >
      {JSON.stringify(initialValue)}
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
  initialValue: ""
};
