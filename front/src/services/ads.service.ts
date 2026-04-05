import { apiClient } from './client';
import type { GetAdsParams, GetAdsResponse, ItemUpdateIn, ItemWithRevision } from '../shared/types/ad.types';

// Экспортируем типы для совместимости
export type { GetAdsParams, GetAdsResponse, ItemUpdateIn };

// Алиас для UpdateItemDto (используем ItemUpdateIn)
export type UpdateItemDto = ItemUpdateIn;

export const adsService = {
  async getAds(params: GetAdsParams, signal?: AbortSignal): Promise<GetAdsResponse> {
    const query = { ...params, categories: params.categories?.join(',') };
    const res = await apiClient.get<GetAdsResponse>('/items', { params: query, signal });
    return res.data;
  },

  async getAdById(id: string | number, signal?: AbortSignal): Promise<ItemWithRevision> {

    const numericId = Number(id);
    if (isNaN(numericId)) throw new Error('Неверный ID объявления');

    const res = await apiClient.get<ItemWithRevision>(`/items/${numericId}`, { signal });
    

    return res.data;
  },

  async updateAd(id: string, data: UpdateItemDto): Promise<ItemWithRevision> {
    const res = await apiClient.put<ItemWithRevision>(`/items/${id}`, data);
    return res.data;
  },
};