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
      <div className="mx-auto max-w-7xl relative px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex flex-1 items-center justify-start">
          <Link className="flex items-center" href="/">
            <Image src="/logo.svg" width={220} height={34} alt="InsightHub" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex ml-10 space-x-8">
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, 'features')}
              className="text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              Features
            </a>
            <a
              href="#benefits"
              onClick={(e) => handleNavClick(e, 'benefits')}
              className="text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              Benefits
            </a>
            <a
              href="#faq"
              onClick={(e) => handleNavClick(e, 'faq')}
              className="text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              FAQ
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-foreground focus:outline-none">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex space-x-4 items-center">
          {user ? (
            <>
              <Button variant="secondary" asChild={true} className="mr-2">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <ProfileDropdown />
            </>
          ) : (
            <>
              <Button variant="outline" asChild={true}>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild={true} variant="secondary">
                <Link href="/signup">Sign Up Free</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border/40 py-4">
          <div className="flex flex-col space-y-4 px-4">
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, 'features')}
              className="text-foreground hover:text-blue-400 transition cursor-pointer"
            >
              Features
            </a>
            <a
              href="#benefits"
              onClick={(e) => handleNavClick(e, 'benefits')}
              className="text-foreground hover:text-blue-400 transition cursor-pointer"
            >
              Benefits
            </a>
            <a
              href="#faq"
              onClick={(e) => handleNavClick(e, 'faq')}
              className="text-foreground hover:text-blue-400 transition cursor-pointer"
            >
              FAQ
            </a>

            <div className="pt-4 flex flex-col space-y-4">
              {user ? (
                <>
                  <Button variant="secondary" asChild={true} className="w-full">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <ProfileDropdown />
                </>
              ) : (
                <>
                  <Button variant="outline" asChild={true} className="w-full">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild={true} variant="secondary" className="w-full">
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
