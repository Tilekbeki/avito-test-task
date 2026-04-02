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
      <div>
        <Button
          type="primary"
          icon={<EditOutlined />}
          style={{ backgroundColor: '#1890FF', borderColor: '#1890FF' }}
        >
          Редактировать
        </Button>
      </div>
    </div>
  );
};

export default AdViewPage;
