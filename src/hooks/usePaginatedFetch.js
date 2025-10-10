import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook reutilizable para paginación y fetch de datos.
 * @param {Function} fetcher - Función que recibe (page, limit, filters) y retorna una promesa con la data.
 * @param {Object} initialFilters - Filtros iniciales.
 * @param {number} initialLimit - Límite de items por página.
 */
export function usePaginatedFetch(fetcher, initialFilters = {}, initialLimit = 10) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [filters, setFilters] = useState(initialFilters);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Referencia para almacenar los últimos parámetros usados
  const lastParamsRef = useRef(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const fetchPage = useCallback(async (page = 1, customLimit = limit, customFilters = filters, force = false) => {
    // Comparar con los últimos parámetros para evitar llamadas duplicadas
    const currentParams = { page, limit: customLimit, filters: customFilters };
    const lastParams = lastParamsRef.current;
    
    // Verificar si los parámetros son exactamente los mismos (solo si no es forzado)
    const isSameParams = !force && lastParams && 
      currentParams.page === lastParams.page &&
      currentParams.limit === lastParams.limit &&
      JSON.stringify(currentParams.filters) === JSON.stringify(lastParams.filters);
    
    if (isSameParams) {
      return; // No hacer la llamada si los parámetros son los mismos y no es forzado
    }
    
    // Actualizar los últimos parámetros
    lastParamsRef.current = currentParams;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetcherRef.current(page, customLimit, customFilters);
      setData(response.data);
      setPagination(response.pagination || {});
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []); // Sin dependencias para evitar recreaciones

  // Fetch inicial y cuando cambian filtros o limit
  useEffect(() => {
    fetchPage(1, limit, filters);
  }, [filters, limit, fetchPage]);

  const changePage = useCallback((page) => {
    fetchPage(page, limit, filters);
  }, [fetchPage, limit, filters]);

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const refetch = useCallback(() => {
    fetchPage(1, limit, filters);
  }, [fetchPage, limit, filters]);

  // Nueva función para forzar la actualización sin considerar parámetros anteriores
  const forceRefetch = useCallback(() => {
    fetchPage(pagination.current_page, limit, filters, true);
  }, [fetchPage, limit, filters, pagination.current_page]);

  return {
    data,
    pagination,
    loading,
    error,
    fetchPage: changePage,
    setLimit: changeLimit,
    setFilters: updateFilters,
    refetch,
    forceRefetch,
    filters,
    limit
  };
} 