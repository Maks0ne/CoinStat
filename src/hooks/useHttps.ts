import { useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';


interface FetchHookResponse<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
  fetchData: () => Promise<void>;
}

export const useHttp = <T>(url: string): FetchHookResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse<T> = await axios.get<T>(url)
      setData(response.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error as AxiosError);
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return { fetchData, data, loading, error };
};
