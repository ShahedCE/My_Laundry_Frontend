import { Suspense } from 'react';
import CustomerLoginClient from './CustomerLoginClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerLoginClient />
    </Suspense>
  );
}
