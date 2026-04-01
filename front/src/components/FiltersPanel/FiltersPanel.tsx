import { useState } from 'react';
import { Checkbox, Switch } from 'antd';
import { UpOutlined } from '@ant-design/icons';

const FiltersPanel = () => {
  const [showCategories, setShowCategories] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [onlyNeedFix, setOnlyNeedFix] = useState(false);

  const categories = [
    { value: 'auto', label: 'Авто' },
    { value: 'electronics', label: 'Электроника' },
    { value: 'realty', label: 'Недвижимость' },
  ];

  const handleCategoryChange = (checkedValues) => {
    setSelectedCategories(checkedValues);
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setOnlyNeedFix(false);
  };

  return (
    <div className="w-[256px]">
      <div className="bg-white rounded-2xl mb-2.5 p-4">
        <div className="font-bold text-lg mb-4">Фильтры</div>

        {/* Категория с кнопкой-стрелкой */}
        <div
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => setShowCategories(!showCategories)}
        >
          <div className="font-medium">Категория</div>
          <UpOutlined
            className={`transition-transform duration-200 ${!showCategories ? 'rotate-180' : ''}`}
          />
        </div>

        {/* Чекбоксы категорий */}
        {showCategories && (
          <Checkbox.Group
            options={categories}
            value={selectedCategories}
            onChange={handleCategoryChange}
            className="flex flex-col gap-2 mb-4"
          />
        )}

        {/* Switch с жирным текстом */}
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold">Только требующие доработок</span>
          <Switch checked={onlyNeedFix} onChange={setOnlyNeedFix} />
        </div>
      </div>

      {/* Кнопка сброса фильтров */}
      <div
        className="bg-white rounded-2xl text-center h-[41px] py-3 text-[#848388] cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleResetFilters}
      >
        Сбросить фильтры
      </div>
    </div>
  );
};

export default FiltersPanel;
