import { useTotalCount } from '../../shared/hooks/useTotalCount';

const Header = ({ className }: HeaderProps) => {
  const { data: totalCount = 0, isLoading, isError } = useTotalCount();

  return (
    <div className={`flex flex-col ${className || ''}`}>
      <div className="font-family-inter font-medium text-[28px] leading-[28px]">Мои объявления</div>
      <div className="font-family-inter font-normal text-[#848388] text-[22px] leading-[100%]">
        {isLoading ? '...' : isError ? '0' : `${totalCount} объявлени${getDeclension(totalCount)}`}
      </div>
    </div>
  );
};

const getDeclension = (count: number): string => {
  if (count % 10 === 1 && count % 100 !== 11) return 'е';
  if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'я';
  return 'й';
};

export default Header;
