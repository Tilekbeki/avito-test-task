import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setParams } from '../../store/slices/ads.slice';
import { useAds } from '../../shared/hooks/useAds';

const PaginationPanel = () => {
  const dispatch = useDispatch();
  const { params } = useSelector((state: RootState) => state.ads);
  const { data } = useAds(params);

  // Если данных нет или всего меньше лимита — пагинацию не показываем
  if (!data || data.total <= (params.limit ?? 10)) return null;

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
      showSizeChanger={false} // убираем возможность менять размер страницы
    />
  );
};

export default PaginationPanel;
