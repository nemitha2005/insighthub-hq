'use client';

import { redirect } from 'next/navigation';

interface FormData {
  email: string;
  password: string;
}

export async function login(data: FormData) {
  console.log('Login attempt with:', data);
  redirect('/');
  return { error: false };
}

export async function signInWithGithub() {
  console.log('GitHub login clicked');
  redirect('/');
}

export async function loginAnonymously() {
  console.log('Anonymous login clicked');
  redirect('/');
}
