import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setParams } from '../../store/slices/filterParams.slice';
import { useAds } from '../../shared/hooks/useAds';
import type { GetAdsResponse } from '../../services/ads.service';

const PaginationPanel = () => {
  const dispatch = useDispatch();
  const { params } = useSelector((state: RootState) => state.filterParams);
  const { data } = useAds(params);

  if (!data || data === true || data.total <= (params.limit ?? 10)) return null;

  const currentPage = Math.floor((params.skip ?? 0) / (params.limit ?? 10)) + 1;

  const onChange = (page: number) => {
    dispatch(
      setParams({
        skip: (page - 1) * (params.limit ?? 10),
      })
    );
  };

  return (
    <Pagination
      current={currentPage}
      total={data.total}
      pageSize={params.limit}
      onChange={onChange}
      showSizeChanger={false}
    />
  );
};

export default PaginationPanel;
