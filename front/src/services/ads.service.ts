// services/ads.service.ts
import { apiClient } from './client';
import type { Category, Item, ItemWithRevision } from '../shared/types/ad.types';

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
  items: ItemWithRevision[];
  total: number;
}

export type UpdateItemDto = {
  category: Category;
  title: string;
  description?: string;
  price: number;
  params: Item['params'];
};

export const adsService = {
  async getAds(params: GetAdsParams, signal?: AbortSignal): Promise<GetAdsResponse> {
    const query = { ...params, categories: params.categories?.join(',') };
    const res = await apiClient.get<GetAdsResponse>('/items', { params: query, signal });
    return res.data;
  },

  async getAdById(id: string | number, signal?: AbortSignal): Promise<ItemWithRevision> {
    // Приводим id к числу, если backend ожидает число
    const numericId = Number(id);
    if (isNaN(numericId)) throw new Error('Неверный ID объявления');

    const res = await apiClient.get<ItemWithRevision>(`/items/${numericId}`, { signal });
    
    // 🔥 Если сервер оборачивает объект в data
    // return res.data.data ?? res.data;
    return res.data;
  },

  async updateAd(id: string, data: UpdateItemDto): Promise<ItemWithRevision> {
    const res = await apiClient.put<ItemWithRevision>(`/items/${id}`, data);
    return res.data;
  },
};