
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
import { DraftingCompass, Network, ListChecks, BrainCircuit, AlertTriangle, Scaling, Cpu, BookCopy, Shield, Workflow } from 'lucide-react';
import { architectureComponents, type ArchitectureComponent, type TypeDefinition } from '@/data/architecture-data';
import { analyzeSystem, type AnalyzeSystemInput, type AnalyzeSystemOutput } from '@/ai/flows/analyze-system-flow';
import { suggestMicroservices, type SuggestMicroservicesOutput } from '@/ai/flows/suggest-microservices-flow';
import { analyzeSecurityPosture, type AnalyzeSecurityPostureInput, type AnalyzeSecurityPostureOutput } from '@/ai/flows/analyze-security-posture-flow';
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
  
  // State to track if any analysis has been triggered, to show the overview section
  const [analysisTriggered, setAnalysisTriggered] = useState(false);
  const [generatedDiagramComponents, setGeneratedDiagramComponents] = useState<ArchitectureComponent[]>([]);
  const [snapshotSelectedTypesMap, setSnapshotSelectedTypesMap] = useState<Map<string, Set<string>>>(new Map());

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [suggestedMicroservicesList, setSuggestedMicroservicesList] = useState<SuggestMicroservicesOutput['suggestedServices'] | null>(null);
  const [isSuggestingMicroservices, setIsSuggestingMicroservices] = useState(false);
  const [suggestMicroservicesError, setSuggestMicroservicesError] = useState<string | null>(null);

  const [securityPostureResult, setSecurityPostureResult] = useState<AnalyzeSecurityPostureOutput | null>(null);
  const [isAnalyzingSecurity, setIsAnalyzingSecurity] = useState(false);
  const [securityAnalysisError, setSecurityAnalysisError] = useState<string | null>(null);


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
    // Reset states if selections change, indicating a new analysis might be needed
    setAnalysisTriggered(false); // Hide old analysis results
    setAiAnalysis(null);
    setAnalysisError(null);
    setSuggestedMicroservicesList(null);
    setSuggestMicroservicesError(null);
    setSecurityPostureResult(null);
    setSecurityAnalysisError(null);
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
  
  const prepareForAnalysis = () => {
    setGeneratedDiagramComponents(architectureComponents.filter(comp => selectedTypesMap.has(comp.id)));
    setSnapshotSelectedTypesMap(new Map(selectedTypesMap));
    setAnalysisTriggered(true); // Show the overview card immediately

    // Reset all specific analysis sections
    setAiAnalysis(null);
    setAnalysisError(null);
    setSuggestedMicroservicesList(null);
    setSuggestMicroservicesError(null);
    setSecurityPostureResult(null);
    setSecurityAnalysisError(null);
  }

  const handleGenerateInteractionAnalysis = async () => {
    prepareForAnalysis();
    setIsAnalyzing(true);
    const flowInput = getFlowInput();

    try {
      const result = await analyzeSystem(flowInput);
      setAiAnalysis(result.analysis);
    } catch (error) {
      console.error("AI Interaction Analysis Error:", error);
      setAnalysisError(error instanceof Error ? error.message : "An unknown error occurred during AI interaction analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSuggestMicroservices = async () => {
    prepareForAnalysis();
    setIsSuggestingMicroservices(true);
    const flowInput = getFlowInput();
    
    try {
      const result = await suggestMicroservices(flowInput);
      setSuggestedMicroservicesList(result.suggestedServices);
    } catch (error) {
      console.error("AI Microservice Suggestion Error:", error);
      setSuggestMicroservicesError(error instanceof Error ? error.message : "An unknown error occurred during AI microservice suggestion.");
    } finally {
      setIsSuggestingMicroservices(false);
    }
  };
  
  const handleAnalyzeSecurityPosture = async () => {
    prepareForAnalysis();
    setIsAnalyzingSecurity(true);
    const flowInput = getFlowInput();

    try {
      const result = await analyzeSecurityPosture(flowInput as AnalyzeSecurityPostureInput);
      setSecurityPostureResult(result);
    } catch (error) {
      console.error("AI Security Posture Analysis Error:", error);
      setSecurityAnalysisError(error instanceof Error ? error.message : "An unknown error occurred during AI security analysis.");
    } finally {
      setIsAnalyzingSecurity(false);
    }
  };


  const handleAnalyzeScalingPotential = () => {
    const flowInput = getFlowInput();
    if (flowInput.components.length === 0) {
      // Optionally, show a toast or message if nothing is selected
      return;
    }
    // No need to set analysisTriggered here as it navigates away
    const selectionString = encodeURIComponent(JSON.stringify(flowInput));
    router.push(`/capacity-analyzer?selection=${selectionString}`);
  };
  
  const countSelectedTypes = () => {
    let count = 0;
    selectedTypesMap.forEach(typesSet => {
      count += typesSet.size;
    });
    return count;
  };

  const isMicroservicesArchitectureSelected = () => {
    const microservicesComp = architectureComponents.find(c => c.id === 'microservices-architecture');
    return microservicesComp ? selectedTypesMap.has(microservicesComp.id) : false;
  };
  
  const hasOtherInfrastructureComponentsSelected = () => {
    let otherComponentSelected = false;
    selectedTypesMap.forEach((_types, componentId) => {
      const comp = architectureComponents.find(c => c.id === componentId);
      // Consider a component "infrastructure" if it's not "Microservices Architecture" itself.
      // This logic might need refinement based on more explicit component categorization.
      if (comp && comp.id !== 'microservices-architecture') {
        otherComponentSelected = true;
      }
    });
    return otherComponentSelected;
  };

  const isAnyAnalysisInProgress = isAnalyzing || isSuggestingMicroservices || isAnalyzingSecurity;
  const isAnyButtonDisabled = countSelectedTypes() === 0 || isAnyAnalysisInProgress;
  const isSuggestMicroservicesButtonDisabled = !isMicroservicesArchitectureSelected() || !hasOtherInfrastructureComponentsSelected() || isAnyAnalysisInProgress;


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
            Select architectural components and their types to generate a conceptual overview and AI-powered analysis of their potential interactions, scaling capabilities, security posture, and even suggested microservices.
          </p>
        </div>

        <div className="mt-8 w-full max-w-6xl">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 text-center text-gray-800 dark:text-gray-100">
            1. Choose Your Architectural Components & Types
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
                      <div key={`${component.id}-${typeDef.name}-${index}`} className="flex flex-col w-full">
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
            <div className="flex flex-col sm:flex-row justify-center items-center flex-wrap gap-4">
              <Button 
                size="lg" 
                disabled={isAnyButtonDisabled}
                onClick={handleGenerateInteractionAnalysis}
              >
                <BrainCircuit className="mr-2 h-5 w-5" />
                {isAnalyzing ? "Analyzing Interactions..." : "Analyze Interactions"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                disabled={isSuggestMicroservicesButtonDisabled}
                onClick={handleSuggestMicroservices}
              >
                <Cpu className="mr-2 h-5 w-5" />
                {isSuggestingMicroservices ? "Suggesting Microservices..." : "Suggest Potential Microservices"}
              </Button>
               <Button
                size="lg"
                variant="outline"
                disabled={isAnyButtonDisabled}
                onClick={handleAnalyzeSecurityPosture}
              >
                <Shield className="mr-2 h-5 w-5" />
                {isAnalyzingSecurity ? "Analyzing Security..." : "Analyze Security Posture"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                disabled={isAnyButtonDisabled} 
                onClick={handleAnalyzeScalingPotential}
              >
                <Scaling className="mr-2 h-5 w-5" />
                Analyze Scaling Potential
              </Button>
            </div>
            {countSelectedTypes() > 0 && !isAnyAnalysisInProgress && (
              <p className="text-sm text-muted-foreground">
                {selectedTypesMap.size} component category(s) with {countSelectedTypes()} type(s) selected. Ready to analyze.
              </p>
            )}
             {countSelectedTypes() === 0 && !isAnyAnalysisInProgress && (
              <p className="text-sm text-muted-foreground">
                Select at least one type for a component to generate an analysis.
              </p>
            )}
            {isMicroservicesArchitectureSelected() && !hasOtherInfrastructureComponentsSelected() && !isSuggestingMicroservices && !isAnyAnalysisInProgress &&(
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                To suggest microservices, please select at least one other infrastructure component type alongside "Microservices Architecture".
              </p>
            )}
          </div>

          {analysisTriggered && (
            <Card className="mt-16 w-full max-w-5xl mx-auto shadow-xl rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-primary flex items-center">
                  <Network className="mr-3 h-7 w-7" />
                  Conceptual System Overview & Analysis
                </CardTitle>
                <CardDescription className="pt-1">
                  Based on your selections, here's a high-level look at the chosen components and AI-powered insights.
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
                     <Workflow className="h-5 w-5 mr-2 text-accent" />
                    Conceptual Diagram Area:
                  </h4>
                  <div className="p-6 border-2 border-dashed border-border/70 rounded-lg bg-muted/20">
                    {generatedDiagramComponents.length > 0 ? (
                        <>
                            <p className="text-center text-muted-foreground text-sm mb-4">
                                (This area will display a dynamic diagram - Feature in development. Below is a textual representation of selected components.)
                            </p>
                            <ul className="space-y-3">
                                {generatedDiagramComponents.map((comp, index) => (
                                <li key={`diagram-${comp.id}-${index}`} className="p-3 rounded-md bg-card border shadow-sm">
                                    <div className="flex items-center">
                                    <comp.icon className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                                    <span className="font-medium text-foreground">{comp.title}</span>
                                    </div>
                                    {snapshotSelectedTypesMap.get(comp.id) && snapshotSelectedTypesMap.get(comp.id)!.size > 0 && (
                                    <ul className="list-decimal list-inside pl-7 text-xs text-foreground/70 mt-1.5 space-y-0.5">
                                        {Array.from(snapshotSelectedTypesMap.get(comp.id)!).map(type => (
                                        <li key={type}>{type}</li>
                                        ))}
                                    </ul>
                                    )}
                                </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                         <>
                            <Workflow className="h-16 w-16 mx-auto mb-4 text-primary/40" />
                            <p className="text-lg font-medium text-center text-muted-foreground">Conceptual Visual Diagram</p>
                            <p className="text-sm text-center text-muted-foreground">(This area will display a dynamic diagram based on your selections - Feature in development)</p>
                        </>
                    )}
                  </div>
                </div>
                
                {(aiAnalysis || isAnalyzing || analysisError) && (
                  <>
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
                              <p className="font-semibold">Interaction Analysis Failed</p>
                              <p className="text-xs">{analysisError}</p>
                            </div>
                          </div>
                        )}
                        {aiAnalysis && !isAnalyzing && !analysisError && (
                          <div dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/\n/g, '<br />') }} />
                        )}
                      </div>
                    </div>
                  </>
                )}

                {(suggestedMicroservicesList || isSuggestingMicroservices || suggestMicroservicesError) && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-xl font-semibold mb-4 text-accent flex items-center">
                        <Cpu className="h-5 w-5 mr-2 text-accent" />
                        AI-Suggested Potential Microservices:
                      </h4>
                      <div className="p-6 bg-card border rounded-lg shadow-inner text-foreground/90 space-y-4">
                        {isSuggestingMicroservices && (
                           <>
                            <Skeleton className="h-4 w-1/2 mb-3" />
                            <Skeleton className="h-3 w-full mb-1" />
                            <Skeleton className="h-3 w-5/6 mb-4" />
                            <Skeleton className="h-4 w-1/2 mb-3" />
                            <Skeleton className="h-3 w-full mb-1" />
                            <Skeleton className="h-3 w-5/6" />
                          </>
                        )}
                        {suggestMicroservicesError && !isSuggestingMicroservices && (
                          <div className="p-4 rounded-md bg-destructive/10 text-destructive flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
                            <div>
                              <p className="font-semibold">Microservice Suggestion Failed</p>
                              <p className="text-xs">{suggestMicroservicesError}</p>
                            </div>
                          </div>
                        )}
                        {suggestedMicroservicesList && !isSuggestingMicroservices && !suggestMicroservicesError && (
                          <ul className="space-y-5">
                            {suggestedMicroservicesList.map((service, index) => (
                              <li key={index} className="p-3 border-l-4 border-primary/50 bg-muted/30 rounded-r-md">
                                <p className="font-semibold text-md text-primary">{service.name}</p>
                                <p className="text-sm text-foreground/80 mt-1">{service.rationale}</p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {(securityPostureResult || isAnalyzingSecurity || securityAnalysisError) && (
                  <>
                    <Separator />
                     <div>
                      <h4 className="text-xl font-semibold mb-4 text-accent flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-accent" />
                        Conceptual Security Posture Analysis:
                      </h4>
                      <div className="p-6 bg-card border rounded-lg shadow-inner text-foreground/90 space-y-4">
                        {isAnalyzingSecurity && (
                          <>
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-5/6 mb-2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-1/2" />
                          </>
                        )}
                        {securityAnalysisError && !isAnalyzingSecurity && (
                          <div className="p-4 rounded-md bg-destructive/10 text-destructive flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
                            <div>
                              <p className="font-semibold">Security Analysis Failed</p>
                              <p className="text-xs">{securityAnalysisError}</p>
                            </div>
                          </div>
                        )}
                        {securityPostureResult && !isAnalyzingSecurity && !securityAnalysisError && (
                          <div>
                            <h5 className="font-semibold text-md mb-2 text-primary">{securityPostureResult.overallConceptualAssessment}</h5>
                            
                            {securityPostureResult.positiveSecurityAspects && securityPostureResult.positiveSecurityAspects.length > 0 && (
                              <div className="mt-3 p-3 bg-green-500/5 rounded-md border border-green-500/20">
                                <h6 className="font-medium text-green-700 dark:text-green-400 mb-1">Positive Security Aspects:</h6>
                                <ul className="list-disc list-inside space-y-0.5 text-sm text-foreground/75">
                                  {securityPostureResult.positiveSecurityAspects.map((aspect, i) => <li key={`positive-${i}`}>{aspect}</li>)}
                                </ul>
                              </div>
                            )}

                            {securityPostureResult.potentialVulnerabilitiesOrConcerns && securityPostureResult.potentialVulnerabilitiesOrConcerns.length > 0 && (
                              <div className="mt-3 p-3 bg-yellow-500/5 rounded-md border border-yellow-500/20">
                                <h6 className="font-medium text-yellow-700 dark:text-yellow-400 mb-1">Potential Vulnerabilities/Concerns:</h6>
                                <ul className="list-disc list-inside space-y-0.5 text-sm text-foreground/75">
                                  {securityPostureResult.potentialVulnerabilitiesOrConcerns.map((concern, i) => <li key={`concern-${i}`}>{concern}</li>)}
                                </ul>
                              </div>
                            )}
                            
                            {securityPostureResult.keySecurityRecommendations && securityPostureResult.keySecurityRecommendations.length > 0 && (
                              <div className="mt-3 p-3 bg-blue-500/5 rounded-md border border-blue-500/20">
                                <h6 className="font-medium text-blue-700 dark:text-blue-400 mb-1">Key Security Recommendations:</h6>
                                <ul className="list-disc list-inside space-y-0.5 text-sm text-foreground/75">
                                  {securityPostureResult.keySecurityRecommendations.map((rec, i) => <li key={`rec-${i}`}>{rec}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

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

    