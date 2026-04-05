// components/AdForm.tsx
import { Input, Button, Select, Space, message, Tooltip, Typography } from 'antd';
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
} from '../../pages/AdEditPage/constants';

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

  const renderParamsField = (key: string, value: any) => {
    const isRequired = isFieldRequired(key);

    // Поле type
    if (key === 'type') {
      const currentType = value || defaultParams[formData.category].type;
      return (
        <div key={key} className="mb-2">
          <RegularLabel text={paramLabels[key] || key} required={isRequired} />
          <Select
            value={currentType}
            onChange={(val) => handleParamsChange(key, val)}
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

    // Поле condition
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
            onChange={(val) => handleParamsChange(key, val)}
            className="!w-[456px]"
          />
        </div>
      );
    }

    // Поле transmission
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
            onChange={(val) => handleParamsChange(key, val)}
            className="!w-[456px]"
          />
        </div>
      );
    }

    // Обычные текстовые поля
    return (
      <div key={key} className="mb-2">
        <RegularLabel text={paramLabels[key] || key} />
        <Input
          value={value as string}
          placeholder={`Введите ${paramLabels[key]?.toLowerCase()}`}
          onChange={(e) => handleParamsChange(key, e.target.value)}
          className="!w-[456px]"
        />
      </div>
    );
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
          onChange={(e) => handleFieldChange('title', e.target.value)}
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
            onChange={(e) => handleFieldChange('price', Number(e.target.value))}
            status={!formData.price || formData.price <= 0 ? 'error' : ''}
            required
            className="!w-[456px]"
          />
          <AiPriceButton
            formData={formData}
            onApply={(price) => handleFieldChange('price', price)}
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
          {Object.entries(formData.params).map(([key, value]) => renderParamsField(key, value))}
        </div>
      </div>

      {/* Описание */}
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
          />
          <AiDescriptionButton
            formData={formData}
            onApply={(desc) => handleFieldChange('description', desc)}
          />
        </div>
      </div>

      <Space>
        <Button type="primary" icon={<CheckOutlined />} onClick={onSave} loading={saving}>
          Сохранить изменения
        </Button>
        <Button onClick={onCancel}>Отмена</Button>
      </Space>
    </div>
  );
};

export default AdForm;
