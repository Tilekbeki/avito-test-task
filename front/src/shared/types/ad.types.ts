export type Category = 'auto' | 'real_estate' | 'electronics';

export interface Ad {
  id: string;
  category: Category;
  title: string;
  price: number;
  description?: string;
  needsRevision: boolean;
}

export type AutoParams = {
  brand?: string;
  model?: string;
  yearOfManufacture?: number;
  transmission?: 'automatic' | 'manual';
  mileage?: number;
  enginePower?: number;
};

export type RealEstateParams = {
  type?: 'flat' | 'house' | 'room';
  address?: string;
  area?: number;
  floor?: number;
};

export type ElectronicsParams = {
  type?: 'phone' | 'laptop' | 'misc';
  brand?: string;
  model?: string;
  condition?: 'new' | 'used';
  color?: string;
};

export type ItemParams =
  | AutoParams
  | RealEstateParams
  | ElectronicsParams;

export type Item = {
  id: string;
  category: Category;
  title: string;
  description?: string;
  price: number;
  createdAt?: string;
  params: ItemParams;
};

export type ItemWithRevision = Item & {
  needsRevision: boolean;
};


export interface GetAdsParams {
  q?: string;
  limit?: number;
  skip?: number;
  needsRevision?: boolean;
  categories?: Category[];
  sortColumn?: 'title' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}

export interface GetAdsResponse {
  items: Ad[];
  total: number;
}