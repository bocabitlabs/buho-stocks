export interface IBenchmarkFormFields {
  name: string;
}

export interface IBenchmarkYearFormFields {
  year: number;
  returnPercentage: string;
  value: string;
  valueCurrency: string;
  benchmark: number;
}

export interface IBenchmarkYear extends IBenchmarkYearFormFields {
  id: number;
  dateCreated: string;
  lastUpdated: string;
}

export interface IBenchmarkItem extends IBenchmarkFormFields {
  dateCreated: string;
  lastUpdated: string;
  id: number;
}

export interface IBenchmark extends IBenchmarkFormFields {
  dateCreated: string;
  lastUpdated: string;
  id: number;
  years: IBenchmarkYear[];
}
