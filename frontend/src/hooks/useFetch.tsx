import { useState } from 'react';
import useToken from './useToken';

export default function useFetch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getToken } = useToken();

  const fetchData = async (url: string, method: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: getToken('access') as string,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, fetchData };
}
