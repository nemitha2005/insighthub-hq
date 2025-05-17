import Image from 'next/image';

export function BuiltUsingTools() {
  return (
    <div className={'mx-auto max-w-7xl text-center px-4 sm:px-6 lg:px-8 mt-16 md:mt-24 mb-16 md:mb-24'}>
      <span className={'text-sm md:text-base'}>Built with</span>
      <div className={'flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6 justify-center items-center mt-6 md:mt-8'}>
        <Image
          src={'/assets/icons/logo/tailwind-logo.svg'}
          alt={'TailwindCSS logo'}
          width={150}
          height={18}
          className="sm:w-[194px] sm:h-[24px]"
        />
        <Image
          src={'/assets/icons/logo/nextjs-logo.svg'}
          alt={'Next.js logo'}
          width={90}
          height={18}
          className="sm:w-[120px] sm:h-[24px]"
        />
        <Image
          src={'/assets/icons/logo/gemini-logo.svg'}
          alt={'Gemini logo'}
          width={150}
          height={24}
          className="sm:w-[194px] sm:h-[32px]"
        />
        <Image
          src={'/assets/icons/logo/shadcn-logo.svg'}
          alt={'Shadcn logo'}
          width={105}
          height={24}
          className="sm:w-[137px] sm:h-[32px]"
        />
        <Image
          src={'/assets/icons/logo/firebase-logo.svg'}
          alt={'Firebase logo'}
          width={105}
          height={24}
          className="sm:w-[137px] sm:h-[32px]"
        />
      </div>
    </div>
  );
}
