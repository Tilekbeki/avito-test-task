import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import AdCard from '../adCard';
import { Spin, Alert, Empty } from 'antd';
import { useAds } from '../../shared/hooks/useAds';

const AdsList = ({ className }: { className?: string }) => {
  const { params } = useSelector((state: RootState) => state.ads);
  const { data, isLoading, isError } = useAds(params);

  // 🔄 Состояние загрузки
  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full py-10">
        <Spin size="large" tip="Загрузка объявлений..." />
      </div>
    );
  }

  // ❌ Состояние ошибки
  if (isError || !data) {
    return (
      <Alert
        message="Ошибка загрузки"
        description="Не удалось загрузить объявления. Попробуйте позже."
        type="error"
        showIcon
        className="w-full"
      />
    );
  }

  // 📭 Состояние пустого списка
  if (data.items.length === 0) {
    return <Empty description="Ничего не найдено" className="w-full py-10" />;
  }

  // ✅ Успешный рендер с разными отступами
  const containerClassName = `w-full flex-wrap ${
    params.viewMode === 'grid'
      ? 'flex gap-x-2 gap-y-3' // grid: горизонтальный gap 2 (8px), вертикальный gap 3 (12px)
      : 'flex flex-col gap-3' // list: gap 3 (12px) между карточками
  } ${className || ''}`;

  return (
    <div className={containerClassName}>
      {data.items.map((ad) => (
        <AdCard key={ad.id} ad={ad} viewMode={params.viewMode} />
      ))}
    </div>
  );
};

export default AdsList;
