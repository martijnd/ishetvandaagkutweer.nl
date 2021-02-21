import '../styles/globals.css'
import { useRouter } from 'next/router';
import * as gtag from '@/lib/gtag';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  return <Component {...pageProps} />
}

export default MyApp
