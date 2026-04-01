import { Input, Radio, Select, type SelectProps } from 'antd';
import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useState } from 'react';

interface SearchFilterProps {
  className?: string;
}

const onChange = () => {
  console.log('change');
};
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

const SearchFilter = ({ className }: SearchFilterProps) => {
  const [sortBy, setSortBy] = useState('name_asc');

  return (
    <div className={`p-[12px] bg-white rounded-lg flex gap-[24px] items-center ${className || ''}`}>
      <Input.Search placeholder="Найти объявление..." variant="filled" className="flex-1" />
      <Radio.Group
        onChange={onChange}
        defaultValue="a"
        className="flex-shrink-0" // Запрещает сжатие
      >
        <Radio.Button value="a">
          <AppstoreOutlined />
        </Radio.Button>
        <Radio.Button value="b">
          <UnorderedListOutlined />
        </Radio.Button>
      </Radio.Group>
      <Select value={sortBy} onChange={setSortBy} style={{ width: 240 }} options={options} />
    </div>
  );
};

export default SearchFilter;
