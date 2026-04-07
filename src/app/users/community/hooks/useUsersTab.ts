import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export function useUsersTab() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab');
  const [tab, setTab] = useState(tabParam ? parseInt(tabParam) : 0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip on first render — URL already reflects the initial tab from SSR
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const currentUrlTab = parseInt(searchParams.get('tab') ?? '0');
    // Only push if the URL doesn't already reflect the current tab
    if (currentUrlTab === tab) return;

    const params = new URLSearchParams(searchParams.toString());
    if (tab === 0) {
      params.delete('tab');
    } else {
      params.set('tab', tab.toString());
    }

    // Use replace instead of push to avoid unnecessary history entries
    router.replace(`/users/community?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return {
    tab,
    setTab,
  };
}
