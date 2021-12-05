export interface ISectorBase {
  name: string;
  color: string;
  isSuperSector?: boolean;
}

export interface ISectorFormFields extends ISectorBase {
  superSector?: number;
}

export interface ISector extends ISectorBase {
  id: number;
  superSector?: ISector;
  dateCreated: string;
  lastUpdated: string;
}
