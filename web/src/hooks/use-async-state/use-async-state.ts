import { useState, useEffect } from 'react';

export const useAsyncState = <T>(
  initialState: () => Promise<T>
): [T | null, boolean] => {
  const [state, setState] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await initialState();
        setState(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [initialState]);

  return [state, loading];
};
