export interface ISectorBase {
  name: string;
  isSuperSector?: boolean;
}

export interface ISectorFormFields extends ISectorBase {
  superSector?: number | string;
}

export interface ISector extends ISectorBase {
  id: number;
  superSector?: ISector;
  dateCreated: string;
  lastUpdated: string;
}
