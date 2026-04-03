import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setParams } from '../../store/slices/ads.slice';
import { useAds } from '../../shared/hooks/useAds';

const PaginationPanel = () => {
  const dispatch = useDispatch();

  const { total, params } = useSelector((state: RootState) => state.ads);

  // 👉 при изменении params автоматически будет новый запрос
  useAds(params);

  const currentPage = Math.floor((params.skip ?? 0) / (params.limit ?? 10)) + 1;

  const onChange = (page: number) => {
    dispatch(
      setParams({
        skip: (page - 1) * (params.limit ?? 10),
      })
    );
  };

  return (
    <Pagination current={currentPage} onChange={onChange} total={total} pageSize={params.limit} />
  );
};

export default PaginationPanel;
