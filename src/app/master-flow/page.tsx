
'use client';

import { useState, useRef } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertTriangle, Brain, Layers, Scaling, Zap, Maximize, Shield, Cpu, DollarSign, ShieldAlert, Share2, Bookmark, BellRing, WorkflowIcon as WorkflowIconLucide, FlaskConical, FileText, BrainCircuit as BrainCircuitIcon, ClipboardCheck, Store, ClipboardList, Info } from 'lucide-react'; // Renamed WorkflowIcon to WorkflowIconLucide
import { architectureComponents, type ArchitectureComponent, type TypeDefinition } from '@/data/architecture-data';
import { useToast } from "@/hooks/use-toast";

import { analyzeSystem, type AnalyzeSystemInput, type AnalyzeSystemOutput } from '@/ai/flows/analyze-system-flow';
import { analyzeCapacityPotential, type AnalyzeCapacityOutput } from '@/ai/flows/analyze-capacity-flow';
import { suggestCapacityTier, type SuggestCapacityTierOutput } from '@/ai/flows/suggest-capacity-tier-flow';
import { analyzeSecurityPosture, type AnalyzeSecurityPostureOutput } from '@/ai/flows/analyze-security-posture-flow';
import { suggestMicroservices, type SuggestMicroservicesInput, type SuggestMicroservicesOutput } from '@/ai/flows/suggest-microservices-flow';
import { generateDocument, type GenerateDocumentFromAnalysesInput, type GenerateDocumentOutput } from '@/ai/flows/generate-document-flow';


const complexityVariant = (complexityLevel: ArchitectureComponent['complexity']): 'default' | 'secondary' | 'destructive' => {
  switch (complexityLevel) {
    case 'Beginner': return 'default';
    case 'Intermediate': return 'secondary';
    case 'Advanced': return 'destructive';
    default: return 'default';
  }
};

interface AnalysisState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  attempted: boolean; 
}

interface CategorizedComponents {
  category: string;
  hoverHint: string;
  components: ArchitectureComponent[];
}

