import { Pagination, type PaginationProps } from 'antd';
import { useState } from 'react';

const PaginationPanel = () => {
  const [current, setCurrent] = useState(3);
  const onChange: PaginationProps['onChange'] = (page) => {
    console.log(page);
    setCurrent(page);
  };
  return <Pagination current={current} onChange={onChange} total={50} />;
};

export default PaginationPanel;
