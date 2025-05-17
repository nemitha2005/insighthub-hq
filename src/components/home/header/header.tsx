'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { scrollToElement } from '@/lib/scroll-utils';
import { User } from 'firebase/auth';
import { ProfileDropdown } from '@/components/dashboard/profile-dropdown';

interface Props {
  user: User | null;
}

export default function Header({ user }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToElement(id);

    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav
      className={`transition-all duration-300 sticky top-0 z-50 ${
        scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border/40' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl relative px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between">
        <div className="flex flex-1 items-center justify-start">
          <Link className="flex items-center" href="/">
            <Image src="/logo.svg" width={180} height={28} alt="InsightHub" className="md:w-[220px] md:h-[34px]" />
          </Link>

          <div className="hidden lg:flex ml-8 xl:ml-10 space-x-6 xl:space-x-8">
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, 'features')}
              className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              Features
            </a>
            <a
              href="#benefits"
              onClick={(e) => handleNavClick(e, 'benefits')}
              className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              Benefits
            </a>
            <a
              href="#faq"
              onClick={(e) => handleNavClick(e, 'faq')}
              className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              FAQ
            </a>
          </div>
        </div>

        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-foreground focus:outline-none p-2 -mr-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="hidden lg:flex space-x-3 xl:space-x-4 items-center">
          {user ? (
            <>
              <Button variant="secondary" asChild={true} className="text-sm lg:text-base">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <ProfileDropdown />
            </>
          ) : (
            <>
              <Button variant="outline" asChild={true} className="text-sm lg:text-base">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild={true} variant="secondary" className="text-sm lg:text-base">
                <Link href="/signup">Sign Up Free</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border/40 py-4 px-4">
          <div className="flex flex-col space-y-4">
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, 'features')}
              className="text-base font-medium text-foreground hover:text-blue-400 transition cursor-pointer py-2"
            >
              Features
            </a>
            <a
              href="#benefits"
              onClick={(e) => handleNavClick(e, 'benefits')}
              className="text-base font-medium text-foreground hover:text-blue-400 transition cursor-pointer py-2"
            >
              Benefits
            </a>
            <a
              href="#faq"
              onClick={(e) => handleNavClick(e, 'faq')}
              className="text-base font-medium text-foreground hover:text-blue-400 transition cursor-pointer py-2"
            >
              FAQ
            </a>

            <div className="pt-4 border-t border-border/40 flex flex-col space-y-3">
              {user ? (
                <div className="flex flex-col space-y-3">
                  <Button variant="secondary" asChild={true} className="w-full text-base">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <div className="flex justify-center">
                    <ProfileDropdown />
                  </div>
                </div>
              ) : (
                <>
                  <Button variant="outline" asChild={true} className="w-full text-base">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild={true} variant="secondary" className="w-full text-base">
                    <Link href="/signup">Sign Up Free</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
