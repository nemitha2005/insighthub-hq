'use client';

import { redirect } from 'next/navigation';

interface FormData {
  email: string;
  password: string;
}

interface SignupResponse {
  error: boolean;
  message?: string;
}

export async function signup(data: FormData): Promise<SignupResponse> {
  console.log('Signup attempt with:', data);
  redirect('/');
  return { error: false };
}