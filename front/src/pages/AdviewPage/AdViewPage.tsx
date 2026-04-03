import { Alert, Button, Spin } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import img from '../../assets/cover-big.png';
import { adsService } from '../../services/ads.service';
import type { ItemWithRevision } from '../../shared/types/ad.types';
import axios from 'axios';

// 🔥 нормальные названия
const paramLabels: Record<string, string> = {
  brand: 'Бренд',
  model: 'Модель',
  yearOfManufacture: 'Год выпуска',
  transmission: 'Коробка передач',
  mileage: 'Пробег',
  enginePower: 'Мощность двигателя',
  type: 'Тип',
  condition: 'Состояние',
  color: 'Цвет',
  address: 'Адрес',
  area: 'Площадь',
  floor: 'Этаж',
};

// 🔥 формат даты
const formatDate = (date?: string) => {
  if (!date) return '—';

  return new Date(date).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const AdViewPage = () => {
  const { id } = useParams();
  const [ad, setAd] = useState<ItemWithRevision | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchAd = async () => {
      try {
        setLoading(true);
        const data = await adsService.getAdById(id, controller.signal);
        setAd(data);
      } catch (e: any) {
        // ❗ игнорируем canceled
        if (axios.isCancel(e) || e.message === 'canceled') return;

        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();

    return () => controller.abort();
  }, [id]);

  if (loading) return <Spin />;
  if (error) return <Alert type="error" message={error} />;
  if (!ad) return null;

  // 🔥 ищем пустые поля
  const missingFields = Object.entries(ad.params || {})
    .filter(([_, value]) => value === undefined || value === '')
    .map(([key]) => paramLabels[key] || key);

  return (
    <div className="bg-white min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between font-medium text-[40px] mb-3">
        <h1>{ad.title}</h1>
        <div>{ad.price.toLocaleString()} ₽</div>
      </div>

      <div className="flex justify-between mb-8">
        <Button type="primary" icon={<EditOutlined />}>
          Редактировать
        </Button>

        <div className="text-[#848388] flex flex-col text-right text-[16px]">
          <div>Опубликовано: {formatDate(ad.createdAt)}</div>
          <div>Обновлено: {formatDate(ad.updatedAt)}</div>
        </div>
      </div>

      <hr className="mb-8" />

      <div className="flex gap-8 mb-8">
        <div className="w-[480px] h-[360px]">
          <img src={img} alt="товар" className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col gap-6">
          {/* WARNING */}
          {ad.needsRevision && (
            <Alert
              message="Требуются доработки"
              description={
                missingFields.length > 0
                  ? `Не заполнены поля: ${missingFields.join(', ')}`
                  : 'Описание отсутствует'
              }
              type="warning"
              showIcon
            />
          )}

          {/* PARAMS */}
          <div>
            <div className="font-medium mb-2">Характеристики</div>

            {Object.entries(ad.params || {}).map(([key, value]) => (
              <div key={key} className="flex gap-3 mb-1">
                <div className="w-[180px] text-gray-500">{paramLabels[key] || key}</div>
                <div>{value !== undefined && value !== '' ? String(value) : '—'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="w-[480px] flex flex-col gap-4">
        <div className="font-medium">Описание</div>
        <div>
          {ad.description?.trim()
            ? ad.description
            : 'Описание отсутствует. Добавьте описание, чтобы повысить отклик.'}
        </div>
      </div>
    </div>
  );
};

export default AdViewPage;
