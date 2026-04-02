import { Checkbox, Switch } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setCategories, setOnlyNeedFix, resetFilters } from '../../store/slices/filterPanel.slice';
import { applyFiltersAndSort } from '../../store/slices/ads.slice';
import { useState } from 'react';

const FiltersPanel = () => {
  const dispatch = useDispatch();
  const filterPanel = useSelector((state: RootState) => state.filterPanel);
  const searchFilter = useSelector((state: RootState) => state.searchFilter);
  const [showCategories, setShowCategories] = useState(true);

  const categories = [
    { value: 'auto', label: 'Авто' },
    { value: 'electronics', label: 'Электроника' },
    { value: 'real_estate', label: 'Недвижимость' },
  ];

  const updateDisplayedItems = (newFilterPanel: typeof filterPanel) => {
    dispatch(applyFiltersAndSort({ filterPanel: newFilterPanel, searchFilter }));
  };

  const handleCategoryChange = (checkedValues: string[]) => {
    const newFilterPanel = { ...filterPanel, selectedCategories: checkedValues };
    dispatch(setCategories(checkedValues as any));
    updateDisplayedItems(newFilterPanel);
  };

  const handleOnlyNeedFixChange = (checked: boolean) => {
    const newFilterPanel = { ...filterPanel, onlyNeedFix: checked };
    dispatch(setOnlyNeedFix(checked));
    updateDisplayedItems(newFilterPanel);
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    updateDisplayedItems({ selectedCategories: [], onlyNeedFix: false });
  };

  return (
    <div className="w-[256px]">
      <div className="bg-white rounded-2xl mb-2.5 p-4">
        <div className="font-bold text-lg mb-4">Фильтры</div>
        <div
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => setShowCategories(!showCategories)}
        >
          <div className="font-medium">Категория</div>
          <UpOutlined
            className={`transition-transform duration-200 ${!showCategories ? 'rotate-180' : ''}`}
          />
        </div>

        {showCategories && (
          <Checkbox.Group
            options={categories}
            value={filterPanel.selectedCategories}
            onChange={handleCategoryChange}
            className="flex flex-col gap-2 mb-4"
          />
        )}

        <div className="flex justify-between items-center mt-4">
          <span className="font-bold">Только требующие доработок</span>
          <Switch checked={filterPanel.onlyNeedFix} onChange={handleOnlyNeedFixChange} />
        </div>
      </div>

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
