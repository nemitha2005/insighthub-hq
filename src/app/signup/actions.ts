// src/app/signup/actions.ts
'use client';

import { redirect } from 'next/navigation';

interface FormData {
  email: string;
  password: string;
}

// Add a response type to ensure type safety
interface SignupResponse {
  error: boolean;
  message?: string;
}

// Mock signup function
export async function signup(data: FormData): Promise<SignupResponse> {
  console.log('Signup attempt with:', data);
  // Just redirect to home page
  redirect('/');
  // This is technically unreachable due to redirect
  return { error: false };
}