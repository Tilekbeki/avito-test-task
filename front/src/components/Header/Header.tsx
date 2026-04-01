interface HeaderProps {
  className?: string;
}
const Header = ({ className }: HeaderProps) => {
  return (
    <div className={`flex flex-col ${className || ''}`}>
      <div className="font-bold text-[28px]">Мои объявления</div>
      <div className="text-[#848388] text-[22px]">42 объявления</div>
    </div>
  );
};

export default Header;
