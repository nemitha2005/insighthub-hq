import { ReactNode } from 'react';
import { LoginGradient } from '@/components/gradients/login-gradient';
import { LoginCardGradient } from '@/components/gradients/login-card-gradient';
import '../../styles/login.css';

interface AuthCardLayoutProps {
  children: ReactNode;
  footerContent: ReactNode;
}

export function AuthCardLayout({ children, footerContent }: AuthCardLayoutProps) {
  return (
    <div>
      <LoginGradient />
      <div className="flex flex-col">
        <div className="mx-auto mt-[112px] bg-background/80 w-[343px] md:w-[488px] gap-5 flex-col rounded-lg rounded-b-none login-card-border backdrop-blur-[6px]">
          <LoginCardGradient />
          {children}
        </div>
        <div className="mx-auto w-[343px] md:w-[488px] bg-background/80 backdrop-blur-[6px] px-6 md:px-16 pt-0 py-8 gap-6 flex flex-col items-center justify-center rounded-b-lg">
          {footerContent}
        </div>
      </div>
    </div>
  );
}
