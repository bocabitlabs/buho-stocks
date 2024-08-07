import React from "react";
import { useTranslation } from "react-i18next";
import { Select } from "@mantine/core";
import { IBenchmark } from "types/benchmark";

interface Props {
  benchmarks: IBenchmark[];
  onChangeCallback: (value: string) => void;
}

export default function BenchmarkSelect({
  benchmarks,
  onChangeCallback,
}: Props) {
  const { t } = useTranslation();

  const selectOptions = benchmarks?.map((benchmark: any) => ({
    value: benchmark.id.toString(),
    label: benchmark.name,
  }));

  const onChange = (value: string | null) => {
    if (value !== null) {
      onChangeCallback(value);
    }
  };
  return (
    <Select
      searchable
      placeholder={t<string>("Select an index")}
      onChange={onChange}
      style={{ marginTop: 20, minWidth: 200 }}
      data={selectOptions}
    />
  );
}
