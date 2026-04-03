import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAds } from '../../store/thunks/fetchAds';
import type { RootState } from '../../store/store';
import AdCard from '../adCard';
import { Spin, Alert } from 'antd';

const AdsList = () => {
  const dispatch = useDispatch();
  const { displayedItems, loading, error, params } = useSelector((state: RootState) => state.ads);

  useEffect(() => {
    dispatch(fetchAds(params));
  }, [dispatch, params]);

  if (loading) return <Spin />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="flex gap-3 w-full flex-wrap">
      {displayedItems.map((ad) => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </div>
  );
};

export default AdsList;
