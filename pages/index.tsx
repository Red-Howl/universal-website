import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/shop');
  }, [router]);

  return (
    <>
      <Head>
        <title>Red Howl | Hand Painted Fashion & Kalamkari | Premium Clothing</title>
        <meta name="description" content="Discover Red Howl's exclusive collection of hand-painted fashion, Kalamkari sarees, and premium clothing. Where art meets fashion with authentic Indian craftsmanship." />
        <meta name="google-site-verification" content="g641qoDYIn4W2lsXVPnmNV666txLhQL0EFiHqxuJTAU" />
        <link rel="canonical" href="https://redhowlcollections.netlify.app/" />
      </Head>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--gradient-light)' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Red Howl</h1>
          <p>Redirecting to our collection...</p>
        </div>
      </div>
    </>
  );
}