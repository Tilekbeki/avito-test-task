import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import type { RootState } from '../../store/store';
import { setParams } from '../../store/slices/filterParams.slice';

export const useSyncUrlWithRedux = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { params } = useSelector((state: RootState) => state.filterParams);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const urlParams: Partial<typeof params> = {};
    
    const q = searchParams.get('q');
    if (q) urlParams.q = q;
    
    const categories = searchParams.get('categories');
    if (categories) urlParams.categories = categories.split(',') as any;
    
    const needsRevision = searchParams.get('needsRevision');
    if (needsRevision !== null) urlParams.needsRevision = needsRevision === 'true';
    
    const skip = searchParams.get('skip');
    if (skip) urlParams.skip = Number(skip);
    
    const limit = searchParams.get('limit');
    if (limit) urlParams.limit = Number(limit);
    
    const sortColumn = searchParams.get('sortColumn');
    if (sortColumn) urlParams.sortColumn = sortColumn as any;
    
    const sortDirection = searchParams.get('sortDirection');
    if (sortDirection) urlParams.sortDirection = sortDirection as any;
    
    const viewMode = searchParams.get('viewMode');
    if (viewMode && (viewMode === 'grid' || viewMode === 'list')) {
      urlParams.viewMode = viewMode;
    }
    
    if (Object.keys(urlParams).length > 0) {
      dispatch(setParams(urlParams));
    }
    
    isInitialMount.current = false;
  }, []);

  useEffect(() => {
    if (isInitialMount.current) return;
    
    const newParams = new URLSearchParams();
    
    if (params.q) newParams.set('q', params.q);
    if (params.categories && params.categories.length > 0) {
      newParams.set('categories', params.categories.join(','));
    }
    if (params.needsRevision !== undefined) {
      newParams.set('needsRevision', String(params.needsRevision));
    }
    if (params.skip && params.skip !== 0) newParams.set('skip', String(params.skip));
    if (params.limit && params.limit !== 10) newParams.set('limit', String(params.limit));
    if (params.sortColumn && params.sortColumn !== 'createdAt') {
      newParams.set('sortColumn', params.sortColumn);
    }
    if (params.sortDirection && params.sortDirection !== 'desc') {
      newParams.set('sortDirection', params.sortDirection);
    }
    if (params.viewMode && params.viewMode !== 'grid') {
      newParams.set('viewMode', params.viewMode);
    }
    
    setSearchParams(newParams, { replace: true });
  }, [params, setSearchParams]);
};