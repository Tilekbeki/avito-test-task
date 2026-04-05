import { Checkbox, Switch } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setParams, resetParams } from '../../store/slices/filterParams.slice';
import { useState } from 'react';
import styles from './FiltersPanel.module.scss';

const FiltersPanel = () => {
  const dispatch = useDispatch();
  const { params } = useSelector((state: RootState) => state.filterParams);

  const [showCategories, setShowCategories] = useState(true);

  const categories = [
    { value: 'auto', label: 'Авто' },
    { value: 'electronics', label: 'Электроника' },
    { value: 'real_estate', label: 'Недвижимость' },
  ];

  const handleCategoryChange = (checkedValues: string[]) => {
    dispatch(
      setParams({
        categories: checkedValues.length > 0 ? (checkedValues as any) : undefined,
        skip: 0,
      })
    );
  };

  const handleOnlyNeedFixChange = (checked: boolean) => {
    dispatch(
      setParams({
        needsRevision: checked || undefined,
        skip: 0,
      })
    );
  };

  const handleResetFilters = () => {
    dispatch(resetParams());
  };

  return (
    <div className="!w-[256px]" style={{ width: '256px' }}>
      <div className="bg-white rounded-[8px] mb-2.5 p-4">
        <div className="font-family-roboto text-[16px] font-medium mb-2.5">Фильтры</div>

        <div
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => setShowCategories(!showCategories)}
        >
          <div className="font-normal font-family-roboto text-[14px]">Категория</div>
          <UpOutlined
            className={`transition-transform duration-200 ${!showCategories ? 'rotate-180' : ''}`}
          />
        </div>

        {showCategories && (
          <Checkbox.Group
            options={categories}
            value={(params.categories as string[]) || []}
            onChange={handleCategoryChange}
            className={`flex flex-col gap-2 ${styles.checkboxGroup}`}
          />
        )}
        <hr className="my-2.5 border-[#F0F0F0]" />
        <div className="flex justify-between items-center mt-4">
          <span className="font-family-inter font-semibold text-[14px]">
            Только требующие доработок
          </span>
          <Switch checked={params.needsRevision ?? false} onChange={handleOnlyNeedFixChange} />
        </div>
      </div>

      <div
        className="bg-white rounded-[8px] text-[14px] font-family-inter text-center h-[41px] leading-[41px] text-[#848388] cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleResetFilters}
      >
        Сбросить фильтры
      </div>
    </div>
  );
};

export default FiltersPanel;
