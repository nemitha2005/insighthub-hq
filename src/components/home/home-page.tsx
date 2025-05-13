'use client';

import { useAuth } from '@/contexts/AuthContext';
import '../../styles/home-page.css';
import Header from '@/components/home/header/header';
import { HeroSection } from '@/components/home/hero-section/hero-section';
import { FeaturesSection } from '@/components/home/features/features-section';
import { BenefitsSection } from '@/components/home/benefits/benefits-section';
import { FaqSection } from '@/components/home/faq/faq-section';
import { HomePageBackground } from '@/components/gradients/home-page-background';
import { Footer } from '@/components/home/footer/footer';

export function HomePage() {
  const { user, loading } = useAuth();

  return (
    <>
      <div>
        <HomePageBackground />
        <Header user={loading ? null : user} />
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
        <FaqSection />
        <Footer />
      </div>
    </>
  );
}
