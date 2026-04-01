import type { Category } from "./ad.types";

export type FiltersState = {
  search: string;
  categories: Category[];
  needsRevision: boolean;
  sortColumn: 'title' | 'createdAt';
  sortDirection: 'asc' | 'desc';
  page: number;
};