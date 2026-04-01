import AdsList from '../../components/adsList';
import SearchFilter from '../../components/SearchFilter';
import Header from '../../components/Header';
import FiltersPanel from '../../components/FiltersPanel';
import PaginationPanel from '../../components/Pagination';

const AdsListPage = () => {
  return (
    <div>
      <Header className="mb-7" />
      <SearchFilter className="mb-6" />

      <div className="flex gap-6">
        <FiltersPanel />
        <div>
          <AdsList className="mb-2.5" />

          <PaginationPanel />
        </div>
      </div>
    </div>
  );
};

export default AdsListPage;
