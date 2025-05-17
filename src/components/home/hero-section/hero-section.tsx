import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center pt-6 md:pt-10 pb-12 md:pb-20 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 md:px-4 md:py-1.5 mb-4 md:mb-6 bg-blue-500/10 backdrop-blur-sm rounded-full">
            <span className="text-blue-400 text-xs md:text-sm font-medium">
              Business Intelligence Reimagined with AI
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-tight px-2">
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Turn Business Data Into
              <br />
              Actionable Insights
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-xl lg:text-2xl text-muted-foreground mb-6 md:mb-10 max-w-3xl mx-auto px-4">
            InsightHub uses AI to analyze your business data, identify trends, and provide intelligent recommendations
            to drive growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4">
            {!user ? (
              <>
                <Button
                  asChild={true}
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-6 text-base md:text-lg"
                >
                  <Link href="/signup">Sign Up Free</Link>
                </Button>
                <Button
                  asChild={true}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-6 text-base md:text-lg group"
                >
                  <Link href="/login" className="flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                  </Link>
                </Button>
              </>
            ) : (
              <Button
                asChild={true}
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-6 text-base md:text-lg group"
              >
                <Link href="/dashboard" className="flex items-center">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-border via-muted-foreground to-border rounded-full opacity-40"></div>
    </section>
  );
}
