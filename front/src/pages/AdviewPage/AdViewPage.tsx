import { useState } from 'react';
import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
const AdViewPage = () => {
  return (
    <div>
      <div className="flex justify-between font-medium text-[40px]">
        <div>MacBook Pro 16”</div>
        <div>64000 ₽</div>
      </div>
      <div className="flex justify-between">
        <Button
          type="primary"
          style={{ backgroundColor: '#1890FF', borderColor: '#1890FF', fontSize: '22px' }}
          icon={<EditOutlined />}
          iconPlacement="end"
        >
          Редактировать
        </Button>
        <div className="text-[#848388] flex flex-col text-right text-[19px]">
          <div>Опубликовано: 10 марта 22:39</div>
          <div>Отредактировано: 10 марта 23:12</div>
        </div>
      </div>
    </div>
  );
};

export default AdViewPage;
