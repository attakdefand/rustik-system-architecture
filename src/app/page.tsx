
'use client';

import { useState, useRef } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { architectureComponents, type ArchitectureComponent } from '@/data/architecture-data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ArchitectureBlock from '@/components/architecture-block';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

interface CategorizedComponents {
  category: string;
  components: ArchitectureComponent[];
}

export default function Home() {
  const [hoverMessage, setHoverMessage] = useState<string | null>(null);
  const hoverMessageTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerHoverMessage = (message: string) => {
    if (hoverMessageTimerRef.current) {
      clearTimeout(hoverMessageTimerRef.current);
    }
    setHoverMessage(message);
    hoverMessageTimerRef.current = setTimeout(() => {
      setHoverMessage(null);
    }, 5000);
  };

  const categorizedComponents: CategorizedComponents[] = [
    {
      category: 'Networking & Connectivity',
      components: architectureComponents
        .filter(c => ['anycast-ip', 'load-balancers', 'api-gateway', 'network-infra-strategies'].includes(c.id))
        .sort((a, b) => a.title.localeCompare(b.title)),
    },
    {
      category: 'Application & Compute Logic',
      components: architectureComponents
        .filter(c => ['rust-app-nodes', 'microservices-architecture', 'async-io', 'per-core-socket', 'api-design-styles', 'app-design-principles'].includes(c.id))
        .sort((a, b) => a.title.localeCompare(b.title)),
    },
    {
      category: 'Data Management & Storage',
      components: architectureComponents
        .filter(c => ['database-strategies', 'caching-strategies', 'shared-state-data-plane'].includes(c.id))
        .sort((a, b) => a.title.localeCompare(b.title)),
    },
    {
      category: 'Operations, Scaling & Security',
      components: architectureComponents
        .filter(c => ['service-discovery-control-plane', 'observability-ops', 'deployment-cicd', 'autoscaling-resilience', 'security-architecture-principles', 'cost-management'].includes(c.id))
        .sort((a, b) => a.title.localeCompare(b.title)),
    },
  ];

  const allCategorizedComponentIds = categorizedComponents.flatMap(cat => cat.components.map(comp => comp.id));
  const uncategorizedComponents = architectureComponents
    .filter(c => !allCategorizedComponentIds.includes(c.id))
    .sort((a, b) => a.title.localeCompare(b.title));

  if (uncategorizedComponents.length > 0) {
    categorizedComponents.push({
        category: 'Other Components',
        components: uncategorizedComponents
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-10 sm:py-16">
        <div 
          className="text-center mb-12 sm:mb-16 group"
          onMouseEnter={() => triggerHoverMessage("Welcome to Rustik! Discover the building blocks of modern, high-performance systems.")}
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-gray-800 dark:text-gray-100 group-hover:text-accent transition-colors">
            The Backbone of <span className="text-primary">Modern Systems</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto group-hover:text-accent-foreground/80 transition-colors">
            Discover the core architectural components that empower robust, high-performance applications. Each element detailed below is a vital piece in constructing globally distributed and resilient services. Explore categories to learn more.
          </p>
        </div>

        <Card 
          className="my-12 shadow-xl rounded-xl overflow-hidden bg-card group"
          onMouseEnter={() => triggerHoverMessage("New to system design? Start with the System Visualizer to explore component interactions!")}
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 w-full p-6 md:p-8">
              <Image
                src="https://placehold.co/600x400.png"
                alt="System Architecture Conceptual Image"
                width={600}
                height={400}
                className="rounded-lg object-cover shadow-md w-full"
                data-ai-hint="network abstract"
              />
            </div>
            <div className="md:w-1/2 w-full p-6 md:p-8 flex flex-col justify-center">
              <CardHeader className="px-0 pb-4 pt-0">
                <CardTitle className="text-2xl lg:text-3xl font-bold text-primary group-hover:text-accent transition-colors">New to System Architecture?</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <p className="text-muted-foreground mb-6 text-base lg:text-lg group-hover:text-accent-foreground/80 transition-colors">
                  Feeling unsure where to begin? Dive into our System Visualizer to interactively explore components and see how they connect. Start building your conceptual understanding today!
                </p>
                <Button 
                  asChild 
                  size="lg" 
                  className="w-full sm:w-auto group-hover:bg-accent group-hover:text-accent-foreground"
                  onMouseEnter={() => triggerHoverMessage("Go to the System Visualizer page.")}
                >
                  <Link href="/system-visualizer">Explore the Visualizer</Link>
                </Button>
              </CardContent>
            </div>
          </div>
        </Card>
        
        <Accordion type="multiple" className="w-full max-w-6xl mx-auto space-y-6">
          {categorizedComponents.map((categoryGroup, index) => (
            categoryGroup.components.length > 0 && (
              <AccordionItem value={`category-${index}`} key={categoryGroup.category} className="border border-border/70 rounded-xl shadow-lg overflow-hidden bg-card">
                <AccordionTrigger 
                  className="px-6 py-4 text-2xl font-semibold hover:no-underline bg-muted/30 hover:bg-muted/50 data-[state=open]:border-b data-[state=open]:border-border/70 group"
                  onMouseEnter={() => triggerHoverMessage(`Explore components in the ${categoryGroup.category} category.`)}
                >
                  <span className="text-gray-700 dark:text-gray-200 text-left group-hover:text-accent transition-colors">{categoryGroup.category}</span>
                </AccordionTrigger>
                <AccordionContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {categoryGroup.components.map((component) => (
                      <div 
                        key={component.id}
                        onMouseEnter={() => triggerHoverMessage(`${component.title}: ${component.eli5Summary}`)}
                        className="h-full" // Ensure div takes full height for consistent hover area if cards have different heights
                      >
                        <ArchitectureBlock {...component} />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          ))}
        </Accordion>
      </main>
      {hoverMessage && (
        <div 
          key={Date.now()}
          className="fixed bottom-5 right-5 p-4 bg-accent text-accent-foreground rounded-lg shadow-2xl z-[100] w-auto max-w-md animate-fade-in-out-message border-2 border-primary/50"
        >
          <div className="flex items-center">
            <div className="flex space-x-1.5 mr-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400 animate-ping opacity-80" style={{animationDuration: '1.5s'}}></span>
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-300 animate-ping opacity-80" style={{animationDelay: '0.25s', animationDuration: '1.5s'}}></span>
              <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-ping opacity-80" style={{animationDelay: '0.5s', animationDuration: '1.5s'}}></span>
            </div>
            <p className="text-sm">{hoverMessage}</p>
          </div>
        </div>
      )}
      <footer className="py-8 text-center text-muted-foreground border-t border-border/50 mt-16">
        <p>&copy; {new Date().getFullYear()} Rustik. Illustrating powerful backend architectures.</p>
      </footer>
    </div>
  );
}
