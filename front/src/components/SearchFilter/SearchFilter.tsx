import { Input, Radio, Select, type SelectProps } from 'antd';
import { AppstoreOutlined, SearchOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setParams } from '../../store/slices/filterParams.slice';
import { useState, useEffect } from 'react';
import { useDebounce } from '../../shared/hooks/useDebounce';
import styles from './SearchFilter.module.scss';

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
  return 'date_desc';
};

const SearchFilter = ({ className }: { className?: string }) => {
  const dispatch = useDispatch();
  const { params } = useSelector((state: RootState) => state.filterParams);

  const [search, setSearch] = useState(params.q || '');
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (params.q !== undefined && params.q !== search) {
      setSearch(params.q);
    }
  }, [params.q]);

  useEffect(() => {
    if (debouncedSearch !== params.q) {
      dispatch(
        setParams({
          q: debouncedSearch || undefined,
          skip: 0,
        })
      );
    }
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
    const newViewMode = e.target.value;
    dispatch(
      setParams({
        viewMode: newViewMode,
        limit: newViewMode === 'list' ? 4 : 10,
        skip: 0,
      })
    );
  };

  return (
    <div className={`p-[12px] bg-white rounded-lg flex gap-[24px] items-center ${className}`}>
      <Input
        placeholder="Найти объявление..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        suffix={<SearchOutlined />}
        className="bg-[#F6F6F8] border-none h-8 px-3"
      />

      <Radio.Group
        onChange={handleViewChange}
        value={params.viewMode}
        className={styles.radioGroup}
      >
        <Radio.Button value="grid">
          <AppstoreOutlined />
        </Radio.Button>
        <Radio.Button value="list">
          <UnorderedListOutlined />
        </Radio.Button>
      </Radio.Group>

      <Select
        value={getSortValue(params)}
        onChange={handleSortChange}
        style={{
          width: 240,
          height: 32,
          color: '#000',
          padding: '0 11px',
          border: '4px solid #F4F4F6',
          borderRadius: 8,
          background: 'white',
          boxSizing: 'border-box',
        }}
        options={options}
        popupClassName="custom-select-dropdown"
      />
    </div>
  );
};

export default SearchFilter;
