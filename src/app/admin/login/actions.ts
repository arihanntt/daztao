'use server';

import { cookies } from 'next/headers';

export async function setAdminCookie(password: string) {
  // Check against the env variable
  if (password === process.env.ADMIN_PASSWORD) {
    // Set a secure cookie
    (await cookies()).set('daztao_admin_session', 'true', {
      httpOnly: true, // JavaScript cannot read this (security feature)
      secure: process.env.NODE_ENV === 'production', // SSL only in production
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return true;
  }
  return false;
}