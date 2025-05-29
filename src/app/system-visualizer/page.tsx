
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/app-header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DraftingCompass, Network, ListChecks, BrainCircuit, AlertTriangle, Scaling, Cpu, Shield, WorkflowIcon, FileOutput, ImageIcon } from 'lucide-react';
import { architectureComponents, type ArchitectureComponent, type TypeDefinition } from '@/data/architecture-data';
import { analyzeSystem, type AnalyzeSystemInput, type AnalyzeSystemOutput } from '@/ai/flows/analyze-system-flow';
import { suggestMicroservices, type SuggestMicroservicesInput, type SuggestMicroservicesOutput } from '@/ai/flows/suggest-microservices-flow';
import { analyzeSecurityPosture, type AnalyzeSecurityPostureInput, type AnalyzeSecurityPostureOutput } from '@/ai/flows/analyze-security-posture-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [selectedTypesMap, setSelectedTypesMap] = useState<Map<string, Set<string>>>(new Map());
  
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
    // Reset analysis states when selection changes
    setAnalysisTriggered(false); 
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
    const flowInput = getFlowInput();
    if (flowInput.components.length === 0) {
        toast({ title: "Selection Required", description: "Please select at least one component type to analyze.", variant: "destructive" });
        return false;
    }
    setGeneratedDiagramComponents(flowInput.components.map(c => architectureComponents.find(ac => ac.title === c.componentTitle)!));
    setSnapshotSelectedTypesMap(new Map(selectedTypesMap)); 
    setAnalysisTriggered(true); 
    return true;
  }

  const handleGenerateInteractionAnalysis = async () => {
    if (!prepareForAnalysis()) return;
    setIsAnalyzing(true);
    setAiAnalysis(null);
    setAnalysisError(null);
    // Reset other analysis results
    setSuggestedMicroservicesList(null);
    setSuggestMicroservicesError(null);
    setSecurityPostureResult(null);
    setSecurityAnalysisError(null);

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
    if (!prepareForAnalysis()) return;
    setIsSuggestingMicroservices(true);
    setSuggestedMicroservicesList(null);
    setSuggestMicroservicesError(null);
    // Reset other analysis results
    setAiAnalysis(null);
    setAnalysisError(null);
    setSecurityPostureResult(null);
    setSecurityAnalysisError(null);

    const flowInput = getFlowInput();
    
    try {
      const result = await suggestMicroservices(flowInput as SuggestMicroservicesInput);
      setSuggestedMicroservicesList(result.suggestedServices);
    } catch (error) {
      console.error("AI Microservice Suggestion Error:", error);
      setSuggestMicroservicesError(error instanceof Error ? error.message : "An unknown error occurred during AI microservice suggestion.");
    } finally {
      setIsSuggestingMicroservices(false);
    }
  };
  
  const handleAnalyzeSecurityPosture = async () => {
    if (!prepareForAnalysis()) return;
    setIsAnalyzingSecurity(true);
    setSecurityPostureResult(null);
    setSecurityAnalysisError(null);
    // Reset other analysis results
    setAiAnalysis(null);
    setAnalysisError(null);
    setSuggestedMicroservicesList(null);
    setSuggestMicroservicesError(null);

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
      toast({ title: "Selection Required", description: "Please select at least one component type to analyze scaling potential.", variant: "destructive" });
      return;
    }
    const selectionString = encodeURIComponent(JSON.stringify(flowInput));
    router.push(`/capacity-analyzer?selection=${selectionString}`);
  };

  const handleExportClick = (exportType: string) => {
    toast({
      title: "Feature in Development",
      description: `${exportType} export is coming soon!`,
    });
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
    return microservicesComp ? (selectedTypesMap.get(microservicesComp.id)?.size ?? 0) > 0 : false;
  };
  
  const hasOtherInfrastructureComponentsSelected = () => {
    let otherComponentSelected = false;
    selectedTypesMap.forEach((types, componentId) => {
      const comp = architectureComponents.find(c => c.id === componentId);
      if (comp && comp.id !== 'microservices-architecture' && types.size > 0) {
        otherComponentSelected = true;
      }
    });
    return otherComponentSelected;
  };

  const isAnyAnalysisInProgress = isAnalyzing || isSuggestingMicroservices || isAnalyzingSecurity;
  const isAnyButtonDisabled = countSelectedTypes() === 0 || isAnyAnalysisInProgress;
  const isSuggestMicroservicesButtonDisabled = !isMicroservicesArchitectureSelected() || !hasOtherInfrastructureComponentsSelected() || isAnyAnalysisInProgress || countSelectedTypes() === 0;


  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-10 sm:py-16 flex flex-col items-center">
        <div className="text-center w-full max-w-3xl group" onMouseEnter={() => triggerHoverMessage("The System Visualizer helps you explore how different architectural components can fit together.")}>
          <DraftingCompass className="h-24 w-24 text-primary mb-8 mx-auto group-hover:text-accent transition-colors" />
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 text-gray-800 dark:text-gray-100 group-hover:text-accent transition-colors">
            System Visualizer
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Select architectural components and their types to generate a conceptual overview and AI-powered analysis of their potential interactions, scaling capabilities, security posture, and even suggested microservices.
          </p>
        </div>

        <div className="mt-8 w-full max-w-6xl">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 text-center text-gray-800 dark:text-gray-100 group" onMouseEnter={() => triggerHoverMessage("Select components to build your conceptual architecture.")}>
            1. Choose Your Architectural Components &amp; Types
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {architectureComponents.map((component) => (
              <Card 
                key={component.id} 
                className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden border border-border/70 hover:border-primary group"
                onMouseEnter={() => triggerHoverMessage(`${component.title}: ${component.eli5Summary}`)}
              >
                <CardHeader className="flex flex-row items-start space-x-3 pb-2 pt-4 px-4 bg-muted/30 group-hover:bg-primary/5 transition-colors">
                  <component.icon className="h-7 w-7 text-accent mt-1 flex-shrink-0 group-hover:text-primary transition-colors" />
                  <div className="flex-grow">
                    <CardTitle className="text-md font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">{component.title}</CardTitle>
                    <Badge variant={complexityVariant(component.complexity)} className="mt-1 text-xs px-1.5 py-0.5">
                      {component.complexity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardFooter className="pt-3 pb-4 px-2 border-t border-border/50 bg-muted/20 flex-col items-start">
                  {component.types && component.types.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={`item-${component.id}`} className="border-b-0">
                        <AccordionTrigger className="py-2 px-2 text-xs font-medium text-foreground/80 hover:no-underline">
                          Select Types ({component.types.length})
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-2 px-2 space-y-2">
                          {component.types.map((typeDef: TypeDefinition, index) => (
                            <div key={`${component.id}-${typeDef.name.replace(/\s+/g, '-')}-${index}`} className="flex flex-col w-full">
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
                                <p className="text-xs text-muted-foreground pl-6 pt-0.5 leading-snug">
                                  {typeDef.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <p className="text-xs text-muted-foreground px-2 py-3">No specific types listed for this component.</p>
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
                onMouseEnter={() => triggerHoverMessage("Get AI insights on how your selected components might interact.")}
                className="group-hover:bg-primary/90"
              >
                <BrainCircuit className="mr-2 h-5 w-5" />
                {isAnalyzing ? "Analyzing Interactions..." : "Analyze Interactions"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                disabled={isSuggestMicroservicesButtonDisabled}
                onClick={handleSuggestMicroservices}
                onMouseEnter={() => triggerHoverMessage("If 'Microservices Architecture' is selected with infrastructure, get AI suggestions for services.")}
                className="group-hover:border-primary"
              >
                <Cpu className="mr-2 h-5 w-5" />
                {isSuggestingMicroservices ? "Suggesting Microservices..." : "Suggest Potential Microservices"}
              </Button>
               <Button
                size="lg"
                variant="outline"
                disabled={isAnyButtonDisabled}
                onClick={handleAnalyzeSecurityPosture}
                onMouseEnter={() => triggerHoverMessage("Get a conceptual AI analysis of your selection's security posture.")}
                className="group-hover:border-primary"
              >
                <Shield className="mr-2 h-5 w-5" />
                {isAnalyzingSecurity ? "Analyzing Security..." : "Analyze Conceptual Security Posture"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                disabled={isAnyButtonDisabled} 
                onClick={handleAnalyzeScalingPotential}
                onMouseEnter={() => triggerHoverMessage("Explore the conceptual scaling potential of your choices in a dedicated analyzer.")}
                className="group-hover:border-primary"
              >
                <Scaling className="mr-2 h-5 w-5" />
                Analyze Scaling Potential
              </Button>
            </div>
            {countSelectedTypes() > 0 && !isAnyAnalysisInProgress && (
              <p className="text-sm text-muted-foreground mt-2">
                {selectedTypesMap.size} component category(s) with {countSelectedTypes()} type(s) selected. Ready to analyze.
              </p>
            )}
             {countSelectedTypes() === 0 && !isAnyAnalysisInProgress && (
              <p className="text-sm text-muted-foreground mt-2">
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
              <CardHeader className="pb-4 group" onMouseEnter={() => triggerHoverMessage("An overview of your selected configuration and its analyses.")}>
                <CardTitle className="text-2xl font-bold text-primary flex items-center group-hover:text-accent transition-colors">
                  <Network className="mr-3 h-7 w-7" />
                  Conceptual System Overview &amp; Analysis
                </CardTitle>
                <CardDescription className="pt-1">
                  Based on your selections, here's a high-level look at the chosen components and AI-powered insights.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-2">
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-accent flex items-center group" onMouseEnter={() => triggerHoverMessage("A summary of the components and types you've selected.")}>
                    <ListChecks className="h-5 w-5 mr-2 text-accent group-hover:text-primary transition-colors" />
                    Selected Architectural Elements &amp; Types:
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
                 <div className="group" onMouseEnter={() => triggerHoverMessage("A textual representation of your selected components. Graphical diagrams coming soon!")}>
                  <h4 className="text-xl font-semibold mb-4 text-accent flex items-center group-hover:text-primary transition-colors">
                     <WorkflowIcon className="h-5 w-5 mr-2 text-accent group-hover:text-primary transition-colors" />
                    Conceptual Diagram Area:
                  </h4>
                  <div className="p-6 border-2 border-dashed border-border/70 rounded-lg bg-muted/20 min-h-[200px] flex flex-col justify-center items-center">
                    {generatedDiagramComponents.length > 0 ? (
                        <>
                            <p className="text-center text-muted-foreground text-sm mb-4">
                                (This area will display a dynamic diagram - Feature in development. Below is a textual representation of selected components.)
                            </p>
                            <ul className="space-y-3 w-full max-w-md">
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
                            <ImageIcon className="h-16 w-16 mx-auto mb-4 text-primary/40" />
                            <p className="text-lg font-medium text-center text-muted-foreground">Conceptual Visual Diagram</p>
                            <p className="text-sm text-center text-muted-foreground">(Select components and trigger an analysis to see a textual representation here. Graphical diagram feature is in development.)</p>
                        </>
                    )}
                  </div>
                </div>
                
                {(aiAnalysis || isAnalyzing || analysisError) && (
                  <>
                    <Separator />
                    <div className="group" onMouseEnter={() => triggerHoverMessage("AI-generated insights on component interactions, benefits, and data flow.")}>
                      <CardHeader className="px-0 py-4">
                        <CardTitle className="text-xl font-semibold text-accent flex items-center group-hover:text-primary transition-colors">
                            <BrainCircuit className="h-5 w-5 mr-2 text-accent group-hover:text-primary transition-colors" />
                            AI-Powered Interaction Analysis:
                        </CardTitle>
                        <CardDescription className="pt-1">
                          Based on your selections, here's a high-level look at potential interactions, benefits, considerations, and a conceptual sequential flow if applicable.
                        </CardDescription>
                      </CardHeader>
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
                    <div className="group" onMouseEnter={() => triggerHoverMessage("AI-suggested microservices if 'Microservices Architecture' is selected.")}>
                      <CardHeader className="px-0 py-4">
                        <CardTitle className="text-xl font-semibold text-accent flex items-center group-hover:text-primary transition-colors">
                            <Cpu className="h-5 w-5 mr-2 text-accent group-hover:text-primary transition-colors" />
                            AI-Suggested Potential Microservices:
                        </CardTitle>
                        <CardDescription className="pt-1">
                           If &quot;Microservices Architecture&quot; and relevant infrastructure are selected, the AI suggests potential application-level microservices.
                        </CardDescription>
                      </CardHeader>
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
                     <div className="group" onMouseEnter={() => triggerHoverMessage("AI-generated conceptual security overview of your selected components.")}>
                      <CardHeader className="px-0 py-4">
                        <CardTitle className="text-xl font-semibold text-accent flex items-center group-hover:text-primary transition-colors">
                          <Shield className="h-5 w-5 mr-2 text-accent group-hover:text-primary transition-colors" />
                          Conceptual Security Posture Analysis:
                        </CardTitle>
                        <CardDescription className="pt-1">
                           A high-level AI assessment of potential security strengths, vulnerabilities, and recommendations for your selected components.
                        </CardDescription>
                      </CardHeader>
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
                <Separator />
                <div className="group" onMouseEnter={() => triggerHoverMessage("Explore options to export your conceptual design (features in development).")}>
                  <h4 className="text-xl font-semibold mb-4 text-accent flex items-center group-hover:text-primary transition-colors">
                    <FileOutput className="h-5 w-5 mr-2 text-accent group-hover:text-primary transition-colors" />
                    Export Options:
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" onClick={() => handleExportClick("PlantUML")} onMouseEnter={() => triggerHoverMessage("Generate PlantUML notation for your diagram.")}>
                      <FileOutput className="mr-2 h-4 w-4" /> Export PlantUML
                    </Button>
                    <Button variant="outline" onClick={() => handleExportClick("SVG/PNG Diagram")} onMouseEnter={() => triggerHoverMessage("Export a visual diagram as SVG or PNG.")}>
                      <FileOutput className="mr-2 h-4 w-4" /> Export SVG/PNG
                    </Button>
                    <Button variant="outline" onClick={() => handleExportClick("Terraform Stubs")} onMouseEnter={() => triggerHoverMessage("Generate conceptual Terraform stubs.")}>
                      <FileOutput className="mr-2 h-4 w-4" /> Export IaC (Terraform)
                    </Button>
                     <Button variant="outline" onClick={() => handleExportClick("CloudFormation Stubs")} onMouseEnter={() => triggerHoverMessage("Generate conceptual CloudFormation stubs.")}>
                      <FileOutput className="mr-2 h-4 w-4" /> Export IaC (CloudFormation)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-20 text-center group" onMouseEnter={() => triggerHoverMessage("Learn more about the challenges of building large-scale systems.")}>
          <Button asChild variant="outline" className="group-hover:border-primary">
            <Link href="/system-builder-challenges">Learn about System Building Challenges</Link>
          </Button>
        </div>
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
        <p>&copy; {new Date().getFullYear()} Rustik. Visualizing the future of architecture.</p>
      </footer>
    </div>
  );
}

    

    