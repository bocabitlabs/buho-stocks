export interface ISectorFormFields {
  name: string;
  color: string;
  superSector?: number;
  isSuperSector?: boolean;
}

export interface ISector extends ISectorFormFields {
  id: number;
  dateCreated: string;
  lastUpdated: string;
}
