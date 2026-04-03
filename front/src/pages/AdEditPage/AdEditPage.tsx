// pages/ads/AdEditPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Select, Space, message, Spin, Alert, Tooltip, Typography } from 'antd';
import { CheckOutlined, ReloadOutlined, EditOutlined } from '@ant-design/icons';
import { adsService } from '../../services/ads.service';
import { aiService } from '../../services/ai.service';
import type { ItemWithRevision, ItemUpdateIn } from '../../shared/types/ad.types';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

const categoryOptions = [
  { value: 'electronics', label: 'Электроника' },
  { value: 'auto', label: 'Авто' },
  { value: 'real_estate', label: 'Недвижимость' },
];

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

const defaultParams = {
  electronics: { type: '', brand: '', model: '', condition: '', color: '' },
  auto: {
    brand: '',
    model: '',
    yearOfManufacture: '',
    transmission: '',
    mileage: '',
    enginePower: '',
  },
  real_estate: { type: '', address: '', area: '', floor: '' },
};

const AdEditPage = () => {
  // Состояния для AI цены
  const [aiPriceLoading, setAiPriceLoading] = useState(false);
  const [aiPriceFailed, setAiPriceFailed] = useState(false);
  const [priceTooltipOpen, setPriceTooltipOpen] = useState(false);
  const [aiPriceResponse, setAiPriceResponse] = useState<{
    title: string;
    suggestions: string[];
  } | null>(null);

  // Состояния для AI описания
  const [aiDescLoading, setAiDescLoading] = useState(false);
  const [aiDescFailed, setAiDescFailed] = useState(false);
  const [descTooltipOpen, setDescTooltipOpen] = useState(false);
  const [aiDescResponse, setAiDescResponse] = useState<string | null>(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ItemUpdateIn | null>(null);

  // 🔥 Загрузка черновика из localStorage
  useEffect(() => {
    if (!id) return;

    const loadDraft = async () => {
      try {
        setLoading(true);
        const data = await adsService.getAdById(id);

        // Проверяем наличие черновика
        const draftKey = `ad_draft_${id}`;
        const savedDraft = localStorage.getItem(draftKey);

        if (savedDraft) {
          const draft = JSON.parse(savedDraft);
          // Спрашиваем пользователя о восстановлении черновика
          const shouldRestore = window.confirm('Найден несохраненный черновик. Восстановить?');
          if (shouldRestore) {
            setFormData(draft);
            message.info('Черновик восстановлен');
          } else {
            setFormData({
              category: data.category,
              title: data.title,
              description: data.description || '',
              price: data.price,
              params: { ...defaultParams[data.category], ...data.params },
            });
            localStorage.removeItem(draftKey);
          }
        } else {
          setFormData({
            category: data.category,
            title: data.title,
            description: data.description || '',
            price: data.price,
            params: { ...defaultParams[data.category], ...data.params },
          });
        }
      } catch (e: any) {
        setError(e.message || 'Ошибка при загрузке объявления');
      } finally {
        setLoading(false);
      }
    };

    loadDraft();
  }, [id]);

  // 🔥 Сохраняем черновик в localStorage при изменениях
  useEffect(() => {
    if (formData && id) {
      const draftKey = `ad_draft_${id}`;
      localStorage.setItem(draftKey, JSON.stringify(formData));
    }
  }, [formData, id]);

  // Обработчик AI запроса для цены
  const handleAiPriceClick = async () => {
    if (!formData) return;

    setAiPriceLoading(true);
    setAiPriceFailed(false);
    setPriceTooltipOpen(true);

    try {
      const response = await aiService.getMarketPrice(formData.title, formData.params);
      setAiPriceResponse(response);
      setAiPriceFailed(false);
    } catch (e) {
      setAiPriceFailed(true);
      setAiPriceResponse(null);
    } finally {
      setAiPriceLoading(false);
    }
  };

  // Обработчик AI запроса для описания
  const handleAiDescClick = async () => {
    if (!formData) return;

    setAiDescLoading(true);
    setAiDescFailed(false);
    setDescTooltipOpen(true);

    try {
      const response = await aiService.generateDescription(
        formData.title,
        formData.params,
        formData.description
      );
      setAiDescResponse(response);
      setAiDescFailed(false);
    } catch (e) {
      setAiDescFailed(true);
      setAiDescResponse(null);
    } finally {
      setAiDescLoading(false);
    }
  };

  // Применить цену
  const handleApplyPrice = () => {
    if (aiPriceResponse?.suggestions[0]) {
      const priceMatch = aiPriceResponse.suggestions[0].match(/(\d[\d\s]*)\s*₽/);
      if (priceMatch) {
        const price = parseInt(priceMatch[1].replace(/\s/g, ''), 10);
        if (!isNaN(price) && formData) {
          setFormData({ ...formData, price });
          message.success('Цена применена');
          setPriceTooltipOpen(false);
        }
      }
    }
  };

  // Применить описание
  const handleApplyDescription = () => {
    if (aiDescResponse && formData) {
      setFormData({ ...formData, description: aiDescResponse });
      message.success('Описание применено');
      setDescTooltipOpen(false);
    }
  };

  // Контент тултипа для цены (успех)
  const successPriceTooltipContent = (
    <div style={{ maxWidth: 350 }}>
      <Text strong>{aiPriceResponse?.title}</Text>
      <ul style={{ marginTop: 8, marginBottom: 8, paddingLeft: 20 }}>
        {aiPriceResponse?.suggestions.map((s, i) => (
          <li key={i}>
            <Text>{s}</Text>
          </li>
        ))}
      </ul>
      <Space style={{ marginTop: 12 }}>
        <Button size="small" type="primary" onClick={handleApplyPrice}>
          Применить
        </Button>
        <Button size="small" onClick={() => setPriceTooltipOpen(false)}>
          Закрыть
        </Button>
      </Space>
    </div>
  );

  // Контент тултипа для описания (успех)
  const successDescTooltipContent = (
    <div style={{ maxWidth: 400 }}>
      <Paragraph style={{ marginBottom: 12 }}>{aiDescResponse}</Paragraph>
      <Space>
        <Button size="small" type="primary" onClick={handleApplyDescription}>
          Применить
        </Button>
        <Button size="small" onClick={() => setDescTooltipOpen(false)}>
          Закрыть
        </Button>
      </Space>
    </div>
  );

  // Контент тултипа для ошибки (общий)
  const errorTooltipContent = (onRetry: () => void, onClose: () => void) => (
    <div style={{ maxWidth: 300 }}>
      <Text type="danger" strong>
        Произошла ошибка при запросе к AI
      </Text>
      <Paragraph style={{ marginTop: 8, marginBottom: 8 }}>
        Попробуйте повторить запрос или закройте уведомление
      </Paragraph>
      <Space style={{ marginTop: 8 }}>
        <Button size="small" onClick={onRetry}>
          Повторить запрос
        </Button>
        <Button size="small" onClick={onClose}>
          Закрыть
        </Button>
      </Space>
    </div>
  );

  if (loading || !formData) return <Spin tip="Загрузка..." className="mt-20" />;
  if (error) return <Alert type="error" message={error} />;

  // Смена категории
  const handleCategoryChange = (category: ItemUpdateIn['category']) => {
    setFormData({
      ...formData,
      category,
      params: { ...defaultParams[category] },
    });
  };

  // 🔥 СОХРАНЕНИЕ - правильная передача данных
  // Сохранение - преобразуем типы правильно
  const handleSave = async () => {
    if (!formData || !id) return;

    // Валидация
    if (!formData.title?.trim()) {
      message.error('Название обязательно для заполнения');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      message.error('Цена должна быть больше 0');
      return;
    }

    // 🔥 ФОРМИРУЕМ ПРАВИЛЬНЫЙ PAYLOAD с преобразованием типов
    const transformedParams = { ...formData.params };

    // Преобразуем числовые поля для авто
    if (formData.category === 'auto') {
      if (transformedParams.yearOfManufacture) {
        transformedParams.yearOfManufacture = Number(transformedParams.yearOfManufacture);
      }
      if (transformedParams.mileage) {
        transformedParams.mileage = Number(transformedParams.mileage);
      }
      if (transformedParams.enginePower) {
        transformedParams.enginePower = Number(transformedParams.enginePower);
      }
    }

    // Преобразуем числовые поля для недвижимости
    if (formData.category === 'real_estate') {
      if (transformedParams.area) {
        transformedParams.area = Number(transformedParams.area);
      }
      if (transformedParams.floor) {
        transformedParams.floor = Number(transformedParams.floor);
      }
    }

    const payload = {
      category: formData.category,
      title: formData.title.trim(),
      description: formData.description || '',
      price: Number(formData.price),
      params: transformedParams,
    };

    console.log('Saving payload:', JSON.stringify(payload, null, 2));

    try {
      await adsService.updateAd(id, payload);
      localStorage.removeItem(`ad_draft_${id}`);
      message.success('✅ Изменения сохранены');
      navigate(`/ads/${id}`);
    } catch (e: any) {
      console.error('Save error:', e);
      message.error(
        '❌ Ошибка сохранения. При попытке сохранить изменения произошла ошибка. Попробуйте ещё раз или зайдите позже.'
      );
    }
  };

  // Определяем текст кнопки для цены
  const getPriceButtonText = () => {
    if (aiPriceLoading) return 'Выполняется запрос';
    if (aiPriceFailed) return 'Повторить запрос';
    return 'Узнать рыночную цену';
  };

  // Определяем текст кнопки для описания
  const getDescButtonText = () => {
    if (aiDescLoading) return 'Выполняется запрос';
    if (aiDescFailed) return 'Повторить запрос';
    return formData.description ? 'Улучшить описание' : 'Придумать описание';
  };

  return (
    <div className="bg-white p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Редактирование объявления</h1>

      {/* Категория */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Категория</label>
        <Select
          value={formData.category}
          onChange={handleCategoryChange}
          options={categoryOptions}
        />
      </div>

      {/* Название */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Название</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          status={!formData.title?.trim() ? 'error' : ''}
        />
      </div>

      {/* Цена с тултипом */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Цена</label>
        <Space>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            prefix="₽"
            style={{ width: 180 }}
            status={!formData.price || formData.price <= 0 ? 'error' : ''}
          />

          <Tooltip
            open={priceTooltipOpen}
            onOpenChange={setPriceTooltipOpen}
            title={
              aiPriceFailed
                ? errorTooltipContent(handleAiPriceClick, () => setPriceTooltipOpen(false))
                : successPriceTooltipContent
            }
            trigger="click"
            placement="bottomLeft"
            color="white"
            overlayInnerStyle={{
              color: '#000',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: '1px solid #e5e7eb',
            }}
          >
            <Button
              type="default"
              onClick={handleAiPriceClick}
              loading={aiPriceLoading}
              icon={aiPriceFailed && !aiPriceLoading ? <ReloadOutlined /> : undefined}
            >
              {getPriceButtonText()}
            </Button>
          </Tooltip>
        </Space>
      </div>

      {/* Описание с тултипом */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Описание</label>
        <Space direction="vertical" style={{ width: '100%' }}>
          <TextArea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            showCount
            maxLength={1000}
          />
          <Tooltip
            open={descTooltipOpen}
            onOpenChange={setDescTooltipOpen}
            title={
              aiDescFailed
                ? errorTooltipContent(handleAiDescClick, () => setDescTooltipOpen(false))
                : successDescTooltipContent
            }
            trigger="click"
            placement="bottomLeft"
            color="white"
            overlayInnerStyle={{
              color: '#000',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: '1px solid #e5e7eb',
            }}
          >
            <Button
              type="default"
              onClick={handleAiDescClick}
              loading={aiDescLoading}
              icon={aiDescFailed && !aiDescLoading ? <ReloadOutlined /> : <EditOutlined />}
            >
              {getDescButtonText()}
            </Button>
          </Tooltip>
        </Space>
      </div>

      {/* Характеристики */}
      <div className="mb-6">
        <div className="font-semibold mb-2">Характеристики</div>
        {Object.entries(formData.params).map(([key, value]) => (
          <div key={key} className="flex gap-4 items-center mb-2">
            <div className="w-[180px] text-gray-500">{paramLabels[key] || key}</div>
            <Input
              value={value as any}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  params: { ...formData.params, [key]: e.target.value },
                })
              }
            />
          </div>
        ))}
      </div>

      <Space>
        <Button type="primary" icon={<CheckOutlined />} onClick={handleSave}>
          Сохранить изменения
        </Button>
        <Button onClick={() => navigate(`/ads/${id}`)}>Отмена</Button>
      </Space>
    </div>
  );
};

export default AdEditPage;
