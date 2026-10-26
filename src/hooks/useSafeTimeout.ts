import { useCallback, useEffect, useRef } from 'react';

/**
 * Returns a setTimeout wrapper whose pending timers are cleared on unmount.
 * Fired timers remove themselves, so the tracking set never grows unbounded.
 */
export function useSafeTimeout() {
  const ids = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const pending = ids.current;
    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  return useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      ids.current.delete(id);
      fn();
    }, ms);
    ids.current.add(id);
  }, []);
}
