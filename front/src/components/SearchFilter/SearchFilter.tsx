import { Input, Radio, Select, type SelectProps } from 'antd';
import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setSearchText, setSortBy, setViewMode } from '../../store/slices/searchFilter.slice';
import { applyFiltersAndSort } from '../../store/slices/ads.slice';

const options: SelectProps['options'] = [
  {
    label: 'По названию',
    options: [
      { value: 'name_asc', label: 'По названию (А → Я)' },
      { value: 'name_desc', label: 'По названию (Я → А)' },
    ],
  },
  {
    label: 'По новизне',
    options: [
      { value: 'date_desc', label: 'По новизне (сначала новые)' },
      { value: 'date_asc', label: 'По новизне (сначала старые)' },
    ],
  },
  {
    label: 'По цене',
    options: [
      { value: 'price_asc', label: 'По цене (сначала дешевле)' },
      { value: 'price_desc', label: 'По цене (сначала дороже)' },
    ],
  },
];

const SearchFilter = () => {
  const dispatch = useDispatch();
  const searchFilter = useSelector((state: RootState) => state.searchFilter);
  const filterPanel = useSelector((state: RootState) => state.filterPanel);

  const handleSearchChange = (value: string) => {
    dispatch(setSearchText(value));
    dispatch(
      applyFiltersAndSort({ filterPanel, searchFilter: { ...searchFilter, searchText: value } })
    );
  };

  const handleSortChange = (value: string) => {
    dispatch(setSortBy(value));
    dispatch(
      applyFiltersAndSort({ filterPanel, searchFilter: { ...searchFilter, sortBy: value } })
    );
  };

  const handleViewChange = (e: any) => {
    dispatch(setViewMode(e.target.value));
  };

  return (
    <div className="p-[12px] bg-white rounded-lg flex gap-[24px] items-center">
      <Input.Search
        placeholder="Найти объявление..."
        value={searchFilter.searchText}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="flex-1"
      />
      <Radio.Group onChange={handleViewChange} value={searchFilter.viewMode}>
        <Radio.Button value="grid">
          <AppstoreOutlined />
        </Radio.Button>
        <Radio.Button value="list">
          <UnorderedListOutlined />
        </Radio.Button>
      </Radio.Group>
      <Select
        value={searchFilter.sortBy}
        onChange={handleSortChange}
        style={{ width: 240 }}
        options={options}
      />
    </div>
  );
};

export default SearchFilter;
