import { CheckCircle } from 'lucide-react';

const benefits = [
  'Save hours of manual data analysis time',
  'Discover insights you might have missed',
  'Make data-driven decisions with confidence',
  'Predict market trends before your competitors',
  'Automate report generation and distribution',
  'Understand complex data through visualizations',
];

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 px-4 lg:px-0">
              Why Choose InsightHub?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 px-4 lg:px-0">
              InsightHub transforms how businesses analyze data, making complex analysis simple and accessible to
              everyone, not just data scientists.
            </p>

            <div className="space-y-3 md:space-y-4 px-4 lg:px-0">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-foreground mr-2 md:mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-base md:text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="aspect-square w-full max-w-lg mx-auto rounded-lg overflow-hidden border border-border shadow-lg">
              <div className="h-full w-full bg-background flex items-center justify-center">
                <span className="text-lg md:text-xl text-muted-foreground">Dashboard Visualization</span>
              </div>
            </div>

            <div className="absolute -top-3 -right-3 md:-top-6 md:-right-6 h-12 w-12 md:h-20 md:w-20 bg-border/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 h-16 w-16 md:h-32 md:w-32 bg-border/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
