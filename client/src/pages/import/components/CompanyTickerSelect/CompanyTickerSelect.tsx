import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Combobox, Input, InputBase, useCombobox } from "@mantine/core";
import { ICompany } from "types/company";

interface Props {
  companies: ICompany[];
  initialValue: ICompany | undefined;
  onSelect: (company: any) => void;
  withAsterisk?: boolean;
  description?: string;
}

export default function CompanyTickerSelect({
  companies,
  initialValue,
  onSelect,
  withAsterisk = false,
  description = undefined,
}: Props) {
  const { t } = useTranslation();
  const [value, setValue] = useState<ICompany | undefined>(initialValue);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: (eventSource) => {
      if (eventSource === "keyboard") {
        combobox.selectActiveOption();
      } else {
        combobox.updateSelectedOptionIndex("active");
      }
    },
  });

  const options = companies.map((item) => (
    <Combobox.Option
      value={item.id.toString()}
      key={item.id.toString()}
      active={item.id.toString() === value?.id.toString()}
    >
      {item.name} ({item.ticker})
    </Combobox.Option>
  ));

  const onValueChange = useCallback(
    (selectedVal: string) => {
      console.log("onValueChange", selectedVal);
      const selectedCompany = companies.find(
        (company) => company.id.toString() === selectedVal,
      );
      setValue(selectedCompany);
    },
    [companies],
  );

  return (
    <Combobox
      store={combobox}
      resetSelectionOnOptionHover
      withinPortal={false}
      onOptionSubmit={(val) => {
        console.log(val);
        onValueChange(val);
        combobox.updateSelectedOptionIndex("active");
        combobox.closeDropdown();
        onSelect(val);
      }}
    >
      <Combobox.Target targetType="button">
        <InputBase
          component="button"
          type="button"
          pointer
          label={t<string>("Company")}
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
          withAsterisk={withAsterisk}
          description={description}
        >
          {value ? (
            `${value.name} (${value.ticker})`
          ) : (
            <Input.Placeholder>{t("Pick a company")}</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
    // <Combobox
    //   store={combobox}
    //   label={t<string>("Company")}
    //   placeholder={t<string>("Company")}
    //   onChange={handleChange}
    //   defaultValue={initialValue}
    //   data={selectOptions}
    //   required={withAsterisk}
    //   data-testid="company-selector"
    //   key={form.key("company")}
    //   // eslint-disable-next-line react/jsx-props-no-spreading
    //   {...form.getInputProps("company")}
    // />
  );
}
