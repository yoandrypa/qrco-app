import { useRef, useEffect } from 'react';

export function useDidUpdated() {
  const didUpdatedRef = useRef(false);

  useEffect(() => {
    didUpdatedRef.current = true;
  }, []);

  return didUpdatedRef.current;
}