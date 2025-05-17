import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { ArrowUpRight } from 'lucide-react';

export function PoweredByPaddle() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Separator className={'footer-border'} />
      <div
        className={
          'flex flex-col justify-center items-center gap-2 md:gap-3 text-muted-foreground text-xs md:text-sm leading-[14px] py-6 md:py-[24px] px-4'
        }
      >
        <div className={'flex justify-center items-center gap-2 text-center'}>
          <span className={'text-xs md:text-sm leading-[14px]'}>© {currentYear} InsightHub. All Rights Reserved</span>
        </div>

        <div className={'flex justify-center items-center gap-2 text-center'}>
          <span className={'text-xs md:text-sm leading-[14px]'}>Created by</span>
          <Link
            href={'https://www.nemithawijerathna.online'}
            target={'_blank'}
            rel={'noopener noreferrer'}
            className={
              'text-xs md:text-sm leading-[14px] font-medium text-foreground hover:text-primary transition-colors'
            }
          >
            <span className={'flex items-center gap-1'}>
              Nemitha Wijerathna
              <ArrowUpRight className={'h-3 w-3'} />
            </span>
          </Link>
        </div>

        <div className={'flex justify-center items-center gap-3 md:gap-5 flex-wrap mt-1 text-center'}>
          <Link
            className={'text-xs md:text-sm leading-[14px] opacity-70 hover:opacity-100 transition-opacity'}
            href={'/terms'}
          >
            <span className={'flex items-center gap-1'}>
              Terms of Use
              <ArrowUpRight className={'h-3 w-3'} />
            </span>
          </Link>
          <Link
            className={'text-xs md:text-sm leading-[14px] opacity-70 hover:opacity-100 transition-opacity'}
            href={'/privacy'}
          >
            <span className={'flex items-center gap-1'}>
              Privacy Policy
              <ArrowUpRight className={'h-3 w-3'} />
            </span>
          </Link>
          <a
            className={'text-xs md:text-sm leading-[14px] opacity-70 hover:opacity-100 transition-opacity'}
            href={'mailto:nemithan05@gmail.com?subject=InsightHub - Contact Inquiry'}
          >
            <span className={'flex items-center gap-1'}>
              Contact
              <ArrowUpRight className={'h-3 w-3'} />
            </span>
          </a>
        </div>
      </div>
    </>
  );
}
