import { useState } from 'react';
import { Input, Button, Select, Tag, Space, Divider, message } from 'antd';
import { CloseOutlined, ReloadOutlined, CheckOutlined, EditOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const AdEditPage = () => {
  const [formData, setFormData] = useState({
    category: 'electronics',
    title: 'MacBook Pro 16"',
    price: '120000',
    description: '',
    characteristics: {
      type: 'Ноутбук',
      brand: 'Apple',
      model: 'M1 Pro',
      color: 'Серый',
      condition: 'Б/У',
    },
  });

  const [charCount, setCharCount] = useState(0);
  const [aiResponse, setAiResponse] = useState(null);
  const [showAiModal, setShowAiModal] = useState(true); // Для демонстрации

  const categoryOptions = [
    { value: 'electronics', label: 'Электроника' },
    { value: 'auto', label: 'Авто' },
    { value: 'realty', label: 'Недвижимость' },
  ];

  const handleDescriptionChange = (e) => {
    setCharCount(e.target.value.length);
    setFormData({ ...formData, description: e.target.value });
  };

  const showAiRecommendation = () => {
    setAiResponse({
      title: 'Средняя цена на MacBook Pro 16" M1 Pro (16/512GB):',
      suggestions: [
        '115 000 – 135 000 ₽ — отличное состояние.',
        'От 140 000 ₽ — идеальная запись АКБ.',
        '90 000 – 110 000 ₽ — срочно или с дефектами.',
      ],
    });
  };

  const applyPrice = () => {
    message.success('Цена применена');
    setFormData({ ...formData, price: '125000' });
    setShowAiModal(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      {/* Заголовок */}
      <h1 className="text-3xl font-bold mb-8">Редактирование объявления</h1>

      {/* Категория */}
      <div className="mb-6">
        <label className="block text-base font-semibold mb-3">Категория</label>
        <Select
          value={formData.category}
          onChange={(value) => setFormData({ ...formData, category: value })}
          className="w-full max-w-md"
          size="large"
          options={categoryOptions}
        />
      </div>

      {/* Название */}
      <div className="mb-6">
        <label className="block text-base font-semibold mb-3">Название</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Введите название"
          size="large"
          className="max-w-2xl"
        />
      </div>

      {/* Цена */}
      <div className="mb-8">
        <label className="block text-base font-semibold mb-3">Цена</label>
        <Input
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          placeholder="Введите цену"
          size="large"
          className="max-w-md"
          prefix="₽"
        />
      </div>

      {/* Ответ AI */}
      {showAiModal && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mb-8">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-blue-900">Ответ AI:</h3>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setShowAiModal(false)}
              className="text-gray-400 hover:text-gray-600"
            />
          </div>

          <p className="text-gray-800 mb-3 font-medium">
            Средняя цена на MacBook Pro 16" M1 Pro (16/512GB):
          </p>

          <ul className="space-y-2 mb-4">
            <li className="text-gray-700">• 115 000 – 135 000 ₽ — отличное состояние.</li>
            <li className="text-gray-700">• От 140 000 ₽ — идеальная запись АКБ.</li>
            <li className="text-gray-700">• 90 000 – 110 000 ₽ — срочно или с дефектами.</li>
          </ul>

          <div className="flex gap-3">
            <Button type="primary" onClick={applyPrice}>
              Применить
            </Button>
            <Button onClick={() => setShowAiModal(false)}>Закрыть</Button>
            <Button icon={<ReloadOutlined />}>Повторить запрос</Button>
          </div>
        </div>
      )}

      {/* Характеристики */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Характеристики</h2>
        <div className="grid grid-cols-2 gap-4 max-w-2xl">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Тип</span>
            <span className="font-medium">{formData.characteristics.type}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Бренд</span>
            <span className="font-medium">{formData.characteristics.brand}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Модель</span>
            <span className="font-medium">{formData.characteristics.model}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Цвет</span>
            <span className="font-medium">{formData.characteristics.color}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Состояние</span>
            <span className="font-medium">{formData.characteristics.condition}</span>
          </div>
        </div>
      </div>

      {/* Описание */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <label className="text-base font-semibold">Описание</label>
          <Space>
            <Button size="small" type="link" className="text-gray-500">
              Очистить
            </Button>
            <Button size="small" type="link" className="text-gray-500">
              Отменить
            </Button>
          </Space>
        </div>

        <TextArea
          rows={6}
          value={formData.description}
          onChange={handleDescriptionChange}
          placeholder="Введите описание объявления..."
          className="mb-2"
          showCount
          maxLength={1000}
        />

        <div className="text-right text-gray-400 text-sm">{charCount} / 1000</div>
      </div>

      {/* Кнопки действий */}
      <div className="flex gap-4 pt-4 border-t border-gray-200">
        <Button type="primary" size="large" icon={<CheckOutlined />}>
          Сохранить изменения
        </Button>
        <Button size="large">Отмена</Button>
      </div>
    </div>
  );
};

export default AdEditPage;
