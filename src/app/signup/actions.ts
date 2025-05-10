'use client';

import { redirect } from 'next/navigation';

interface FormData {
  email: string;
  password: string;
}

// Mock signup function
export async function signup(data: FormData) {
  console.log('Signup attempt with:', data);
  // Just redirect to home page
  redirect('/');
  return { error: false };
}
