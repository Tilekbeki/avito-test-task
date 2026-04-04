import { useSelector } from 'react-redux';

const Header = ({ className }: HeaderProps) => {
  const totalCount = useSelector((state: any) => state.ads.total);

  return (
    <div className={`flex flex-col ${className || ''}`}>
      <div className="font-inter font-medium text-[28px] leading-[28px]">Мои объявления</div>
      <div className="font-inter font-normal text-[#848388] text-[22px] leading-[100%]">
        {totalCount} объявления
      </div>
    </div>
  );
};

export default Header;
