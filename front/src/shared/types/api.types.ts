import { ItemWithRevision } from "./ad";

export type ItemsResponse = {
  items: ItemWithRevision[];
  total: number;
};

export type GetItemsParams = {
  q?: string;
  limit?: number;
  skip?: number;
  needsRevision?: boolean;
  categories?: string;
  sortColumn?: 'title' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
};

export type UpdateItemDto = {
  category: 'auto' | 'real_estate' | 'electronics';
  title: string;
  description?: string;
  price: number;
  params: any;
};