import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
export default function Index() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const adminToken = sessionStorage.getItem('adminToken');
    const userToken = sessionStorage.getItem('token');
    if (adminToken) {
      router.push('/admin-dashboard');
    } else if (userToken) {
      router.push('/home');
    } else {
      router.push('/home');
    }
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <Head>
        <title>ROG Store - Loading...</title>
      </Head>
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
}