import AdsList from '../../components/AdsList';
import SearchFilter from '../../components/SearchFilter';
import Header from '../../components/Header';
import FiltersPanel from '../../components/FiltersPanel';
import PaginationPanel from '../../components/Pagination';
import { useSyncUrlWithRedux } from '../../shared/hooks/useSyncUrlWithRedux';

const AdsListPage = () => {
  useSyncUrlWithRedux();
  return (
    <div>
      <Header className="mb-7" />
      <SearchFilter className="mb-4" />

      <div className="flex gap-6">
        <div className="min-w-[256px]">
          <FiltersPanel />
        </div>
        <div className="w-full flex justify-end">
          <div className="w-full max-w-[1035px]">
            <AdsList className="mb-2.5" />
            <PaginationPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsListPage;
