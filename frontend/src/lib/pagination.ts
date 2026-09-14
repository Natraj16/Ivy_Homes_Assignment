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
  const [page, setPage] = useState(1);
  const limit = 20;

  // We stringify params to use as dependency array
  const paramsString = JSON.stringify(params);

  useEffect(() => {
    // Reset page to 1 when filters change
    setPage(1);
  }, [path, paramsString]);

  useEffect(() => {
    let active = true;

    const fetchPage = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = JSON.parse(paramsString);
        
        // Since the actual API uses 'offset' instead of 'page', we calculate it.
        const offset = (page - 1) * limit;
        
        const query = new URLSearchParams({
          ...queryParams,
          offset: offset.toString(),
          limit: limit.toString()
        });

        const url = `${path}?${query.toString()}`;
        const data = await fetchApi<PaginatedResponse<T>>(url);

        if (active) {
          if (data.results) {
            setItems(data.results);
            setTotal(data.total);
          } else {
            setItems([]);
            setTotal(0);
          }
        }
      } catch (err: any) {
        if (active) setError(err.message || 'Failed to load data');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPage();

    return () => { active = false; };
  }, [path, paramsString, page]);

  return { items, total, loading, error, page, setPage, limit };
}
