// pages/ads/AdEditPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Select, Space, message, Spin, Alert, Tooltip, Typography } from 'antd';
import { CheckOutlined, ReloadOutlined, EditOutlined } from '@ant-design/icons';
import { adsService } from '../../services/ads.service';
import { aiService } from '../../services/ai.service';
import type { ItemUpdateIn, Category } from '../../shared/types/ad.types';

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
  electronics: { type: 'phone', brand: '', model: '', condition: '', color: '' },
  auto: {
    brand: '',
    model: '',
    yearOfManufacture: '',
    transmission: '',
    mileage: '',
    enginePower: '',
  },
  real_estate: { type: 'flat', address: '', area: '', floor: '' },
};

// Обязательные поля для категорий
const requiredFieldsByCategory: Record<Category, string[]> = {
  electronics: ['title', 'price', 'type'],
  auto: ['title', 'price'],
  real_estate: ['title', 'price', 'type'],
};

// Компонент Label со звездочкой (только для основных полей)
const Label = ({ text, required }: { text: string; required?: boolean }) => (
  <label className="block font-family-inter mb-2 font-semibold text-[16px]">
    {required && <span className="text-red-500 mr-1">*</span>}
    {text}
  </label>
);

// Компонент для обычного текста (не жирный)
const RegularLabel = ({ text, required }: { text: string; required?: boolean }) => (
  <div className="block text-black/85 text-[14px] font-family-roboto mb-2">
    {required && <span className="text-red-500 mr-1">*</span>}
    {text}
  </div>
);

