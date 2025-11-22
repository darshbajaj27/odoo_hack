import { useState, useCallback, useEffect } from 'react'

interface UseAPIOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

interface UseAPIState {
  data: any
  loading: boolean
  error: Error | null
}

/**
 * Custom hook for making API calls with loading and error handling
 */
export function useAPI() {
  const [state, setState] = useState<UseAPIState>({
    data: null,
    loading: false,
    error: null,
  })

  const call = useCallback(
    async (apiFunction: () => Promise<any>, options?: UseAPIOptions) => {
      setState({ data: null, loading: true, error: null })

      try {
        const data = await apiFunction()
        setState({ data, loading: false, error: null })
        options?.onSuccess?.(data)
        return data
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        setState({ data: null, loading: false, error: err })
        options?.onError?.(err)
        throw err
      }
    },
    []
  )

  return { ...state, call }
}

/**
 * Custom hook for fetching data on mount
 */
export function useFetchAPI(apiFunction: () => Promise<any>, deps: any[] = []) {
  const [state, setState] = useState<UseAPIState>({
    data: null,
    loading: true,
    error: null,
  })

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }))

    try {
      const data = await apiFunction()
      setState({ data, loading: false, error: null })
      return data
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      setState({ data: null, loading: false, error: err })
      throw err
    }
  }, deps)

  // Fetch on mount
  useEffect(() => {
    refetch()
  }, deps)

  return { ...state, refetch }
}
