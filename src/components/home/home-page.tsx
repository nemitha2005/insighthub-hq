'use client';

import { useState } from 'react';
import { useUserInfo } from '@/hooks/useAuth';
import '../../styles/home-page.css';
import Header from '@/components/home/header/header';
import { HeroSection } from '@/components/home/hero-section/hero-section';
import { HomePageBackground } from '@/components/gradients/home-page-background';
import { Footer } from '@/components/home/footer/footer';

export function HomePage() {
  const { user } = useUserInfo();

  return (
    <>
      <div>
        <HomePageBackground />
        <Header user={user} />
        <HeroSection />
        <Footer />
      </div>
    </>
  );
}
