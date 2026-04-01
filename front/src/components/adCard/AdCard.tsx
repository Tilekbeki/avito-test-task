import { Alert } from 'antd';
import img from '../../assets/cover.png';

const AdCard = () => {
  return (
    <div className="w-[200px] rounded-2xl bg-white overflow-hidden">
      {/* Контейнер для изображения с относительным позиционированием */}
      <div className="relative">
        <img className="w-full h-auto" src={img} alt="картинка" />

        {/* Категория с абсолютным позиционированием по середине */}
        <div
          className="absolute bottom-[-11px] left-[12px] transform 
                      bg-white rounded-full px-3 py-1 text-sm font-medium"
        >
          Электроника
        </div>
      </div>

      <div className="pt-[22px] px-4 pb-4">
        <h3 className="font-medium text-base mb-1">Наушники</h3>
        <p className="text-lg font-bold text-[#00000073] mb-1">2990 ₽</p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 flex items-center gap-2 animate-pulse">
          {/* Мигающая точка */}
          <div className="w-2 h-2 bg-[#FAAD14] rounded-full "></div>
          <span className="text-[#FAAD14] text-sm">Требует доработок</span>
        </div>
      </div>
    </div>
  );
};

export default AdCard;
