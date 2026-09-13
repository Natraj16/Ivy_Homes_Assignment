import { useState, useEffect } from 'react';
import { fetchApi } from './api';

interface PaginatedResponse<T> {
  results: T[];
  total: number;
  offset: number;
  limit: number;
}

export async function fetchAllPages<T>(path: string, params: Record<string, string> = {}): Promise<T[]> {
  let allResults: T[] = [];
  let offset = 0;
  let limit = 50; // The API limit
  
  while (true) {
    const query = new URLSearchParams({
      ...params,
      offset: offset.toString(),
      limit: limit.toString(),
    });

    const url = `${path}?${query.toString()}`;
    const data = await fetchApi<PaginatedResponse<T>>(url);
    
    if (data.results && data.results.length > 0) {
      allResults = [...allResults, ...data.results];
      offset += data.results.length; // The API pagination quirk we discovered earlier!
      
      // If we got exactly the limit (or somehow more), there might be more
      // If we got less than the limit, we're at the end.
      // Or we can check if offset >= total, if total is reliable.
      if (data.results.length < limit || offset >= (data.total || 0)) {
        break;
      }
    } else {
      break; // No more results
    }
  }

  return allResults;
}

export function usePaginated<T>(path: string, params: Record<string, string> = {}) {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // We stringify params to use as dependency array
  const paramsString = JSON.stringify(params);

  useEffect(() => {
    // Reset state when path or params change
    setItems([]);
    setOffset(0);
    setHasMore(true);
    setTotal(0);
    fetchPage(0, true);
  }, [path, paramsString]);

  const fetchPage = async (currentOffset: number, reset: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = JSON.parse(paramsString);
      const limit = 50;
      
      const query = new URLSearchParams({
        ...queryParams,
        offset: currentOffset.toString(),
        limit: limit.toString()
      });

      const url = `${path}?${query.toString()}`;
      const data = await fetchApi<PaginatedResponse<T>>(url);

      if (data.results) {
        setItems(prev => reset ? data.results : [...prev, ...data.results]);
        setTotal(data.total);
        setOffset(currentOffset + data.results.length);
        
        if (data.results.length < limit || currentOffset + data.results.length >= data.total) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPage(offset);
    }
  };

  return { items, total, loading, error, hasMore, loadMore };
}
