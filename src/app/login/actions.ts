'use client';

import { redirect } from 'next/navigation';

interface FormData {
  email: string;
  password: string;
}

interface LoginResponse {
  error: boolean;
  message?: string;
}

export async function login(data: FormData): Promise<LoginResponse> {
  console.log('Login attempt with:', data);
  redirect('/');
  return { error: false };
}

export async function signInWithGithub(): Promise<LoginResponse> {
  console.log('GitHub login clicked');
  redirect('/');
  return { error: false };
}

export async function loginAnonymously(): Promise<LoginResponse> {
  console.log('Anonymous login clicked');
  redirect('/');
  return { error: false };
}