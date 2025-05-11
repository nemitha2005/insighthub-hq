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
          'flex flex-col justify-center items-center gap-3 text-muted-foreground text-sm leading-[14px] py-[24px]'
        }
      >
        <div className={'flex justify-center items-center gap-2'}>
          <span className={'text-sm leading-[14px]'}>© {currentYear} InsightHub. All Rights Reserved</span>
        </div>

        <div className={'flex justify-center items-center gap-2'}>
          <span className={'text-sm leading-[14px]'}>Created by</span>
          <Link
            href={'https://www.nemithawijerathna.online'}
            target={'_blank'}
            className={'text-sm leading-[14px] font-medium text-foreground hover:text-primary transition-colors'}
          >
            <span className={'flex items-center gap-1'}>
              Nemitha Wijerathna
              <ArrowUpRight className={'h-3 w-3'} />
            </span>
          </Link>
        </div>

        <div className={'flex justify-center items-center gap-5 flex-wrap md:flex-nowrap mt-1'}>
          <Link className={'text-sm leading-[14px] opacity-70 hover:opacity-100 transition-opacity'} href={'/terms'}>
            <span className={'flex items-center gap-1'}>
              Terms of Use
              <ArrowUpRight className={'h-3 w-3'} />
            </span>
          </Link>
          <Link className={'text-sm leading-[14px] opacity-70 hover:opacity-100 transition-opacity'} href={'/privacy'}>
            <span className={'flex items-center gap-1'}>
              Privacy Policy
              <ArrowUpRight className={'h-3 w-3'} />
            </span>
          </Link>
          <Link className={'text-sm leading-[14px] opacity-70 hover:opacity-100 transition-opacity'} href={'/contact'}>
            <span className={'flex items-center gap-1'}>
              Contact
              <ArrowUpRight className={'h-3 w-3'} />
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
