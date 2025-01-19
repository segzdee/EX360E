import { LucideIcon } from 'lucide-react';
import { FeatureCard } from '@/components/feature-card';

interface Feature {
  title: string;
  icon: LucideIcon;
  items: string[];
}

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <feature.icon className="w-6 h-6 mr-2" />
          {feature.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-2">
          {feature.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function GeneralFeatures() {
  return (
    <section className="w-full max-w-4xl mx-auto space-y-6">
      <header className="text-center">
        <h2 className="text-2xl font-bold mb-2">General Platform Features</h2>
        <p className="text-muted-foreground">Comprehensive tools and capabilities for all users</p>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} />
        ))}
      </div>
    </section>
  );
}