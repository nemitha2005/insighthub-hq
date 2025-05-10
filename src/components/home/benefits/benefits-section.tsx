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
    <section id="benefits" className="py-20 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose InsightHub?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              InsightHub transforms how businesses analyze data, making complex analysis simple and accessible to
              everyone, not just data scientists.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-foreground mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square w-full max-w-lg mx-auto rounded-lg overflow-hidden border border-border shadow-lg">
              {/* Placeholder for dashboard visualization */}
              <div className="h-full w-full bg-background flex items-center justify-center">
                <span className="text-xl text-muted-foreground">Dashboard Visualization</span>
              </div>
            </div>

            {/* Decorative elements that match the theme */}
            <div className="absolute -top-6 -right-6 h-20 w-20 bg-border/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 h-32 w-32 bg-border/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
