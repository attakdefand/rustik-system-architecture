
'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Construction, DraftingCompass, Network, ImageIcon, ListChecks } from 'lucide-react';
import { architectureComponents, type ArchitectureComponent } from '@/data/architecture-data';

// Helper function for complexity badge styling
const complexityVariant = (complexityLevel: ArchitectureComponent['complexity']): 'default' | 'secondary' | 'destructive' => {
  switch (complexityLevel) {
    case 'Beginner':
      return 'default';
    case 'Intermediate':
      return 'secondary';
    case 'Advanced':
      return 'destructive';
    default:
      return 'default';
  }
};

export default function SystemVisualizerPage() {
  const [selectedTypesMap, setSelectedTypesMap] = useState<Map<string, Set<string>>>(new Map());
  const [diagramGenerated, setDiagramGenerated] = useState(false);
  const [generatedDiagramComponents, setGeneratedDiagramComponents] = useState<ArchitectureComponent[]>([]);
  const [snapshotSelectedTypesMap, setSnapshotSelectedTypesMap] = useState<Map<string, Set<string>>>(new Map());


  const handleTypeSelection = (componentId: string, type: string, isSelected: boolean) => {
    setSelectedTypesMap(prevMap => {
      const newMap = new Map(prevMap);
      const typesSet = new Set(newMap.get(componentId) || []);

      if (isSelected) {
        typesSet.add(type);
      } else {
        typesSet.delete(type);
      }

      if (typesSet.size > 0) {
        newMap.set(componentId, typesSet);
      } else {
        newMap.delete(componentId);
      }
      return newMap;
    });
    if (diagramGenerated) {
      setDiagramGenerated(false);
    }
  };

  const handleGenerateDiagram = () => {
    const currentSelectedComponents = architectureComponents.filter(comp => selectedTypesMap.has(comp.id));
    setGeneratedDiagramComponents(currentSelectedComponents);
    setSnapshotSelectedTypesMap(new Map(selectedTypesMap)); // Store a snapshot of selections for the diagram
    setDiagramGenerated(true);
  };
  
  const countSelectedComponents = () => {
    return selectedTypesMap.size;
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
            Choose Your Architectural Components & Types
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
                <CardFooter className="pt-3 pb-4 px-4 border-t bg-muted/20 flex-col items-start space-y-2">
                  <Label className="text-xs font-semibold text-foreground/70 mb-1">Select specific types:</Label>
                  {component.types && component.types.length > 0 ? (
                    component.types.map((type, index) => (
                      <div key={index} className="flex items-center space-x-2 w-full">
                        <Checkbox
                          id={`select-${component.id}-${type.replace(/\s+/g, '-').toLowerCase()}`}
                          checked={selectedTypesMap.get(component.id)?.has(type) ?? false}
                          onCheckedChange={(checked) => {
                            handleTypeSelection(component.id, type, !!checked);
                          }}
                          aria-label={`Select type ${type} for ${component.title}`}
                        />
                        <Label
                          htmlFor={`select-${component.id}-${type.replace(/\s+/g, '-').toLowerCase()}`}
                          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-primary flex-grow"
                        >
                          {type}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No specific types listed for this component.</p>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button 
              size="lg" 
              disabled={selectedTypesMap.size === 0}
              onClick={handleGenerateDiagram}
            >
              <DraftingCompass className="mr-2 h-5 w-5" />
              Generate Diagram (Conceptual)
            </Button>
            {selectedTypesMap.size > 0 && (
              <p className="text-sm text-muted-foreground mt-4">
                {countSelectedComponents()} component(s) with selected types. Click generate to see a conceptual overview.
              </p>
            )}
          </div>

          {diagramGenerated && (
            <Card className="mt-16 w-full max-w-5xl mx-auto shadow-xl rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-primary flex items-center">
                  <Network className="mr-3 h-7 w-7" />
                  Conceptual System Overview
                </CardTitle>
                <CardDescription className="pt-1">
                  Based on your selections, here's a high-level look at the chosen components and their potential roles.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-2">
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-accent flex items-center">
                    <ListChecks className="h-5 w-5 mr-2 text-accent" />
                    Selected Architectural Elements & Types:
                  </h4>
                  {generatedDiagramComponents.length > 0 ? (
                    <ul className="space-y-4 pl-2">
                      {generatedDiagramComponents.map(comp => (
                        <li key={comp.id} className="p-3 rounded-md hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                          <div className="flex items-center mb-1">
                            <comp.icon className="h-6 w-6 mr-3 text-primary flex-shrink-0" />
                            <span className="font-medium text-lg">{comp.title}</span>
                          </div>
                          {snapshotSelectedTypesMap.get(comp.id) && (snapshotSelectedTypesMap.get(comp.id)!.size > 0) && (
                            <ul className="list-disc list-inside pl-8 text-sm text-foreground/80 space-y-1 mt-2">
                              {Array.from(snapshotSelectedTypesMap.get(comp.id)!).map(type => (
                                <li key={type}>{type}</li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No components or types were selected for this diagram.</p>
                  )}
                </div>
                <Separator />
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-accent flex items-center">
                     <ImageIcon className="h-5 w-5 mr-2 text-accent" />
                    Visual Diagram Area:
                  </h4>
                  <div className="p-10 border-2 border-dashed border-border/70 rounded-lg text-center text-muted-foreground bg-muted/20">
                    <ImageIcon className="h-16 w-16 mx-auto mb-4 text-primary/40" />
                    <p className="text-lg font-medium">Conceptual Visual Diagram</p>
                    <p className="text-sm">(This area will display a dynamic diagram based on your selections - Feature in development)</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-accent flex items-center">
                    <Construction className="h-5 w-5 mr-2 text-accent" />
                    AI-Powered Interaction Analysis:
                  </h4>
                  <div className="p-6 bg-card border rounded-lg shadow-inner text-foreground/90 space-y-4">
                    <p className="font-medium">
                      An AI-powered explanation would describe potential interactions, benefits, and considerations for combining these selected components and their types.
                    </p>
                    <blockquote className="pl-4 border-l-4 border-primary/60 italic text-sm bg-primary/5 p-3 rounded-md">
                      <strong>Example:</strong> "If you've selected <strong>Anycast IP (Global Anycast)</strong>, <strong>Load Balancers (Layer-7)</strong>, and <strong>Rust App Nodes (Containerized)</strong>, a typical pattern involves Global Anycast routing users to the nearest regional PoP. Within each region, Layer-7 Load Balancers distribute HTTP/S traffic across a cluster of containerized Rust App Nodes, enabling advanced routing and efficient scaling..."
                    </blockquote>
                    <p className="text-sm text-muted-foreground text-right mt-2">(This AI-driven analysis is a future enhancement.)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-20 text-center">
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
