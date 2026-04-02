import { useSelector } from 'react-redux';

interface HeaderProps {
  className?: string;
}
const Header = ({ className }: HeaderProps) => {
  const totalCount = useSelector((state) => state.ads.total);

  return (
    <div className={`flex flex-col ${className || ''}`}>
      <div className="font-bold text-[28px]">Мои объявления</div>
      <div className="text-[#848388] text-[22px]">{totalCount} объявления</div>
    </div>
  );
};

export default Header;
