import { Alert } from 'antd';
import img from '../../assets/cover-big.png';
import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
const AdViewPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="flex justify-between font-medium text-[40px] mb-3">
        <h1>MacBook Pro 16”</h1>
        <div>64000 ₽</div>
      </div>
      <div className="flex justify-between mb-8">
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
      <hr className="bg-[#F0F0F0] border-[#F0F0F0] mb-8" />
      <div className="flex gap-8">
        <div className="w-[480px] h-[360px]">
          <img src={img} alt="товара картинка" width="100%" height="100%" />
        </div>
        <div className="flex flex-col gap-9">
          <Alert
            title="Требуются доработки"
            description="У объявления не заполнены поля: Цвет, Состояние"
            type="warning"
            showIcon
          />
          <div className="flex flex-col">
            <div className="font-medium">Характеристики</div>
            <div>
              <div className="text-black">
                <div className="flex gap-3">
                  <div className="w-[148px]">Тип</div> <div>Ноутбук</div>
                </div>
                <div className="flex gap-3">
                  <div className="w-[148px]">Бренд</div> <div>Apple</div>
                </div>
                <div className="flex gap-3">
                  <div className="w-[148px]">Модель</div> <div>M1 Pro</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdViewPage;
