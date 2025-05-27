
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/app-header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DraftingCompass, Network, ImageIcon, ListChecks, BrainCircuit, AlertTriangle, Scaling } from 'lucide-react';
import { architectureComponents, type ArchitectureComponent, type TypeDefinition } from '@/data/architecture-data';
import { analyzeSystem, type AnalyzeSystemInput } from '@/ai/flows/analyze-system-flow';
import { Skeleton } from '@/components/ui/skeleton';

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
  const router = useRouter();
  const [selectedTypesMap, setSelectedTypesMap] = useState<Map<string, Set<string>>>(new Map());
  const [diagramGenerated, setDiagramGenerated] = useState(false);
  const [generatedDiagramComponents, setGeneratedDiagramComponents] = useState<ArchitectureComponent[]>([]);
  const [snapshotSelectedTypesMap, setSnapshotSelectedTypesMap] = useState<Map<string, Set<string>>>(new Map());

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);


  const handleTypeSelection = (componentId: string, typeName: string, isSelected: boolean) => {
    setSelectedTypesMap(prevMap => {
      const newMap = new Map(prevMap);
      const typesSet = new Set(newMap.get(componentId) || []);

      if (isSelected) {
        typesSet.add(typeName);
      } else {
        typesSet.delete(typeName);
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
      setAiAnalysis(null);
      setAnalysisError(null);
    }
  };

  const getFlowInput = (): AnalyzeSystemInput => {
    const currentSelectedComponents = architectureComponents.filter(comp => selectedTypesMap.has(comp.id));
    return {
      components: currentSelectedComponents.map(comp => ({
        componentTitle: comp.title,
        selectedTypes: Array.from(selectedTypesMap.get(comp.id) || []),
      })),
    };
  };

  const handleGenerateDiagramAndAnalysis = async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    setAnalysisError(null);

    const flowInput = getFlowInput();
    setGeneratedDiagramComponents(architectureComponents.filter(comp => selectedTypesMap.has(comp.id)));
    setSnapshotSelectedTypesMap(new Map(selectedTypesMap));
    setDiagramGenerated(true);

    try {
      const result = await analyzeSystem(flowInput);
      setAiAnalysis(result.analysis);
    } catch (error) {
      console.error("AI Analysis Error:", error);
      setAnalysisError(error instanceof Error ? error.message : "An unknown error occurred during AI analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeScalingPotential = () => {
    const flowInput = getFlowInput();
    if (flowInput.components.length === 0) {
      // Optionally, show a toast or alert if nothing is selected
      return;
    }
    const selectionString = encodeURIComponent(JSON.stringify(flowInput));
    router.push(`/capacity-analyzer?selection=${selectionString}`);
  };
  
  const countSelectedComponents = () => {
    return selectedTypesMap.size;
  };
  
  const countSelectedTypes = () => {
    let count = 0;
    selectedTypesMap.forEach(typesSet => {
      count += typesSet.size;
    });
    return count;
  };

  constisDisabled = countSelectedTypes() === 0 || isAnalyzing;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-10 sm:py-16 flex flex-col items-center">
        <div className="text-center w-full max-w-3xl">
          <DraftingCompass className="h-24 w-24 text-primary mb-8 mx-auto" />
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 text-gray-800 dark:text-gray-100">
            System Visualizer
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Select architectural components and their types to generate a conceptual overview and AI-powered analysis of their potential interactions and scaling capabilities.
          </p>
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
                <CardFooter className="pt-3 pb-4 px-4 border-t bg-muted/20 flex-col items-start space-y-3">
                  <Label className="text-xs font-semibold text-foreground/70 mb-1">Select specific types:</Label>
                  {component.types && component.types.length > 0 ? (
                    component.types.map((typeDef: TypeDefinition, index) => (
                      <div key={index} className="flex flex-col w-full">
                        <div className="flex items-center space-x-2 w-full">
                          <Checkbox
                            id={`select-${component.id}-${typeDef.name.replace(/\s+/g, '-').toLowerCase()}`}
                            checked={selectedTypesMap.get(component.id)?.has(typeDef.name) ?? false}
                            onCheckedChange={(checked) => {
                              handleTypeSelection(component.id, typeDef.name, !!checked);
                            }}
                            aria-label={`Select type ${typeDef.name} for ${component.title}`}
                          />
                          <Label
                            htmlFor={`select-${component.id}-${typeDef.name.replace(/\s+/g, '-').toLowerCase()}`}
                            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-primary flex-grow"
                          >
                            {typeDef.name}
                          </Label>
                        </div>
                        {typeDef.description && (
                          <p className="text-xs text-muted-foreground pl-6 pt-0.5">
                            {typeDef.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No specific types listed for this component.</p>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button 
                size="lg" 
                disabled={isDisabled}
                onClick={handleGenerateDiagramAndAnalysis}
              >
                <DraftingCompass className="mr-2 h-5 w-5" />
                {isAnalyzing ? "Analyzing Interactions..." : "Analyze Interactions"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                disabled={isDisabled}
                onClick={handleAnalyzeScalingPotential}
              >
                <Scaling className="mr-2 h-5 w-5" />
                Analyze Scaling Potential
              </Button>
            </div>
            {countSelectedTypes() > 0 && !isAnalyzing && (
              <p className="text-sm text-muted-foreground">
                {countSelectedComponents()} component(s) with {countSelectedTypes()} type(s) selected.
              </p>
            )}
             {countSelectedTypes() === 0 && !isAnalyzing && (
              <p className="text-sm text-muted-foreground">
                Select at least one type for a component to generate an analysis.
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
                  Based on your selections, here's a high-level look at the chosen components and their potential roles, along with an AI-powered interaction analysis.
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
                    <BrainCircuit className="h-5 w-5 mr-2 text-accent" />
                    AI-Powered Interaction Analysis:
                  </h4>
                  <div className="p-6 bg-card border rounded-lg shadow-inner text-foreground/90 space-y-4 prose prose-sm dark:prose-invert max-w-none">
                    {isAnalyzing && (
                      <>
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </>
                    )}
                    {analysisError && !isAnalyzing && (
                      <div className="p-4 rounded-md bg-destructive/10 text-destructive flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Analysis Failed</p>
                          <p className="text-xs">{analysisError}</p>
                        </div>
                      </div>
                    )}
                    {aiAnalysis && !isAnalyzing && !analysisError && (
                      <div dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/\n/g, '<br />') }} />
                    )}
                    {!aiAnalysis && !isAnalyzing && !analysisError && (
                       <p className="text-muted-foreground">Click "Analyze Interactions" to see an AI-powered explanation of potential interactions, benefits, and considerations for your selected components.</p>
                    )}
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
