'use client';

import { redirect } from 'next/navigation';

interface FormData {
  email: string;
  password: string;
}

// Mock login function
export async function login(data: FormData) {
  console.log('Login attempt with:', data);
  // Just redirect to home page
  redirect('/');
  return { error: false };
}

// Mock GitHub login function
export async function signInWithGithub() {
  console.log('GitHub login clicked');
  redirect('/');
}

// Mock anonymous login function
export async function loginAnonymously() {
  console.log('Anonymous login clicked');
  redirect('/');
}
