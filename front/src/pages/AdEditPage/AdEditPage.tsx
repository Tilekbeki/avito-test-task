// pages/ads/AdEditPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Select, Space, message, Spin, Alert, Tooltip, Typography } from 'antd';
import { CheckOutlined, ReloadOutlined, EditOutlined } from '@ant-design/icons';
import { adsService } from '../../services/ads.service';
import { aiService } from '../../services/ai.service';
import type { ItemUpdateIn, Category } from '../../shared/types/ad.types';
import { useAdDraft } from './hooks';
import { Label, RegularLabel } from './components/Label';
import AiPriceButton from '../../components/AiPriceButton/AiPriceButton';
import AiDescriptionButton from '../../components/AiDescriptionButton';
import {
  categoryOptions,
  paramLabels,
  defaultParams,
  requiredFieldsByCategory,
  getTypeOptions,
} from './constants';

const { Text } = Typography;
const { TextArea } = Input;

const AdEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { loading, error, formData, setFormData, clearDraft } = useAdDraft(id);

  // AI состояния для цены
  const [aiPriceLoading, setAiPriceLoading] = useState(false);
  const [aiPriceFailed, setAiPriceFailed] = useState(false);
  const [priceTooltipOpen, setPriceTooltipOpen] = useState(false);
  const [aiPriceResponse, setAiPriceResponse] = useState<{
    title: string;
    suggestions: string[];
  } | null>(null);

  // AI состояния для описания
  const [aiDescLoading, setAiDescLoading] = useState(false);
  const [aiDescFailed, setAiDescFailed] = useState(false);
  const [descTooltipOpen, setDescTooltipOpen] = useState(false);
  const [aiDescResponse, setAiDescResponse] = useState<string | null>(null);

  // AI запрос для цены
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

  // AI запрос для описания
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
    if (aiPriceResponse?.suggestions[0] && formData) {
      const priceMatch = aiPriceResponse.suggestions[0].match(/(\d[\d\s]*)\s*₽/);
      if (priceMatch) {
        const price = parseInt(priceMatch[1].replace(/\s/g, ''), 10);
        if (!isNaN(price)) {
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

  // Тултип для цены (успех)
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

  // Тултип для описания (успех)
  const successDescTooltipContent = (
    <div style={{ maxWidth: 400 }}>
      <Text style={{ display: 'block', marginBottom: 12 }}>{aiDescResponse}</Text>
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

  // Тултип для ошибки
  const errorTooltipContent = (onRetry: () => void, onClose: () => void) => (
    <div style={{ maxWidth: 300 }}>
      <Text type="danger" strong>
        Произошла ошибка при запросе к AI
      </Text>
      <Text style={{ display: 'block', marginTop: 8, marginBottom: 8 }}>
        Попробуйте повторить запрос или закройте уведомление
      </Text>
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

  // Сохранение
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

    const requiredFields = requiredFieldsByCategory[formData.category];
    if (requiredFields.includes('type') && !formData.params?.type) {
      message.error('Тип обязателен для заполнения');
      return;
    }

    // Трансформация данных
    const transformedParams = { ...formData.params };

    if (formData.category === 'auto') {
      if (transformedParams.yearOfManufacture)
        transformedParams.yearOfManufacture = Number(transformedParams.yearOfManufacture);
      if (transformedParams.mileage) transformedParams.mileage = Number(transformedParams.mileage);
      if (transformedParams.enginePower)
        transformedParams.enginePower = Number(transformedParams.enginePower);
    }

    if (formData.category === 'real_estate') {
      if (transformedParams.area) transformedParams.area = Number(transformedParams.area);
      if (transformedParams.floor) transformedParams.floor = Number(transformedParams.floor);
    }

    const payload = {
      category: formData.category,
      title: formData.title.trim(),
      description: formData.description || '',
      price: Number(formData.price),
      params: transformedParams,
    };

    try {
      await adsService.updateAd(id, payload);
      clearDraft();
      message.success('✅ Изменения сохранены');
      navigate(`/ads/${id}`);
    } catch (e: any) {
      message.error('❌ Ошибка сохранения. Попробуйте ещё раз.');
    }
  };

  // Текст кнопок AI
  const getPriceButtonText = () => {
    if (aiPriceLoading) return 'Выполняется запрос';
    if (aiPriceFailed) return 'Повторить запрос';
    return 'Узнать рыночную цену';
  };

  const getDescButtonText = () => {
    if (aiDescLoading) return 'Выполняется запрос';
    if (aiDescFailed) return 'Повторить запрос';
    return formData.description ? 'Улучшить описание' : 'Придумать описание';
  };

  const isFieldRequired = (key: string): boolean => {
    return requiredFieldsByCategory[formData.category]?.includes(key);
  };

  return (
    <div className="bg-white p-8 min-h-screen max-w-[1035px] mx-auto">
      <h1 className="text-black/85 font-medium mb-[18px] text-3xl">Редактирование объявления</h1>

      {/* Категория */}
      <div className="mb-4">
        <Label text="Категория" />
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

      {/* Цена */}
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
          <AiPriceButton
            formData={formData}
            onApply={(price) => setFormData({ ...formData, price })}
          />
        </div>
        {(!formData.price || formData.price <= 0) && (
          <Text type="danger" className="block mt-1">
            Цена должна быть больше 0
          </Text>
        )}
      </div>

      {/* Характеристики */}
      <div className="mb-6">
        <Label text="Характеристики" />
        <div className="flex flex-col gap-3">
          {Object.entries(formData.params).map(([key, value]) => {
            const isRequired = isFieldRequired(key);

            if (key === 'type') {
              const currentType = value || defaultParams[formData.category].type;
              return (
                <div key={key} className="mb-2">
                  <RegularLabel text={paramLabels[key] || key} required={isRequired} />
                  <Select
                    value={currentType}
                    onChange={(val) =>
                      setFormData({ ...formData, params: { ...formData.params, [key]: val } })
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

            if (key === 'condition') {
              return (
                <div key={key} className="mb-2">
                  <RegularLabel text={paramLabels[key] || key} />
                  <Select
                    value={value}
                    allowClear
                    placeholder="Выберите состояние"
                    options={[
                      { value: 'new', label: 'Новый' },
                      { value: 'used', label: 'Б/У' },
                    ]}
                    onChange={(val) =>
                      setFormData({ ...formData, params: { ...formData.params, [key]: val } })
                    }
                    className="!w-[456px]"
                  />
                </div>
              );
            }

            if (key === 'transmission') {
              return (
                <div key={key} className="mb-2">
                  <RegularLabel text={paramLabels[key] || key} />
                  <Select
                    value={value}
                    allowClear
                    placeholder="Выберите коробку передач"
                    options={[
                      { value: 'automatic', label: 'Автоматическая' },
                      { value: 'manual', label: 'Механическая' },
                    ]}
                    onChange={(val) =>
                      setFormData({ ...formData, params: { ...formData.params, [key]: val } })
                    }
                    className="!w-[456px]"
                  />
                </div>
              );
            }

            return (
              <div key={key} className="mb-2">
                <RegularLabel text={paramLabels[key] || key} />
                <Input
                  value={value as string}
                  placeholder={`Введите ${paramLabels[key]?.toLowerCase()}`}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      params: { ...formData.params, [key]: e.target.value },
                    })
                  }
                  className="!w-[456px]"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Описание */}
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
          <AiDescriptionButton
            formData={formData}
            onApply={(desc) => setFormData({ ...formData, description: desc })}
          />
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
