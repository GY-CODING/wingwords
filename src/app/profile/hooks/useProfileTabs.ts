import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function useProfileTabs() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam !== null) {
      const tabIndex = parseInt(tabParam, 10);
      if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex <= 5) {
        setTab(tabIndex);
      }
    }
  }, [searchParams]);

  return {
    tab,
    setTab,
  };
}
