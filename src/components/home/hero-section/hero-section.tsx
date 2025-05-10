import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className={'mx-auto max-w-7xl px-[32px] relative flex flex-col items-center justify-between mt-16 mb-12'}>
      <div className={'text-center w-full'}>
        <h1 className={'text-[48px] leading-[48px] md:text-[80px] md:leading-[80px] tracking-[-1.6px] font-medium'}>
          Your Site Name
        </h1>
        <p className={'mt-6 text-[18px] leading-[27px] md:text-[20px] md:leading-[30px]'}>
          Your site description goes here. This is a simple template for your project.
        </p>
        <div className="mt-10">
          <Button asChild={true} variant={'secondary'} className="px-8 py-6 text-lg">
            <Link href={'/signup'}>Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