export default function MasterFlowPage() {
  const [selectedTypesMap, setSelectedTypesMap] = useState<Map<string, Set<string>>>(new Map());
  const { toast } = useToast();
  
  const initialAnalysisState = { data: null, isLoading: false, error: null, attempted: false };
  const [interactionAnalysis, setInteractionAnalysis] = useState<AnalysisState<AnalyzeSystemOutput>>(initialAnalysisState);
  const [capacityAnalysis, setCapacityAnalysis] = useState<AnalysisState<AnalyzeCapacityOutput>>(initialAnalysisState);
  const [tierSuggestion, setTierSuggestion] = useState<AnalysisState<SuggestCapacityTierOutput>>(initialAnalysisState);
  const [securityPostureAnalysis, setSecurityPostureAnalysis] = useState<AnalysisState<AnalyzeSecurityPostureOutput>>(initialAnalysisState);
  const [microserviceSuggestions, setMicroserviceSuggestions] = useState<AnalysisState<SuggestMicroservicesOutput>>({...initialAnalysisState, data: {suggestedServices: []}});

  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);
  const [documentGenerationError, setDocumentGenerationError] = useState<string | null>(null);

  const [analysesTriggered, setAnalysesTriggered] = useState(false);
  const [currentFlowInput, setCurrentFlowInput] = useState<AnalyzeSystemInput | null>(null);

  const [hoverMessage, setHoverMessage] = useState<string | null>(null);
  const hoverMessageTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerHoverMessage = (message: string) => {
    if (hoverMessageTimerRef.current) {
      clearTimeout(hoverMessageTimerRef.current);
    }
    setHoverMessage(message); // Set message and make it visible
    hoverMessageTimerRef.current = setTimeout(() => {
      setHoverMessage(null); // Clear message after 5 seconds
    }, 5000);
  };


  const categorizedComponents: CategorizedComponents[] = [
    {
      category: 'Networking & Connectivity',
      hoverHint: 'Explore components for network traffic management, API exposure, and global connectivity.',
      components: architectureComponents.filter(c => ['anycast-ip', 'load-balancers', 'api-gateway', 'network-infra-strategies'].includes(c.id)),
    },
    {
      category: 'Application & Compute Logic',
      hoverHint: 'Select core application processing units, architectural styles, and design principles.',
      components: architectureComponents.filter(c => ['rust-app-nodes', 'microservices-architecture', 'async-io', 'per-core-socket', 'api-design-styles', 'app-design-principles'].includes(c.id)),
    },
    {
      category: 'Data Management & Storage',
      hoverHint: 'Choose strategies for data persistence, caching, and inter-service communication.',
      components: architectureComponents.filter(c => ['database-strategies', 'caching-strategies', 'shared-state-data-plane'].includes(c.id)),
    },
    {
      category: 'Operations, Scaling & Security',
      hoverHint: 'Define how your system will be discovered, monitored, deployed, scaled, and secured.',
      components: architectureComponents.filter(c => ['service-discovery-control-plane', 'observability-ops', 'deployment-cicd', 'autoscaling-resilience', 'security-architecture-principles', 'cost-management'].includes(c.id)),
    },
  ];

  const allCategorizedIds = categorizedComponents.flatMap(cat => cat.components.map(c => c.id));
  const uncategorizedComponents = architectureComponents.filter(c => !allCategorizedIds.includes(c.id));

  if (uncategorizedComponents.length > 0) {
    categorizedComponents.push({
        category: 'Other Components',
        hoverHint: 'Explore other specialized architectural components.',
        components: uncategorizedComponents
    });
  }

  const handleTypeSelection = (componentId: string, typeName: string, isSelected: boolean) => {
    setSelectedTypesMap(prevMap => {
      const newMap = new Map(prevMap);
      const typesSet = new Set(newMap.get(componentId) || []);
      if (isSelected) typesSet.add(typeName);
      else typesSet.delete(typeName);
      if (typesSet.size > 0) newMap.set(componentId, typesSet);
      else newMap.delete(componentId);
      return newMap;
    });
    if (analysesTriggered) {
        setAnalysesTriggered(false);
        setCurrentFlowInput(null); 
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

  const isMicroservicesFlowApplicable = (flowInput: AnalyzeSystemInput | null): boolean => {
    if (!flowInput) return false;
    const microservicesCompSelected = flowInput.components.some(
      (c) => c.componentTitle === "Microservices Architecture"
    );
    const otherInfraSelected = flowInput.components.some(
      (c) => c.componentTitle !== "Microservices Architecture" && c.selectedTypes.length > 0
    );
    return microservicesCompSelected && otherInfraSelected;
  };


  const handleAnalyzeProfile = async () => {
    const flowInput = getFlowInput();
    setCurrentFlowInput(flowInput); 

    if (flowInput.components.length === 0) {
      const errorMsg = "Please select at least one component type to analyze.";
      toast({ title: "Selection Required", description: errorMsg, variant: "destructive" });
      setInteractionAnalysis({ data: null, isLoading: false, error: errorMsg, attempted: true });
      setCapacityAnalysis({ data: null, isLoading: false, error: errorMsg, attempted: true });
      setTierSuggestion({ data: null, isLoading: false, error: errorMsg, attempted: true });
      setSecurityPostureAnalysis({ data: null, isLoading: false, error: errorMsg, attempted: true });
      setMicroserviceSuggestions({ ...initialAnalysisState, data: {suggestedServices: []}, attempted: false }); 
      setAnalysesTriggered(true);
      return;
    }

    setAnalysesTriggered(true);
    setInteractionAnalysis({ ...initialAnalysisState, isLoading: true, attempted: true });
    setCapacityAnalysis({ ...initialAnalysisState, isLoading: true, attempted: true });
    setTierSuggestion({ ...initialAnalysisState, isLoading: true, attempted: true });
    setSecurityPostureAnalysis({ ...initialAnalysisState, isLoading: true, attempted: true });
    setDocumentGenerationError(null); 

    const microservicesApplicable = isMicroservicesFlowApplicable(flowInput);
    if (microservicesApplicable) {
      setMicroserviceSuggestions({ ...initialAnalysisState, isLoading: true, attempted: true, data: {suggestedServices: []} });
    } else {
      setMicroserviceSuggestions({ ...initialAnalysisState, attempted: false, data: {suggestedServices: []} }); 
    }

    try {
      const analysisPromises = [
        analyzeSystem(flowInput).then(data => ({ key: 'interaction', data, error: null })).catch(error => ({ key: 'interaction', data: null, error: error instanceof Error ? error.message : "Interaction analysis failed." })),
        analyzeCapacityPotential(flowInput).then(data => ({ key: 'capacity', data, error: null })).catch(error => ({ key: 'capacity', data: null, error: error instanceof Error ? error.message : "Capacity analysis failed." })),
        suggestCapacityTier(flowInput).then(data => ({ key: 'tier', data, error: null })).catch(error => ({ key: 'tier', data: null, error: error instanceof Error ? error.message : "Tier suggestion failed." })),
        analyzeSecurityPosture(flowInput).then(data => ({ key: 'security', data, error: null })).catch(error => ({ key: 'security', data: null, error: error instanceof Error ? error.message : "Security posture analysis failed." })),
      ];

      if (microservicesApplicable) {
        analysisPromises.push(
          suggestMicroservices(flowInput as SuggestMicroservicesInput).then(data => ({key: 'microservices', data, error: null })).catch(error => ({ key: 'microservices', data: null, error: error instanceof Error ? error.message : "Microservice suggestion failed." }))
        );
      }
      
      const results = await Promise.all(analysisPromises);

      results.forEach(result => {
        switch (result.key) {
          case 'interaction':
            setInteractionAnalysis({ data: result.data, isLoading: false, error: result.error, attempted: true });
            break;
          case 'capacity':
            setCapacityAnalysis({ data: result.data, isLoading: false, error: result.error, attempted: true });
            break;
          case 'tier':
            setTierSuggestion({ data: result.data, isLoading: false, error: result.error, attempted: true });
            break;
          case 'security':
            setSecurityPostureAnalysis({ data: result.data, isLoading: false, error: result.error, attempted: true });
            break;
          case 'microservices':
             if (microservicesApplicable) {
                setMicroserviceSuggestions({ data: result.data , isLoading: false, error: result.error, attempted: true });
            }
            break;
        }
      });


    } catch (error) {
      console.error("Master Flow Analysis Orchestration Error:", error);
      const generalError = "An unexpected error occurred while orchestrating analyses.";
      toast({ title: "Analysis Error", description: generalError, variant: "destructive"});
      if (!interactionAnalysis.data && !interactionAnalysis.error) setInteractionAnalysis({data:null, isLoading: false, error: generalError, attempted: true});
      if (!capacityAnalysis.data && !capacityAnalysis.error) setCapacityAnalysis({data:null, isLoading: false, error: generalError, attempted: true});
      if (!tierSuggestion.data && !tierSuggestion.error) setTierSuggestion({data:null, isLoading: false, error: generalError, attempted: true});
      if (!securityPostureAnalysis.data && !securityPostureAnalysis.error) setSecurityPostureAnalysis({data:null, isLoading: false, error: generalError, attempted: true});
      if (microservicesApplicable && !microserviceSuggestions.data && !microserviceSuggestions.error) {
        setMicroserviceSuggestions({data:{suggestedServices: []}, isLoading: false, error: generalError, attempted: true});
      }
    }
  };
  
  const handleGenerateDocument = async () => {
    if (!currentFlowInput || currentFlowInput.components.length === 0) {
        toast({ title: "Cannot Generate Document", description: "Please analyze a profile first, or ensure components are selected.", variant: "destructive" });
        return;
    }
    if (interactionAnalysis.isLoading || capacityAnalysis.isLoading || tierSuggestion.isLoading || securityPostureAnalysis.isLoading || (isMicroservicesFlowApplicable(currentFlowInput) && microserviceSuggestions.isLoading) ) {
        toast({ title: "Cannot Generate Document", description: "Please wait for all analyses to complete.", variant: "destructive" });
        return;
    }

    setIsGeneratingDocument(true);
    setDocumentGenerationError(null);

    const documentInput: GenerateDocumentFromAnalysesInput = {
        selectedComponents: currentFlowInput,
        interactionAnalysis: interactionAnalysis.data,
        capacityAnalysis: capacityAnalysis.data,
        tierSuggestion: tierSuggestion.data,
        securityPostureAnalysis: securityPostureAnalysis.data,
        microserviceSuggestions: microserviceSuggestions.data,
    };

    try {
        const result = await generateDocument(documentInput);
        const markdownDocument = result.markdownDocument;

        const filename = 'conceptual_architecture_rustik.md';
        const blob = new Blob([markdownDocument], { type: 'text/markdown;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast({ title: "Document Generated", description: `${filename} has been downloaded.` });
        } else {
            throw new Error("Browser does not support automatic download.");
        }
    } catch (error) {
        console.error("Document Generation Error:", error);
        const errMsg = error instanceof Error ? error.message : "An unknown error occurred during document generation.";
        setDocumentGenerationError(errMsg);
        toast({ title: "Document Generation Failed", description: errMsg, variant: "destructive" });
    } finally {
        setIsGeneratingDocument(false);
    }
  };


  const countSelectedTypes = () => {
    let count = 0;
    selectedTypesMap.forEach(typesSet => count += typesSet.size);
    return count;
  };

  const allAnalysesAttemptedAndNotLoading = 
    interactionAnalysis.attempted && !interactionAnalysis.isLoading &&
    capacityAnalysis.attempted && !capacityAnalysis.isLoading &&
    tierSuggestion.attempted && !tierSuggestion.isLoading &&
    securityPostureAnalysis.attempted && !securityPostureAnalysis.isLoading &&
    (!isMicroservicesFlowApplicable(currentFlowInput) || (microserviceSuggestions.attempted && !microserviceSuggestions.isLoading));


  const isAnalyzeButtonDisabled = countSelectedTypes() === 0 || interactionAnalysis.isLoading || capacityAnalysis.isLoading || tierSuggestion.isLoading || securityPostureAnalysis.isLoading || (isMicroservicesFlowApplicable(currentFlowInput) && microserviceSuggestions.isLoading);

  const renderAnalysisSection = <T,>(
    title: string, 
    icon: React.ElementType, 
    state: AnalysisState<T>, 
    contentRenderer: (data: T) => React.ReactNode, 
    description?: string,
    hoverHint?: string
  ) => {
    if (!state.attempted && !state.isLoading && !analysesTriggered) return null; 

    return (
    <Card 
      className="shadow-xl rounded-xl group"
      onMouseEnter={hoverHint ? () => triggerHoverMessage(hoverHint) : undefined}
    >
      <CardHeader>
        <CardTitle 
          className="text-xl font-semibold text-primary flex items-center group-hover:text-accent transition-colors duration-150"
        >
          {React.createElement(icon, { className: "h-6 w-6 mr-3" })}
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="prose prose-sm dark:prose-invert max-w-none p-6 bg-muted/10 border rounded-lg shadow-inner text-foreground/90 space-y-4 min-h-[100px]">
        {state.isLoading && (
          <>
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </>
        )}
        {state.error && !state.isLoading && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Analysis Failed</p>
              <p className="text-xs">{state.error}</p>
            </div>
          </div>
        )}
        {state.data && !state.isLoading && !state.error && contentRenderer(state.data)}
         {!state.data && !state.isLoading && !state.error && state.attempted && (
            <p className="text-muted-foreground">No data available for this analysis. Please ensure components are selected and try again.</p>
        )}
      </CardContent>
    </Card>
   );
  };

  const getComponentIcon = (title: string) => {
    const component = architectureComponents.find(c => c.title === title);
    return component ? component.icon : Layers; 
  };


  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-10 sm:py-16 flex flex-col items-center">
        <div className="text-center w-full max-w-4xl mb-12">
          <Brain className="h-20 w-20 text-primary mb-6 mx-auto" />
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-gray-800 dark:text-gray-100">
            Master Architectural Flow
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Select your desired architectural components and types, then let the Master Flow orchestrate multiple AI-powered analyses to provide a holistic view of your conceptual system.
          </p>
        </div>

        <div className="w-full max-w-6xl mb-12 p-6 bg-card rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold tracking-tight mb-6 text-center text-primary">
            1. Choose Your Architectural Blueprint
          </h3>
          <div className="space-y-12">
            {categorizedComponents.map(categoryGroup => (
              categoryGroup.components.length > 0 && (
                <section key={categoryGroup.category}>
                  <h4 
                    className="text-xl font-semibold tracking-tight mb-6 text-center text-gray-700 dark:text-gray-200 border-b-2 border-primary/20 pb-2 hover:text-primary transition-colors duration-150 group"
                    onMouseEnter={() => triggerHoverMessage(categoryGroup.hoverHint)}
                  >
                    {categoryGroup.category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryGroup.components.map((component) => (
                      <Card 
                        key={component.id} 
                        className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden border border-border/70 hover:border-primary group"
                        onMouseEnter={() => triggerHoverMessage(`Configure ${component.title}: ${component.eli5Summary}`)}
                      >
                        <CardHeader className="flex flex-row items-start space-x-3 pb-2 pt-4 px-4 bg-muted/30 group-hover:bg-primary/5 transition-colors duration-150">
                          <component.icon className="h-7 w-7 text-accent mt-1 flex-shrink-0 group-hover:text-primary transition-colors duration-150" />
                          <div className="flex-grow">
                            <CardTitle className="text-md font-semibold leading-tight text-foreground group-hover:text-primary transition-colors duration-150">{component.title}</CardTitle>
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
                                          id={`master-select-${component.id}-${typeDef.name.replace(/\s+/g, '-').toLowerCase()}`}
                                          checked={selectedTypesMap.get(component.id)?.has(typeDef.name) ?? false}
                                          onCheckedChange={(checked) => handleTypeSelection(component.id, typeDef.name, !!checked)}
                                          aria-label={`Select type ${typeDef.name} for ${component.title}`}
                                        />
                                        <Label
                                          htmlFor={`master-select-${component.id}-${typeDef.name.replace(/\s+/g, '-').toLowerCase()}`}
                                          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-primary flex-grow"
                                        >
                                          {typeDef.name}
                                        </Label>
                                      </div>
                                      {typeDef.description && <p className="text-xs text-muted-foreground pl-6 pt-0.5 leading-snug">{typeDef.description}</p>}
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
                </section>
              )
            ))}
          </div>
        </div>


        <div className="w-full max-w-6xl text-center mb-16 p-6 bg-card rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold tracking-tight mb-6 text-center text-primary">
              2. Generate Comprehensive Analysis
            </h3>
          <Button 
            size="lg" 
            disabled={isAnalyzeButtonDisabled} 
            onClick={handleAnalyzeProfile} 
            className="px-10 py-3 text-md hover:border-primary focus:border-primary border-2 border-transparent transition-all"
            onMouseEnter={() => triggerHoverMessage("Click to get a full AI-driven analysis of your selected architecture.")}
          >
            <Maximize className="mr-2 h-5 w-5" />
            {isAnalyzeButtonDisabled && (interactionAnalysis.isLoading || capacityAnalysis.isLoading || tierSuggestion.isLoading || securityPostureAnalysis.isLoading || (isMicroservicesFlowApplicable(currentFlowInput) && microserviceSuggestions.isLoading)) ? "Analyzing Full Profile..." : "Analyze Full Architectural Profile"}
          </Button>
          {countSelectedTypes() > 0 && !isAnalyzeButtonDisabled && (
            <p className="text-sm text-muted-foreground mt-2">
              {selectedTypesMap.size} component category(s) with {countSelectedTypes()} type(s) selected.
            </p>
          )}
          {countSelectedTypes() === 0 && !isAnalyzeButtonDisabled && (
            <p className="text-sm text-muted-foreground mt-2">
              Select at least one type for a component to generate an analysis.
            </p>
          )}
        </div>

        {analysesTriggered && (
          <div className="w-full max-w-5xl mx-auto space-y-10">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
                3. AI-Powered Architectural Insights
                </h3>
                {allAnalysesAttemptedAndNotLoading && countSelectedTypes() > 0 && (
                    <Button
                        onClick={handleGenerateDocument}
                        disabled={isGeneratingDocument}
                        variant="outline"
                        size="lg"
                        className="hover:border-primary focus:border-primary border-2 border-transparent transition-all"
                        onMouseEnter={() => triggerHoverMessage("Download a Markdown document summarizing your selections and AI analyses.")}
                    >
                        <FileText className="mr-2 h-5 w-5" />
                        {isGeneratingDocument ? "Generating Document..." : "Download Conceptual Document"}
                    </Button>
                )}
             </div>
             {documentGenerationError && (
                <div className="p-4 rounded-md bg-destructive/10 text-destructive flex items-center mb-4">
                    <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
                    <div>
                    <p className="font-semibold">Document Generation Failed</p>
                    <p className="text-xs">{documentGenerationError}</p>
                    </div>
                </div>
            )}
            
            {currentFlowInput && currentFlowInput.components.length > 0 && (
              <Card className="shadow-xl rounded-xl group" onMouseEnter={() => triggerHoverMessage("A summary of the components and types you've chosen for analysis.")}>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-primary flex items-center group-hover:text-accent transition-colors duration-150">
                    <ClipboardList className="h-6 w-6 mr-3" />
                    Your Selected Architectural Blueprint
                  </CardTitle>
                  <CardDescription>
                    A summary of the components and types you've chosen for analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {currentFlowInput.components.map((comp, index) => {
                    const ComponentIcon = getComponentIcon(comp.componentTitle);
                    return (
                      <div key={`blueprint-${index}`} className="p-3 rounded-md bg-muted/30 border">
                        <div className="flex items-center mb-1.5">
                          <ComponentIcon className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                          <span className="font-medium text-foreground">{comp.componentTitle}</span>
                        </div>
                        {comp.selectedTypes && comp.selectedTypes.length > 0 && (
                          <ul className="list-disc list-inside pl-7 text-sm text-foreground/80 space-y-0.5 mt-1">
                            {comp.selectedTypes.map(type => (
                              <li key={type}>{type}</li>
                            ))}
                          </ul>
                        )}
                         {(!comp.selectedTypes || comp.selectedTypes.length === 0) && (
                            <p className="pl-7 text-xs text-muted-foreground italic mt-1">No specific types selected for this component.</p>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}


            {renderAnalysisSection<AnalyzeSystemOutput>("Interaction Analysis", Layers, interactionAnalysis, (data) => (
              <div dangerouslySetInnerHTML={{ __html: data.analysis.replace(/\n/g, '<br />') }} />
            ), "Explores how selected components might work together, including a conceptual data flow if applicable.", "AI insights on component synergies and potential data flow.")}

            {renderAnalysisSection<AnalyzeCapacityOutput>("Conceptual Scaling Potential", Scaling, capacityAnalysis, (data) => (
              <div dangerouslySetInnerHTML={{ __html: data.analysis.replace(/\n/g, '<br />') }} />
            ), "Analyzes how the selected components contribute to handling large user loads and overall system scalability.", "AI's take on scalability strengths and potential bottlenecks.")}

            {renderAnalysisSection<SuggestCapacityTierOutput>("Suggested Capacity Tier & Reasoning", Zap, tierSuggestion, (data) => (
              <div>
                <h4 className="font-semibold text-lg mb-2 text-primary">{data.suggestedTier}</h4>
                <div className="mb-4 prose-p:my-1 text-foreground/80" dangerouslySetInnerHTML={{ __html: data.reasoning.replace(/\n/g, '<br />') }} />
                
                {data.keyStrengthsForTier && data.keyStrengthsForTier.length > 0 && (
                  <div className="mt-4 p-3 bg-primary/5 rounded-md border border-primary/20">
                    <h5 className="font-semibold text-md mb-1 text-primary/90">Key Strengths Supporting This Tier:</h5>
                    <ul className="list-disc list-inside space-y-0.5 text-sm text-foreground/75">
                      {data.keyStrengthsForTier.map((strength, i) => <li key={`strength-${i}`}>{strength}</li>)}
                    </ul>
                  </div>
                )}

                {data.keyAssumptions && data.keyAssumptions.length > 0 && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-md border border-border/70">
                    <h5 className="font-semibold text-md mb-1 text-foreground/80 flex items-center">
                        <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                        Key Assumptions Made by AI:
                    </h5>
                    <ul className="list-disc list-inside space-y-0.5 text-sm text-foreground/70">
                      {data.keyAssumptions.map((assumption, i) => <li key={`assumption-${i}`}>{assumption}</li>)}
                    </ul>
                  </div>
                )}

                {data.considerationsForNextTier && data.considerationsForNextTier.length > 0 && (
                  <div className="mt-4 p-3 bg-accent/5 rounded-md border border-accent/20">
                    <h5 className="font-semibold text-md mb-1 text-accent/90">Considerations for Next Capacity Tier:</h5>
                    <ul className="list-disc list-inside space-y-0.5 text-sm text-foreground/75">
                      {data.considerationsForNextTier.map((consideration, i) => <li key={`next-tier-${i}`}>{consideration}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ), "Suggests a conceptual user capacity tier the system might be suitable for, with detailed reasoning and key assumptions.", "AI's conceptual estimate of user capacity tier and supporting factors.")}

            {renderAnalysisSection<AnalyzeSecurityPostureOutput>("Conceptual Security Posture", Shield, securityPostureAnalysis, (data) => (
              <div>
                <h4 className="font-semibold text-lg mb-3 text-primary">{data.overallConceptualAssessment}</h4>
                
                {data.positiveSecurityAspects && data.positiveSecurityAspects.length > 0 && (
                  <div className="mb-4 p-3 bg-green-500/5 rounded-md border border-green-500/20">
                    <h5 className="font-semibold text-md mb-1 text-green-700 dark:text-green-400">Positive Security Aspects:</h5>
                    <ul className="list-disc list-inside space-y-0.5 text-sm text-foreground/75">
                      {data.positiveSecurityAspects.map((aspect, i) => <li key={`positive-${i}`}>{aspect}</li>)}
                    </ul>
                  </div>
                )}

                {data.potentialVulnerabilitiesOrConcerns && data.potentialVulnerabilitiesOrConcerns.length > 0 && (
                  <div className="mb-4 p-3 bg-yellow-500/5 rounded-md border border-yellow-500/20">
                    <h5 className="font-semibold text-md mb-1 text-yellow-700 dark:text-yellow-400">Potential Vulnerabilities/Concerns:</h5>
                    <ul className="list-disc list-inside space-y-0.5 text-sm text-foreground/75">
                      {data.potentialVulnerabilitiesOrConcerns.map((concern, i) => <li key={`concern-${i}`}>{concern}</li>)}
                    </ul>
                  </div>
                )}
                
                {data.keySecurityRecommendations && data.keySecurityRecommendations.length > 0 && (
                  <div className="p-3 bg-blue-500/5 rounded-md border border-blue-500/20">
                    <h5 className="font-semibold text-md mb-1 text-blue-700 dark:text-blue-400">Key Security Recommendations:</h5>
                    <ul className="list-disc list-inside space-y-0.5 text-sm text-foreground/75">
                      {data.keySecurityRecommendations.map((rec, i) => <li key={`rec-${i}`}>{rec}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ), "Provides a high-level AI assessment of security strengths, vulnerabilities, and recommendations.", "AI-driven conceptual security overview and advice.")}

            {microserviceSuggestions.attempted && isMicroservicesFlowApplicable(currentFlowInput) && renderAnalysisSection<SuggestMicroservicesOutput>("AI-Suggested Potential Microservices", Cpu, microserviceSuggestions, (data) => (
               data.suggestedServices && data.suggestedServices.length > 0 && data.suggestedServices[0].name !== "Context Needed" ? (
                <ul className="space-y-5">
                  {data.suggestedServices.map((service, index) => (
                    <li key={`ms-sugg-${index}`} className="p-3 border-l-4 border-primary/50 bg-muted/30 rounded-r-md">
                      <p className="font-semibold text-md text-primary">{service.name}</p>
                      <p className="text-sm text-foreground/80 mt-1">{service.rationale}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                 <p className="text-muted-foreground">Microservice suggestions were not applicable for the current selection, or no specific suggestions could be generated. Ensure 'Microservices Architecture' and other relevant infrastructure components are selected.</p>
              )
            ), "If 'Microservices Architecture' is selected with relevant infra, suggests potential application-level microservices.", "AI-generated microservice ideas based on your infrastructure choices.")}
            
            <Card className="shadow-xl rounded-xl group" onMouseEnter={() => triggerHoverMessage("Conceptual placeholder for future cost and performance simulation features.")}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary flex items-center group-hover:text-accent transition-colors duration-150">
                  <DollarSign className="h-6 w-6 mr-3" />
                  Advanced Simulation (Conceptual)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-foreground/90 space-y-4">
                <p className="text-sm text-muted-foreground">
                  For a deeper dive, future enhancements could integrate cloud-provider APIs (AWS, GCP, Azure) 
                  to attach real cost estimates and latency profiles to each component, then run “what-if” scenarios 
                  to forecast budget vs. performance trade-offs.
                </p>
                <Button 
                  variant="outline"
                  className="hover:border-primary focus:border-primary border-2 border-transparent transition-all"
                  onClick={() => {
                    toast({
                      title: "Feature in Development",
                      description: "Cost & Performance Simulation is coming soon!",
                    });
                  }}
                >
                  Explore Cost &amp; Performance Simulation (Coming Soon)
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-xl rounded-xl group" onMouseEnter={() => triggerHoverMessage("Conceptual placeholder for a future advanced security assessment tool.")}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary flex items-center group-hover:text-accent transition-colors duration-150">
                  <ShieldAlert className="h-6 w-6 mr-3" />
                  Advanced Security Assessment (Conceptual)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-foreground/90 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Build in a rule-based or AI-powered security auditor that flags missing mTLS, 
                  weak isolation zones, or single points of failure—turning your visual model 
                  into a living threat-model.
                </p>
                <Button 
                  variant="outline"
                  className="hover:border-primary focus:border-primary border-2 border-transparent transition-all"
                  onClick={() => {
                    toast({
                      title: "Feature in Development",
                      description: "Advanced Security Assessment is coming soon!",
                    });
                  }}
                >
                  Explore Advanced Security Assessment (Coming Soon)
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-xl rounded-xl group" onMouseEnter={() => triggerHoverMessage("Conceptual placeholder for a future plugin and API ecosystem.")}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary flex items-center group-hover:text-accent transition-colors duration-150">
                  <Share2 className="h-6 w-6 mr-3" />
                  Plugin &amp; API Ecosystem (Conceptual)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-foreground/90 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Expose a plugin framework or REST API so the community (or your own teams) can add new component libraries, 
                  custom AI flows (e.g. compliance checks), or embed Rustik analyses in other tooling.
                </p>
                <Button 
                  variant="outline"
                  className="hover:border-primary focus:border-primary border-2 border-transparent transition-all"
                  onClick={() => {
                    toast({
                      title: "Feature in Development",
                      description: "Plugin & API Ecosystem is coming soon!",
                    });
                  }}
                >
                  Explore Plugin &amp; API Ecosystem (Coming Soon)
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-xl rounded-xl group" onMouseEnter={() => triggerHoverMessage("Conceptual placeholder for saving and sharing architectural profiles and templates.")}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary flex items-center group-hover:text-accent transition-colors duration-150">
                  <Bookmark className="h-6 w-6 mr-3" />
                  Saved Profiles &amp; Templates (Conceptual)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-foreground/90 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Offer templates for common patterns (e.g., “Global CDN + Multi-Region DB”) and let users snapshot and share “best practice” configurations across projects or orgs. This would likely require user accounts.
                </p>
                <Button 
                  variant="outline"
                  className="hover:border-primary focus:border-primary border-2 border-transparent transition-all"
                  onClick={() => {
                    toast({
                      title: "Feature in Development",
                      description: "Saved Profiles & Templates feature is coming soon!",
                    });
                  }}
                >
                  Explore Saved Profiles &amp; Templates (Coming Soon)
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-xl rounded-xl group" onMouseEnter={() => triggerHoverMessage("Conceptual placeholder for integrating with live infrastructure for drift detection.")}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary flex items-center group-hover:text-accent transition-colors duration-150">
                  <BellRing className="h-6 w-6 mr-3" />
                  Alerting &amp; Drift Detection (Conceptual)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-foreground/90 space-y-4">
                <p className="text-sm text-muted-foreground">
                 Connect Rustik to your real-world telemetry (e.g., Prometheus, Terraform state, AWS Config) and get alerts when live infra drifts from the modeled architecture or exhibits unusual behavior.
                </p>
                <Button 
                  variant="outline"
                  className="hover:border-primary focus:border-primary border-2 border-transparent transition-all"
                  onClick={() => {
                    toast({
                      title: "Feature in Development",
                      description: "Alerting & Drift Detection is coming soon!",
                    });
                  }}
                >
                  Explore Alerting &amp; Drift Detection (Coming Soon)
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-xl rounded-xl group" onMouseEnter={() => triggerHoverMessage("Conceptual placeholder for integrating Rustik into CI/CD pipelines.")}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary flex items-center group-hover:text-accent transition-colors duration-150">
                  <WorkflowIconLucide className="h-6 w-6 mr-3" /> {/* Renamed import */}
                  CI/CD Integration (Conceptual)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-foreground/90 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Plug Rustik into your pipeline: break the build if your IaC deviates from approved architectural patterns, 
                  or auto-generate compliance reports on every PR.
                </p>
                <Button 
                  variant="outline"
                  className="hover:border-primary focus:border-primary border-2 border-transparent transition-all"
                  onClick={() => {
                    toast({
                      title: "Feature in Development",
                      description: "CI/CD Integration feature is coming soon!",
                    });
                  }}
                >
                  Explore CI/CD Integration (Coming Soon)
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-xl rounded-xl group" onMouseEnter={() => triggerHoverMessage("Conceptual placeholder for a digital twin and simulation environment.")}>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary flex items-center group-hover:text-accent transition-colors duration-150">
                        <FlaskConical className="h-6 w-6 mr-3" />
                        Digital Twin &amp; “What-If” Simulator (Conceptual)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-foreground/90 space-y-4">
                    <p className="text-sm text-muted-foreground">
                    Spin up a sandboxed, code-generated replica of your design (e.g. in Docker or Kubernetes) 
                    and run synthetic load tests to validate performance and failure modes before you build.
                    </p>
                    <Button 
                        variant="outline"
                        className="hover:border-primary focus:border-primary border-2 border-transparent transition-all"
                        onClick={() => {
                            toast({
                            title: "Feature in Development",
                            description: "Digital Twin & Simulator feature is coming soon!",
                            });
                        }}
                    >
                    Explore Digital Twin &amp; Simulator (Coming Soon)
                    </Button>
                </CardContent>
            </Card>
            
            <Card className="shadow-xl rounded-xl group" onMouseEnter={() => triggerHoverMessage("Conceptual placeholder for AI-driven architectural optimization.")}>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary flex items-center group-hover:text-accent transition-colors duration-150">
                    <BrainCircuitIcon className="h-6 w-6 mr-3" /> {/* Use aliased import */}
                    Adaptive Blueprint Optimization (Conceptual)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-foreground/90 space-y-4">
                    <p className="text-sm text-muted-foreground">
                    Use reinforcement-learning or genetic-algorithms to evolve your design automatically based on cost, latency, and resilience objectives—letting the AI propose “next-generation” topologies.
                    </p>
                    <Button 
                        variant="outline"
                        className="hover:border-primary focus:border-primary border-2 border-transparent transition-all"
                        onClick={() => {
                            toast({
                            title: "Feature in Development",
                            description: "Adaptive Blueprint Optimization is coming soon!",
                            });
                        }}
                    >
                    Explore Adaptive Blueprint Optimization (Coming Soon)
                    </Button>
                </CardContent>
            </Card>

            <Card className="shadow-xl rounded-xl group" onMouseEnter={() => triggerHoverMessage("Conceptual placeholder for automated compliance and audit reporting features.")}>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary flex items-center group-hover:text-accent transition-colors duration-150">
                    <ClipboardCheck className="h-6 w-6 mr-3" />
                    Compliance &amp; Audit Reporting (Conceptual)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-foreground/90 space-y-4">
                    <p className="text-sm text-muted-foreground">
                    Bake in templates for standards like PCI-DSS, HIPAA, ISO 27001 or GDPR, then generate compliance reports that map each architectural decision to required controls.
                    </p>
                    <Button 
                        variant="outline"
                        className="hover:border-primary focus:border-primary border-2 border-transparent transition-all"
                        onClick={() => {
                            toast({
                            title: "Feature in Development",
                            description: "Compliance & Audit Reporting is coming soon!",
                            });
                        }}
                    >
                    Explore Compliance Reporting (Coming Soon)
                    </Button>
                </CardContent>
            </Card>

            <Card className="shadow-xl rounded-xl group" onMouseEnter={() => triggerHoverMessage("Conceptual placeholder for a community-driven plugin marketplace.")}>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary flex items-center group-hover:text-accent transition-colors duration-150">
                    <Store className="h-6 w-6 mr-3" />
                    Extensible Plugin Marketplace (Conceptual)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-foreground/90 space-y-4">
                    <p className="text-sm text-muted-foreground">
                    Let users publish and share new component definitions, AI flow templates, compliance policies, or even custom cost-model providers.
                    </p>
                    <Button 
                        variant="outline"
                        className="hover:border-primary focus:border-primary border-2 border-transparent transition-all"
                        onClick={() => {
                            toast({
                            title: "Feature in Development",
                            description: "Extensible Plugin Marketplace is coming soon!",
                            });
                        }}
                    >
                    Explore Plugin Marketplace (Coming Soon)
                    </Button>
                </CardContent>
            </Card>

          </div>
        )}
      </main>
      {hoverMessage && (
        <div 
          key={Date.now()} // Re-trigger animation on message change
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
        <p>&copy; {new Date().getFullYear()} Rustik. Orchestrating architectural wisdom.</p>
      </footer>
    </div>
  );
}
