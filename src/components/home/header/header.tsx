'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface User {
  id?: string;
  email?: string;
}

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

  return (
    <nav
      className={`transition-all duration-300 sticky top-0 z-50 ${
        scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border/40' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl relative px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex flex-1 items-center justify-start">
          <Link className="flex items-center" href={'/'}>
            <Image className="w-auto block" src="/logo.png" width={129} height={20} alt="InsightHub" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex ml-10 space-x-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <Link href="#benefits" className="text-muted-foreground hover:text-foreground transition">
              Benefits
            </Link>
            <Link href="#demo" className="text-muted-foreground hover:text-foreground transition">
              Demo
            </Link>
            <Link href="#faq" className="text-muted-foreground hover:text-foreground transition">
              FAQ
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-foreground focus:outline-none">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex space-x-4">
          {user?.id ? (
            <Button variant="secondary" asChild={true}>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
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
            <Link href="#features" className="text-foreground hover:text-blue-400 transition">
              Features
            </Link>
            <Link href="#benefits" className="text-foreground hover:text-blue-400 transition">
              Benefits
            </Link>
            <Link href="#demo" className="text-foreground hover:text-blue-400 transition">
              Demo
            </Link>
            <Link href="#faq" className="text-foreground hover:text-blue-400 transition">
              FAQ
            </Link>

            <div className="pt-4 flex flex-col space-y-4">
              <Button variant="outline" asChild={true} className="w-full">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild={true} variant="secondary" className="w-full">
                <Link href="/signup">Sign Up Free</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
