import { Link } from 'react-router-dom';
import { Card, Tag } from 'antd';
import img from '../../assets/cover.png';
import type { ItemWithRevision } from '../../shared/types/ad.types';

interface Props {
  ad: ItemWithRevision;
  viewMode?: 'grid' | 'list';
}

const categoryLabels: Record<string, string> = {
  electronics: 'Электроника',
  auto: 'Транспорт',
  real_estate: 'Недвижимость',
};

const RevisionTag = () => (
  <Tag color="warning" className="flex items-center w-fit">
    <span
      className="inline-block w-1 h-1 rounded-full bg-current align-middle"
      style={{ marginTop: '-2px', marginRight: '6px' }}
    />
    Требует доработок
  </Tag>
);

const AdCard = ({ ad, viewMode = 'grid' }: Props) => {
  // Режим списка (горизонтальный)
  if (viewMode === 'list') {
    return (
      <Link to={`/ads/${ad.id}`} className="block">
        <Card
          hoverable
          className="font-family-roboto w-full overflow-hidden"
          styles={{ body: { padding: 0 } }}
        >
          <div className="flex gap-4 h-[132px]">
            {/* IMAGE */}
            <div className="shrink-0 w-[179px] h-full">
              <img className="w-full h-full object-cover" src={img} alt={ad.title} />
            </div>

            {/* CONTENT */}
            <div className="flex-1 py-4 pr-4">
              <div className="text-[16px] text-[#848388] font-family-inter mb-1">
                {categoryLabels[ad.category]}
              </div>
              <h3 className="font-family-roboto text-[16px] mb-1 hover:text-blue-600 transition-colors line-clamp-1">
                {ad.title}
              </h3>
              <p className="text-[16px] font-family-inter font-semibold text-black/45 mb-1">
                {ad.price.toLocaleString()} ₽
              </p>
              {ad.needsRevision && <RevisionTag />}
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Режим сетки (вертикальный)
  return (
    <Link to={`/ads/${ad.id}`} className="block w-[200px]">
      <Card
        hoverable
        className="h-[268px] overflow-hidden"
        cover={
          <div className="relative">
            <img alt={ad.title} src={img} className="w-full h-auto" />
            <div
              className="absolute bottom-[-11px] left-[12px]
             bg-white rounded-full px-3 py-1 shadow-sm
             font-family-roboto font-normal text-[14px]"
            >
              {categoryLabels[ad.category]}
            </div>
          </div>
        }
      >
        <div>
          <h3
            className="mb-1 hover:text-blue-600 transition-colors font-family-roboto font-normal text-[16px]"
            title={ad.title}
            style={{
              maxWidth: '168px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {ad.title}
          </h3>
          <p className="font-family-inter text-black/45 text-[16px] font-semibold mb-2">
            {ad.price.toLocaleString()} ₽
          </p>
          {ad.needsRevision && <RevisionTag />}
        </div>
      </Card>
    </Link>
  );
};

export default AdCard;
