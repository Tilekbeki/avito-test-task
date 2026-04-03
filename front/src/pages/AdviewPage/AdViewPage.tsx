import { Alert, Button, Spin, Tag } from 'antd';
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import img from '../../assets/cover-big.png';
import { adsService } from '../../services/ads.service';
import type { ItemWithRevision } from '../../shared/types/ad.types';
import axios from 'axios';

// Мета-лейблы для параметров
const paramLabels: Record<string, string> = {
  brand: 'Бренд',
  model: 'Модель',
  yearOfManufacture: 'Год выпуска',
  transmission: 'Коробка передач',
  mileage: 'Пробег (км)',
  enginePower: 'Мощность двигателя (л.с.)',
  type: 'Тип',
  condition: 'Состояние',
  color: 'Цвет',
  address: 'Адрес',
  area: 'Площадь (м²)',
  floor: 'Этаж',
};

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
  const navigate = useNavigate();
  const [ad, setAd] = useState<ItemWithRevision | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка объявления
  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    const fetchAd = async () => {
      try {
        setLoading(true);
        const data = await adsService.getAdById(id, controller.signal);
        setAd(data);
      } catch (e: any) {
        if (axios.isCancel(e) || e.message === 'canceled') return;
        setError(e.message || 'Ошибка при загрузке объявления');
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
    return () => controller.abort();
  }, [id]);

  if (loading)
    return <Spin tip="Загрузка..." className="min-h-screen flex justify-center items-center" />;
  if (error) return <Alert type="error" message={error} className="m-6" />;
  if (!ad) return <Alert type="info" message="Объявление не найдено" className="m-6" />;

  // Недостающие поля
  const missingFields = Object.entries(ad.params || {})
    .filter(([_, value]) => value === undefined || value === '')
    .map(([key]) => paramLabels[key] || key);

  // Если нет описания, добавляем его в список недостающих полей
  if (!ad.description?.trim()) {
    missingFields.push('Описание');
  }

  return (
    <div className="bg-white min-h-screen p-6">
      {/* Кнопка назад */}
      <div className="mb-4">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/ads')}>
          Назад к списку
        </Button>
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-start mb-3">
        <h1 className="text-[32px] font-medium">{ad.title}</h1>
        <div className="text-[24px] font-semibold text-red-500">{ad.price.toLocaleString()} ₽</div>
      </div>

      {/* ACTIONS & DATES */}
      <div className="flex justify-between mb-8 items-center">
        {/* ✅ Кнопка-ссылка на редактирование */}
        <Link to={`/ads/${id}/edit`}>
          <Button type="primary" icon={<EditOutlined />}>
            Редактировать
          </Button>
        </Link>
        <div className="text-[#848388] flex flex-col text-right text-[16px]">
          <div>Опубликовано: {formatDate(ad.createdAt)}</div>
          <div>Обновлено: {formatDate(ad.updatedAt)}</div>
        </div>
      </div>

      <hr className="mb-8" />

      {/* MAIN CONTENT */}
      <div className="flex gap-8 mb-8">
        <div className="w-[480px] h-[360px] flex-shrink-0">
          <img src={img} alt="товар" className="w-full h-full object-cover rounded" />
        </div>

        <div className="flex flex-col gap-6 w-full">
          {/* Блок "Требуются доработки" */}
          {(ad.needsRevision || missingFields.length > 0) && (
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

          {/* Характеристики */}
          <div>
            <div className="font-medium mb-2 text-lg">Характеристики</div>
            {ad.params && Object.keys(ad.params).length > 0 ? (
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                {Object.entries(ad.params).map(([key, value]) => (
                  <div key={key} className="flex gap-3">
                    <div className="w-[180px] text-gray-500">{paramLabels[key] || key}</div>
                    <div className="font-medium">
                      {value !== undefined && value !== '' ? String(value) : '—'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400">Нет характеристик</div>
            )}
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="w-full max-w-[600px]">
        <div className="font-medium mb-2 text-lg">Описание</div>
        <div className="text-gray-700 leading-relaxed">
          {ad.description?.trim() ? (
            ad.description
          ) : (
            <span className="text-gray-400">
              Описание отсутствует. Добавьте описание, чтобы повысить отклик.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdViewPage;
