import { useTranslation } from "react-i18next";
import { Select } from "@mantine/core";

interface Props {
  onYearChange: (year: any) => void;
  years: number[];
}

export default function YearSelector({ years, onYearChange }: Props) {
  const { t } = useTranslation();

  const yearsOptions = years?.map((yearItem: any) => ({
    value: yearItem.toString(),
    label: yearItem.toString(),
  }));

  yearsOptions?.unshift({ value: "all", label: t("All") });

  return (
    <Select
      label={t("Year")}
      style={{ width: 120 }}
      onChange={onYearChange}
      data={yearsOptions}
      defaultValue="all"
    />
  );
}
