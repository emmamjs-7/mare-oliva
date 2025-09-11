import { useState, useCallback } from 'react';

export default function useNavbarToggle() {
  const [expanded, setExpanded] = useState(false);
  const toggle = useCallback((isExpanded: boolean) => {
    setExpanded(isExpanded);
  }, []);

  const close = useCallback(() => setExpanded(false),
    []);

  return { expanded, toggle, close };
}


