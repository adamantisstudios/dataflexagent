'use client';

import dynamic from 'next/dynamic';

const CheckoutClientPage = dynamic(() => import('./CheckoutClientPage'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function ClientWrapper() {
  return <CheckoutClientPage />;
}
