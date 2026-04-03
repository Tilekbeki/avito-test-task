import { Input, Radio, Select, type SelectProps } from 'antd';
import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setViewMode } from '../../store/slices/searchFilter.slice';
import { setParams } from '../../store/slices/ads.slice';
import { useState, useEffect } from 'react';
import { useDebounce } from '../../shared/hooks/useDebounce';

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
];

const getSortValue = (params: any) => {
  if (params.sortColumn === 'title' && params.sortDirection === 'asc') return 'name_asc';
  if (params.sortColumn === 'title' && params.sortDirection === 'desc') return 'name_desc';
  if (params.sortColumn === 'createdAt' && params.sortDirection === 'asc') return 'date_asc';
  if (params.sortColumn === 'createdAt' && params.sortDirection === 'desc') return 'date_desc';
  return undefined;
};

const SearchFilter = () => {
  const dispatch = useDispatch();
  const { viewMode } = useSelector((state: RootState) => state.searchFilter);
  const { params } = useSelector((state: RootState) => state.ads);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    dispatch(
      setParams({
        q: debouncedSearch || undefined,
        skip: 0,
      })
    );
  }, [debouncedSearch, dispatch]);

  const handleSortChange = (value: string) => {
    const map: any = {
      name_asc: { sortColumn: 'title', sortDirection: 'asc' },
      name_desc: { sortColumn: 'title', sortDirection: 'desc' },
      date_asc: { sortColumn: 'createdAt', sortDirection: 'asc' },
      date_desc: { sortColumn: 'createdAt', sortDirection: 'desc' },
    };

    dispatch(
      setParams({
        ...map[value],
        skip: 0,
      })
    );
  };

  const handleViewChange = (e: any) => {
    const viewMode = e.target.value;

    dispatch(setViewMode(viewMode));

    dispatch(
      setParams({
        limit: viewMode === 'list' ? 4 : 10,
        skip: 0,
      })
    );
  };

  return (
    <div className="p-[12px] bg-white rounded-lg flex gap-[24px] items-center">
      <Input.Search
        placeholder="Найти объявление..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1"
      />

      <Radio.Group onChange={handleViewChange} value={viewMode}>
        <Radio.Button value="grid">
          <AppstoreOutlined />
        </Radio.Button>
        <Radio.Button value="list">
          <UnorderedListOutlined />
        </Radio.Button>
      </Radio.Group>

      <Select
        value={getSortValue(params)} // 🔥 синхронизация
        onChange={handleSortChange}
        style={{ width: 240 }}
        options={options}
      />
    </div>
  );
};

export default SearchFilter;
