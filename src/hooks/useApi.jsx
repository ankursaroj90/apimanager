import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../services/api';
import toast from 'react-hot-toast';

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    immediate = true,
    onSuccess,
    onError,
    transform,
    dependencies = []
  } = options;

  const execute = useCallback(async (requestOptions = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest.get(url, requestOptions);
      const result = transform ? transform(response.data) : response.data;
      
      setData(result);
      
      if (onSuccess) {
        onSuccess(result, response);
      }
      
      return result;
    } catch (err) {
      setError(err);
      
      if (onError) {
        onError(err);
      } else {
        toast.error(err.message || 'An error occurred');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, transform, onSuccess, onError]);

  const mutate = useCallback(async (mutationFn, optimisticData) => {
    if (optimisticData) {
      setData(optimisticData);
    }
    
    try {
      const result = await mutationFn();
      await execute(); // Refetch data
      return result;
    } catch (err) {
      if (optimisticData) {
        setData(data); // Revert optimistic update
      }
      throw err;
    }
  }, [execute, data]);

  const refresh = useCallback(() => {
    return execute();
  }, [execute]);

  useEffect(() => {
    if (immediate && url) {
      execute();
    }
  }, [immediate, execute, ...dependencies]);

  return {
    data,
    loading,
    error,
    execute,
    mutate,
    refresh
  };
};

export const useMutation = (mutationFn, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const { onSuccess, onError, onSettled } = options;

  const mutate = useCallback(async (variables) => {
    try {
      setLoading(true);
      setError(null);

      const result = await mutationFn(variables);
      setData(result);

      if (onSuccess) {
        onSuccess(result, variables);
      }

      return result;
    } catch (err) {
      setError(err);
      
      if (onError) {
        onError(err, variables);
      }
      
      throw err;
    } finally {
      setLoading(false);
      
      if (onSettled) {
        onSettled(data, error);
      }
    }
  }, [mutationFn, onSuccess, onError, onSettled, data, error]);

  return {
    mutate,
    loading,
    error,
    data,
    reset: () => {
      setData(null);
      setError(null);
      setLoading(false);
    }
  };
};

export default useApi;