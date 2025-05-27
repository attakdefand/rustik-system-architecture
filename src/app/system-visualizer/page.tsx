
'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Construction, Sitemap } from 'lucide-react';
import { architectureComponents, type ArchitectureComponent } from '@/data/architecture-data';

// Helper function for complexity badge styling (similar to ArchitectureBlock)
const complexityVariant = (complexityLevel: ArchitectureComponent['complexity']): 'default' | 'secondary' | 'destructive' => {
  switch (complexityLevel) {
    case 'Beginner':
      return 'default'; // default usually is primary color
    case 'Intermediate':
      return 'secondary';
    case 'Advanced':
      return 'destructive';
    default:
      return 'default';
  }
};

export default function SystemVisualizerPage() {
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set());

  const handleComponentSelect = (componentId: string, isSelected: boolean) => {
    setSelectedComponents(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (isSelected) {
        newSelected.add(componentId);
      } else {
        newSelected.delete(componentId);
      }
      return newSelected;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-10 sm:py-16 flex flex-col items-center">
        <div className="text-center w-full max-w-3xl">
          <Construction className="h-24 w-24 text-primary mb-8 mx-auto" />
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 text-gray-800 dark:text-gray-100">
            System Visualizer - Coming Soon!
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            This is where the System Visualizer will live. Imagine a tool where you can select architectural components and see them come together in a conceptual diagram, helping you understand potential system structures.
          </p>
          <div className="space-y-4 mb-12 bg-card p-6 rounded-lg shadow">
              <p className="text-md text-foreground/90 font-semibold">
                  We're envisioning features like:
              </p>
              <ul className="list-disc list-inside text-left max-w-md mx-auto text-foreground/70 space-y-2">
                  <li>Selecting components from our library.</li>
                  <li>Viewing a dynamic, high-level diagram of chosen components.</li>
                  <li>Getting AI-powered explanations of how selected components might interact.</li>
                  <li>Exploring common architectural patterns.</li>
              </ul>
          </div>
        </div>

        <div className="mt-8 w-full max-w-6xl">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 text-center text-gray-800 dark:text-gray-100">
            Choose Your Architectural Components
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {architectureComponents.map((component) => (
              <Card key={component.id} className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden">
                <div>
                  <CardHeader className="flex flex-row items-start space-x-3 pb-2 pt-4 px-4">
                    <component.icon className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-grow">
                      <CardTitle className="text-lg font-semibold leading-tight">{component.title}</CardTitle>
                      <Badge variant={complexityVariant(component.complexity)} className="mt-1 text-xs">
                        {component.complexity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-1 pb-3 px-4 text-sm text-foreground/80">
                    <p className="line-clamp-3">
                      {component.eli5Details || "No detailed explanation available."}
                    </p>
                  </CardContent>
                </div>
                <CardFooter className="pt-3 pb-4 px-4 border-t bg-muted/20">
                  <div className="flex items-center space-x-2 w-full">
                    <Checkbox
                      id={`select-${component.id}`}
                      checked={selectedComponents.has(component.id)}
                      onCheckedChange={(checked) => {
                        handleComponentSelect(component.id, !!checked);
                      }}
                      aria-label={`Select ${component.title}`}
                    />
                    <Label
                      htmlFor={`select-${component.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-primary flex-grow"
                    >
                      Select to include
                    </Label>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button size="lg" disabled>
              <Sitemap className="mr-2 h-5 w-5" />
              Generate Diagram (Conceptual)
            </Button>
            {selectedComponents.size > 0 && (
              <p className="text-sm text-muted-foreground mt-4">
                Selected {selectedComponents.size} component(s).
              </p>
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button asChild variant="outline">
            <Link href="/system-builder-challenges">Learn about System Building Challenges</Link>
          </Button>
        </div>
      </main>
      <footer className="py-8 text-center text-muted-foreground border-t border-border/50 mt-16">
        <p>&copy; {new Date().getFullYear()} Rustik. Visualizing the future of architecture.</p>
      </footer>
    </div>
  );
}
