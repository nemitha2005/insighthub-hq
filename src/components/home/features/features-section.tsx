import { BarChart3, Search, FileText, TrendingUp, FileSearch, Globe } from 'lucide-react';

const features = [
  {
    title: 'Natural Language Querying',
    description: 'Ask questions about your business data in plain English and get instant visualizations and insights.',
    icon: <Search className="h-6 w-6" />,
  },
  {
    title: 'Automated Report Generation',
    description:
      'AI analyzes your data to identify trends and anomalies, generating comprehensive reports with actionable recommendations.',
    icon: <FileText className="h-6 w-6" />,
  },
  {
    title: 'Predictive Analytics',
    description:
      'Forecast future trends based on historical data and get AI-powered suggestions for optimal business strategies.',
    icon: <TrendingUp className="h-6 w-6" />,
  },
  {
    title: 'Document Intelligence',
    description:
      'Extract structured data from unstructured documents like invoices, receipts, and contracts for better insights.',
    icon: <FileSearch className="h-6 w-6" />,
  },
  {
    title: 'Competitive Intelligence',
    description: 'Monitor news, social media, and public financial data about competitors to stay ahead in the market.',
    icon: <Globe className="h-6 w-6" />,
  },
  {
    title: 'Interactive Dashboards',
    description:
      'Create customizable, interactive dashboards to visualize your most important business metrics in real-time.',
    icon: <BarChart3 className="h-6 w-6" />,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            InsightHub combines cutting-edge AI with business intelligence to transform how you analyze your data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-border bg-background/50 backdrop-blur-sm hover:border-ring/50 transition duration-300"
            >
              <div className="h-12 w-12 rounded-lg mb-4 flex items-center justify-center bg-background/80 border border-border">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
