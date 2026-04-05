// components/AdForm.tsx (обновленная версия с валидацией)
import { Input, Button, Select, Space, Typography } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import type { ItemUpdateIn, Category } from '../../shared/types/ad.types';
import { Label, RegularLabel } from '../../components/Label/';
import AiPriceButton from '../../components/AiPriceButton/AiPriceButton';
import AiDescriptionButton from '../../components/AiDescriptionButton';
import {
  categoryOptions,
  paramLabels,
  defaultParams,
  requiredFieldsByCategory,
  getTypeOptions,
  validationRules,
} from '../../shared/data/constants';
import { validateField } from '../../shared/utils/formUtils';
import { useState, useEffect } from 'react';

const { Text } = Typography;
const { TextArea } = Input;

interface AdFormProps {
  formData: ItemUpdateIn;
  onChange: (data: ItemUpdateIn) => void;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
}

export const AdForm: React.FC<AdFormProps> = ({
  formData,
  onChange,
  onSave,
  onCancel,
  saving = false,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Название обязательно для заполнения';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Название должно содержать минимум 3 символа';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Название не должно превышать 100 символов';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Цена должна быть больше 0';
    } else if (formData.price > 100000000) {
      newErrors.price = 'Цена не должна превышать 100 000 000';
    }

    const requiredFields = requiredFieldsByCategory[formData.category];
    if (requiredFields.includes('type') && !formData.params?.type) {
      newErrors.type = 'Тип обязателен для заполнения';
    }

    Object.keys(formData.params).forEach((key) => {
      const value = formData.params[key];
      const isRequired = requiredFields.includes(key);
      const error = validateField(formData.category, key, value, isRequired);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
  }, [formData]);

  const handleCategoryChange = (category: Category) => {
    onChange({
      ...formData,
      category,
      params: { ...defaultParams[category] },
    });
  };

  const handleFieldChange = (field: keyof ItemUpdateIn, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  const handleParamsChange = (key: string, value: any) => {
    onChange({
      ...formData,
      params: { ...formData.params, [key]: value },
    });
  };

  const isFieldRequired = (key: string): boolean => {
    return requiredFieldsByCategory[formData.category]?.includes(key);
  };

  const getFieldStatus = (fieldName: string): 'error' | '' => {
    return errors[fieldName] ? 'error' : '';
  };

  const renderParamsField = (key: string, value: any) => {
    const isRequired = isFieldRequired(key);
    const error = errors[key];
    const rules = validationRules[formData.category]?.[key];

    // Подсказка по валидации
    const helpText = rules?.message || (isRequired ? 'Обязательное поле' : 'Необязательное поле');

    // Поле type
    if (key === 'type') {
      const currentType = value || defaultParams[formData.category].type;
      return (
        <div key={key} className="mb-4">
          <RegularLabel text={paramLabels[key] || key} required={isRequired} />
          <Select
            value={currentType}
            onChange={(val) => handleParamsChange(key, val)}
            options={getTypeOptions(formData.category)}
            className="!w-[456px]"
            status={error ? 'error' : ''}
          />
          {error && (
            <Text type="danger" className="block mt-1 text-sm">
              {error}
            </Text>
          )}
          {!error && (
            <Text type="secondary" className="block mt-1 text-xs">
              {helpText}
            </Text>
          )}
        </div>
      );
    }

    // Поле condition
    if (key === 'condition') {
      return (
        <div key={key} className="mb-4">
          <RegularLabel text={paramLabels[key] || key} />
          <Select
            value={value}
            allowClear
            placeholder="Выберите состояние"
            options={[
              { value: 'new', label: 'Новый' },
              { value: 'used', label: 'Б/У' },
            ]}
            onChange={(val) => handleParamsChange(key, val)}
            className="!w-[456px]"
            status={error ? 'error' : ''}
          />
          {error && (
            <Text type="danger" className="block mt-1 text-sm">
              {error}
            </Text>
          )}
        </div>
      );
    }

    // Поле transmission
    if (key === 'transmission') {
      return (
        <div key={key} className="mb-4">
          <RegularLabel text={paramLabels[key] || key} />
          <Select
            value={value}
            allowClear
            placeholder="Выберите коробку передач"
            options={[
              { value: 'automatic', label: 'Автоматическая' },
              { value: 'manual', label: 'Механическая' },
            ]}
            onChange={(val) => handleParamsChange(key, val)}
            className="!w-[456px]"
            status={error ? 'error' : ''}
          />
          {error && (
            <Text type="danger" className="block mt-1 text-sm">
              {error}
            </Text>
          )}
        </div>
      );
    }

    if (['yearOfManufacture', 'mileage', 'enginePower', 'area', 'floor'].includes(key)) {
      return (
        <div key={key} className="mb-4">
          <RegularLabel text={paramLabels[key] || key} />
          <Input
            type="number"
            value={value}
            placeholder={`Введите ${paramLabels[key]?.toLowerCase()}`}
            onChange={(e) => handleParamsChange(key, e.target.value)}
            className="!w-[456px]"
            status={getFieldStatus(key)}
          />
          {error && (
            <Text type="danger" className="block mt-1 text-sm">
              {error}
            </Text>
          )}
          {!error && (
            <Text type="secondary" className="block mt-1 text-xs">
              {helpText}
            </Text>
          )}
        </div>
      );
    }

    return (
      <div key={key} className="mb-4">
        <RegularLabel text={paramLabels[key] || key} />
        <Input
          value={value as string}
          placeholder={`Введите ${paramLabels[key]?.toLowerCase()}`}
          onChange={(e) => handleParamsChange(key, e.target.value)}
          className="!w-[456px]"
          status={getFieldStatus(key)}
          maxLength={50}
          showCount
        />
        {error && (
          <Text type="danger" className="block mt-1 text-sm">
            {error}
          </Text>
        )}
        {!error && (
          <Text type="secondary" className="block mt-1 text-xs">
            {helpText}
          </Text>
        )}
      </div>
    );
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="bg-white p-8 min-h-screen max-w-[1035px] mx-auto">
      <h1 className="text-black/85 font-medium mb-[18px] text-3xl">Редактирование объявления</h1>

      <div className="mb-4">
        <Label text="Категория" />
        <Select
          value={formData.category}
          onChange={handleCategoryChange}
          options={categoryOptions}
          className="!w-[456px]"
        />
      </div>

      <div className="mb-4">
        <Label text="Название" required />
        <Input
          value={formData.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          status={errors.title ? 'error' : ''}
          className="!w-[456px]"
          maxLength={100}
          showCount
        />
        {errors.title && (
          <Text type="danger" className="block mt-1 text-sm">
            {errors.title}
          </Text>
        )}
      </div>

      <div className="mb-4">
        <Label text="Цена" required />
        <div className="flex gap-2">
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => handleFieldChange('price', Number(e.target.value))}
            status={errors.price ? 'error' : ''}
            className="!w-[456px]"
          />
          <AiPriceButton
            formData={formData}
            onApply={(price) => handleFieldChange('price', price)}
          />
        </div>
        {errors.price && (
          <Text type="danger" className="block mt-1 text-sm">
            {errors.price}
          </Text>
        )}
      </div>

      <div className="mb-6">
        <Label text="Характеристики" />
        <div className="flex flex-col gap-3">
          {Object.entries(formData.params).map(([key, value]) => renderParamsField(key, value))}
        </div>
      </div>

      <div className="mb-4">
        <Label text="Описание" />
        <div className="flex flex-col gap-2">
          <TextArea
            rows={4}
            value={formData.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            showCount
            maxLength={1000}
            className="!w-full"
            status={errors.description ? 'error' : ''}
          />
          {errors.description && (
            <Text type="danger" className="text-sm">
              {errors.description}
            </Text>
          )}
          <AiDescriptionButton
            formData={formData}
            onApply={(desc) => handleFieldChange('description', desc)}
          />
        </div>
      </div>

      <Space>
        <Button
          type="primary"
          icon={<CheckOutlined />}
          onClick={onSave}
          loading={saving}
          disabled={hasErrors}
        >
          Сохранить изменения
        </Button>
        <Button onClick={onCancel}>Отмена</Button>
      </Space>

      {hasErrors && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <Text type="danger">Пожалуйста, исправьте ошибки в форме перед сохранением</Text>
        </div>
      )}
    </div>
  );
};

export default AdForm;
