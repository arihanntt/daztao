'use client';

import { SessionProvider } from 'next-auth/react';

// Thin client wrapper required so SessionProvider (a client component)
// can be imported from the Server Component layout.tsx.
export default function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
