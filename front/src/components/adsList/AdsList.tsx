import AdCard from '../adCard/';

interface Props {
  className?: string;
}

const AdsList = ({ className }: Props) => {
  return (
    <div className={`flex gap-3 w-full flex-wrap ${className || ''}`}>
      <AdCard />
      <AdCard />
      <AdCard />
    </div>
  );
};

export default AdsList;
