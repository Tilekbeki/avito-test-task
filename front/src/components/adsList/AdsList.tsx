import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import AdCard from '../adCard';
import { Spin, Alert } from 'antd';
import { useAds } from '../../shared/hooks/useAds';

const AdsList = () => {
  const { params } = useSelector((state: RootState) => state.ads);
  const { data, isLoading, isError } = useAds(params);

  // 🔄 loading
  if (isLoading) return <Spin />;

  // ❌ error
  if (isError || !data) {
    return <Alert message="Ошибка загрузки" type="error" />;
  }

  // 📭 empty
  if (data.items.length === 0) {
    return <div className="text-center w-full py-10">Ничего не найдено</div>;
  }

  // ✅ success
  return (
    <div className="flex gap-3 w-full flex-wrap">
      {data.items.map((ad) => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </div>
  );
};

export default AdsList;
