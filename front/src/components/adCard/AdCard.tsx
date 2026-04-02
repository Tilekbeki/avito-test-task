import img from '../../assets/cover.png';
import type { ItemWithRevision } from '../../shared/types/ad.types';

interface Props {
  ad: ItemWithRevision;
}

const categoryLabels = {
  electronics: 'Электроника',
  auto: 'Транспорт',
  real_estate: 'Недвижимость',
};

const AdCard = ({ ad }: Props) => {
  return (
    <div className="w-[200px] rounded-2xl bg-white overflow-hidden">
      {/* IMAGE */}
      <div className="relative">
        <img className="w-full h-auto" src={img} alt={ad.title} />

        {/* CATEGORY */}
        <div
          className="absolute bottom-[-11px] left-[12px]
                     bg-white rounded-full px-3 py-1 text-sm font-medium"
        >
          {categoryLabels[ad.category]}
        </div>
      </div>

      {/* CONTENT */}
      <div className="pt-[22px] px-4 pb-4">
        <h3 className="font-medium text-base mb-1 line-clamp-2">{ad.title}</h3>

        <p className="text-lg font-bold text-[#00000073] mb-1">{ad.price.toLocaleString()} ₽</p>

        {/* NEEDS REVISION */}
        {ad.needsRevision && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#FAAD14] rounded-full animate-pulse"></div>
            <span className="text-[#FAAD14] text-sm">Требует доработок</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdCard;