// Опции для type в зависимости от категории
const getTypeOptions = (category: Category) => {
  if (category === 'electronics') {
    return [
      { value: 'phone', label: 'Телефон' },
      { value: 'laptop', label: 'Ноутбук' },
      { value: 'misc', label: 'Другое' },
    ];
  }
  if (category === 'real_estate') {
    return [
      { value: 'flat', label: 'Квартира' },
      { value: 'house', label: 'Дом' },
      { value: 'room', label: 'Комната' },
    ];
  }
  return [];
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

        // Сохраняем существующий тип из данных
        const mergedParams = { ...defaultParams[data.category], ...data.params };

        // Если тип есть в данных, используем его
        if (data.params?.type) {
          mergedParams.type = data.params.type;
        }

        // Проверяем наличие черновика
        const draftKey = `ad_draft_${id}`;
        const savedDraft = localStorage.getItem(draftKey);

        if (savedDraft) {
          const draft = JSON.parse(savedDraft);
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
              params: mergedParams,
            });
            localStorage.removeItem(draftKey);
          }
        } else {
          setFormData({
            category: data.category,
            title: data.title,
            description: data.description || '',
            price: data.price,
            params: mergedParams,
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

  // Контент тултипа для цены (успех) - теперь всё в виде списка
  const successPriceTooltipContent = (
    <div style={{ maxWidth: 350 }}>
      <Text strong>Ответ от AI:</Text>
      <ul style={{ marginTop: 8, marginBottom: 8, paddingLeft: 20 }}>
        <li style={{ marginBottom: 4 }}>
          <Text strong>{aiPriceResponse?.title}</Text>
        </li>
        {aiPriceResponse?.suggestions.map((s, i) => (
          <li key={i} style={{ marginBottom: 4 }}>
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

    // Валидация для type (если обязательно)
    const requiredFields = requiredFieldsByCategory[formData.category];
    if (requiredFields.includes('type') && !formData.params?.type) {
      message.error('Тип обязателен для заполнения');
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

  // Проверка, является ли поле обязательным
  const isFieldRequired = (key: string): boolean => {
    return requiredFieldsByCategory[formData.category]?.includes(key);
  };

  return (
    <div className="bg-white p-8 min-h-screen max-w-[1035px] mx-auto">
      <h1 className="text-black/85 font-medium mb-[18px] text-3xl">Редактирование объявления</h1>

      {/* Категория */}
      <div className="mb-4">
        <label className="block font-family-inter mb-2 font-semibold text-[16px]">Категория</label>
        <Select
          value={formData.category}
          onChange={handleCategoryChange}
          options={categoryOptions}
          className="!w-[456px]"
        />
      </div>

      {/* Название */}
      <div className="mb-4">
        <Label text="Название" required />
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          status={!formData.title?.trim() ? 'error' : ''}
          className="!w-[456px]"
        />
        {!formData.title?.trim() && (
          <Text type="danger" className="block mt-1">
            Название обязательно для заполнения
          </Text>
        )}
      </div>

      {/* Цена с тултипом */}
      <div className="mb-4">
        <Label text="Цена" required />
        <div className="flex gap-2">
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            status={!formData.price || formData.price <= 0 ? 'error' : ''}
            required
            className="!w-[456px]"
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
        </div>
        {(!formData.price || formData.price <= 0) && (
          <Text type="danger" className="block mt-1">
            Цена должна быть больше 0
          </Text>
        )}
      </div>

      {/* Характеристики - каждое поле с новой строки и шириной 456px */}
      <div className="mb-6">
        <div className="block font-family-inter mb-2 font-semibold text-[16px]">Характеристики</div>
        <div className="flex flex-col gap-3">
          {Object.entries(formData.params).map(([key, value]) => {
            const isRequired = isFieldRequired(key);

            // SELECT: type (используем RegularLabel вместо Label)
            if (key === 'type') {
              const currentType = value || defaultParams[formData.category].type;
              return (
                <div key={key} className="mb-2">
                  <RegularLabel text={paramLabels[key] || key} required={isRequired} />
                  <Select
                    value={currentType}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        params: { ...formData.params, [key]: val },
                      })
                    }
                    options={getTypeOptions(formData.category)}
                    className="!w-[456px]"
                    status={isRequired && !value ? 'error' : ''}
                  />
                  {isRequired && !value && (
                    <Text type="danger" className="block mt-1">
                      Тип обязателен для заполнения
                    </Text>
                  )}
                </div>
              );
            }

            // SELECT: condition
            if (key === 'condition') {
              return (
                <div key={key} className="mb-2">
                  <div className="block text-black/85 text-[14px] font-family-roboto mb-2">
                    {paramLabels[key] || key}
                  </div>
                  <Select
                    value={value}
                    allowClear
                    placeholder="Выберите состояние"
                    options={[
                      { value: 'new', label: 'Новый' },
                      { value: 'used', label: 'Б/У' },
                    ]}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        params: { ...formData.params, [key]: val },
                      })
                    }
                    className="!w-[456px]"
                  />
                </div>
              );
            }

            // SELECT: transmission
            if (key === 'transmission') {
              return (
                <div key={key} className="mb-2">
                  <div className="block text-black/85 text-[14px] font-family-roboto mb-2">
                    {paramLabels[key] || key}
                  </div>
                  <Select
                    value={value}
                    allowClear
                    placeholder="Выберите коробку передач"
                    options={[
                      { value: 'automatic', label: 'Автоматическая' },
                      { value: 'manual', label: 'Механическая' },
                    ]}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        params: { ...formData.params, [key]: val },
                      })
                    }
                    className="!w-[456px]"
                  />
                </div>
              );
            }

            // обычный input
            return (
              <div key={key} className="mb-2">
                <div className="block text-black/85 text-[14px] font-family-roboto mb-2">
                  {paramLabels[key] || key}
                </div>
                <Input
                  value={value as any}
                  placeholder={`Введите ${paramLabels[key]?.toLowerCase()}`}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      params: {
                        ...formData.params,
                        [key]: e.target.value,
                      },
                    })
                  }
                  className="!w-[456px]"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Описание с тултипом */}
      <div className="mb-4">
        <Label text="Описание" />
        <div className="flex flex-col gap-2">
          <TextArea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            showCount
            maxLength={1000}
            className="!w-[600px]"
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
              style={{ width: 'fit-content' }}
            >
              {getDescButtonText()}
            </Button>
          </Tooltip>
        </div>
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
