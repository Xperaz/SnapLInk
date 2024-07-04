import { useState } from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await cb(options, ...args);
      setData(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { fn, data, isLoading, error };
};

export default useFetch;
