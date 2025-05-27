
'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Brain, Layers, Scaling, Zap, Maximize, Shield, Cpu, DollarSign, ShieldAlert, Share2, Bookmark } from 'lucide-react';
import { architectureComponents, type ArchitectureComponent, type TypeDefinition } from '@/data/architecture-data';
import { useToast } from "@/hooks/use-toast";

import { analyzeSystem, type AnalyzeSystemInput, type AnalyzeSystemOutput } from '@/ai/flows/analyze-system-flow';
import { analyzeCapacityPotential, type AnalyzeCapacityOutput } from '@/ai/flows/analyze-capacity-flow';
import { suggestCapacityTier, type SuggestCapacityTierOutput } from '@/ai/flows/suggest-capacity-tier-flow';
import { analyzeSecurityPosture, type AnalyzeSecurityPostureOutput } from '@/ai/flows/analyze-security-posture-flow';
import { suggestMicroservices, type SuggestMicroservicesOutput } from '@/ai/flows/suggest-microservices-flow';


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
  attempted: boolean; // To track if this analysis was even attempted
}

export default function MasterFlowPage() {
  const [selectedTypesMap, setSelectedTypesMap] = useState<Map<string, Set<string>>>(new Map());
  const { toast } = useToast();
  
  const initialAnalysisState = { data: null, isLoading: false, error: null, attempted: false };
  const [interactionAnalysis, setInteractionAnalysis] = useState<AnalysisState<AnalyzeSystemOutput>>(initialAnalysisState);
  const [capacityAnalysis, setCapacityAnalysis] = useState<AnalysisState<AnalyzeCapacityOutput>>(initialAnalysisState);
  const [tierSuggestion, setTierSuggestion] = useState<AnalysisState<SuggestCapacityTierOutput>>(initialAnalysisState);
  const [securityPostureAnalysis, setSecurityPostureAnalysis] = useState<AnalysisState<AnalyzeSecurityPostureOutput>>(initialAnalysisState);
  const [microserviceSuggestions, setMicroserviceSuggestions] = useState<AnalysisState<SuggestMicroservicesOutput>>(initialAnalysisState);

  const [analysesTriggered, setAnalysesTriggered] = useState(false);

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
    if (analysesTriggered) setAnalysesTriggered(false); 
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

  const isMicroservicesFlowApplicable = (flowInput: AnalyzeSystemInput): boolean => {
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
    if (flowInput.components.length === 0) {
      const errorMsg = "Please select at least one component type to analyze.";
      setInteractionAnalysis({ data: null, isLoading: false, error: errorMsg, attempted: true });
      setCapacityAnalysis({ data: null, isLoading: false, error: errorMsg, attempted: true });
      setTierSuggestion({ data: null, isLoading: false, error: errorMsg, attempted: true });
      setSecurityPostureAnalysis({ data: null, isLoading: false, error: errorMsg, attempted: true });
      setMicroserviceSuggestions({ data: null, isLoading: false, error: errorMsg, attempted: false }); // Not attempted if no components
      setAnalysesTriggered(true);
      return;
    }

    setAnalysesTriggered(true);
    setInteractionAnalysis({ ...initialAnalysisState, isLoading: true, attempted: true });
    setCapacityAnalysis({ ...initialAnalysisState, isLoading: true, attempted: true });
    setTierSuggestion({ ...initialAnalysisState, isLoading: true, attempted: true });
    setSecurityPostureAnalysis({ ...initialAnalysisState, isLoading: true, attempted: true });

    const microservicesApplicable = isMicroservicesFlowApplicable(flowInput);
    if (microservicesApplicable) {
      setMicroserviceSuggestions({ ...initialAnalysisState, isLoading: true, attempted: true });
    } else {
      setMicroserviceSuggestions({ ...initialAnalysisState, attempted: false });
    }

    try {
      const analysisPromises = [
        analyzeSystem(flowInput).then(data => ({ data, error: null })).catch(error => ({ data: null, error: error instanceof Error ? error.message : "Interaction analysis failed." })),
        analyzeCapacityPotential(flowInput).then(data => ({ data, error: null })).catch(error => ({ data: null, error: error instanceof Error ? error.message : "Capacity analysis failed." })),
        suggestCapacityTier(flowInput).then(data => ({ data, error: null })).catch(error => ({ data: null, error: error instanceof Error ? error.message : "Tier suggestion failed." })),
        analyzeSecurityPosture(flowInput).then(data => ({ data, error: null })).catch(error => ({ data: null, error: error instanceof Error ? error.message : "Security posture analysis failed." })),
      ];

      if (microservicesApplicable) {
        analysisPromises.push(
          suggestMicroservices(flowInput).then(data => ({ data, error: null })).catch(error => ({ data: null, error: error instanceof Error ? error.message : "Microservice suggestion failed." }))
        );
      } else {
        analysisPromises.push(Promise.resolve({ data: null, error: null, notRun: true })); // Placeholder for non-applicable flow
      }
      
      const [interactionResult, capacityResult, tierResult, securityResult, microserviceResult] = await Promise.all(analysisPromises);

      setInteractionAnalysis({ data: interactionResult.data, isLoading: false, error: interactionResult.error, attempted: true });
      setCapacityAnalysis({ data: capacityResult.data, isLoading: false, error: capacityResult.error, attempted: true });
      setTierSuggestion({ data: tierResult.data, isLoading: false, error: tierResult.error, attempted: true });
      setSecurityPostureAnalysis({ data: securityResult.data, isLoading: false, error: securityResult.error, attempted: true });
      
      if (microservicesApplicable) {
        setMicroserviceSuggestions({ data: microserviceResult.data, isLoading: false, error: microserviceResult.error, attempted: true });
      }


    } catch (error) {
      console.error("Master Flow Analysis Orchestration Error:", error);
      const generalError = "An unexpected error occurred while orchestrating analyses.";
      if (!interactionAnalysis.data && !interactionAnalysis.error) setInteractionAnalysis({data:null, isLoading: false, error: generalError, attempted: true});
      if (!capacityAnalysis.data && !capacityAnalysis.error) setCapacityAnalysis({data:null, isLoading: false, error: generalError, attempted: true});
      if (!tierSuggestion.data && !tierSuggestion.error) setTierSuggestion({data:null, isLoading: false, error: generalError, attempted: true});
      if (!securityPostureAnalysis.data && !securityPostureAnalysis.error) setSecurityPostureAnalysis({data:null, isLoading: false, error: generalError, attempted: true});
      if (microservicesApplicable && !microserviceSuggestions.data && !microserviceSuggestions.error) {
        setMicroserviceSuggestions({data:null, isLoading: false, error: generalError, attempted: true});
      }
    }
  };
  
  const countSelectedTypes = () => {
    let count = 0;
    selectedTypesMap.forEach(typesSet => count += typesSet.size);
    return count;
  };

  const isAnalysisButtonDisabled = countSelectedTypes() === 0 || interactionAnalysis.isLoading || capacityAnalysis.isLoading || tierSuggestion.isLoading || securityPostureAnalysis.isLoading || microserviceSuggestions.isLoading;

  const renderAnalysisSection = <T,>(title: string, icon: React.ElementType, state: AnalysisState<T>, contentRenderer: (data: T) => React.ReactNode) => {
    if (!state.attempted && !state.isLoading) return null; // Don't render if not attempted and not loading

    return (
    <Card className="shadow-xl rounded-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary flex items-center">
          {React.createElement(icon, { className: "h-6 w-6 mr-3" })}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm dark:prose-invert max-w-none p-6 bg-muted/10 border rounded-lg shadow-inner text-foreground/90 space-y-4">
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
            <p className="text-muted-foreground">Analysis was not applicable or did not yield results for the current selection.</p>
        )}
      </CardContent>
    </Card>
   );
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {architectureComponents.map((component) => (
              <Card key={component.id} className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden border border-border/70">
                <CardHeader className="flex flex-row items-start space-x-3 pb-2 pt-4 px-4 bg-muted/30">
                  <component.icon className="h-7 w-7 text-accent mt-1 flex-shrink-0" />
                  <div className="flex-grow">
                    <CardTitle className="text-md font-semibold leading-tight text-foreground">{component.title}</CardTitle>
                    <Badge variant={complexityVariant(component.complexity)} className="mt-1 text-xs px-1.5 py-0.5">
                      {component.complexity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-3 pb-4 px-4 border-t border-border/50 bg-muted/20 flex-col items-start space-y-2">
                  <Label className="text-xs font-medium text-foreground/80 mb-1 block">Select specific types:</Label>
                  {component.types && component.types.length > 0 ? (
                    component.types.map((typeDef: TypeDefinition, index) => (
                      <div key={index} className="flex flex-col w-full">
                        <div className="flex items-center space-x-2 w-full">
                          <Checkbox
                            id={`master-select-${component.id}-${typeDef.name.replace(/\s+/g, '-').toLowerCase()}`}
                            checked={selectedTypesMap.get(component.id)?.has(typeDef.name) ?? false}
                            onCheckedChange={(checked) => handleTypeSelection(component.id, typeDef.name, !!checked)}
                            aria-label={`Select type ${typeDef.name} for ${component.title}`}
                          />
                          <Label
                            htmlFor={`master-select-${component.id}-${typeDef.name.replace(/\s+/g, '-').toLowerCase()}`}
                            className="text-xs font-normal leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-primary flex-grow"
                          >
                            {typeDef.name}
                          </Label>
                        </div>
                        {typeDef.description && <p className="text-xs text-muted-foreground pl-6 pt-0.5 leading-snug">{typeDef.description}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No specific types listed.</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="w-full max-w-6xl text-center mb-16 p-6 bg-card rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold tracking-tight mb-6 text-center text-primary">
              2. Generate Comprehensive Analysis
            </h3>
          <Button size="lg" disabled={isAnalysisButtonDisabled} onClick={handleAnalyzeProfile} className="px-10 py-3 text-md">
            <Maximize className="mr-2 h-5 w-5" />
            {isAnalysisButtonDisabled && (interactionAnalysis.isLoading || capacityAnalysis.isLoading || tierSuggestion.isLoading || securityPostureAnalysis.isLoading || microserviceSuggestions.isLoading) ? "Analyzing Full Profile..." : "Analyze Full Architectural Profile"}
          </Button>
          {countSelectedTypes() > 0 && !isAnalysisButtonDisabled && (
            <p className="text-sm text-muted-foreground mt-2">
              {selectedTypesMap.size} component category(s) with {countSelectedTypes()} type(s) selected.
            </p>
          )}
          {countSelectedTypes() === 0 && !isAnalysisButtonDisabled && (
            <p className="text-sm text-muted-foreground mt-2">
              Select at least one type for a component to generate an analysis.
            </p>
          )}
        </div>

        {analysesTriggered && (
          <div className="w-full max-w-5xl mx-auto space-y-10">
             <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 text-center text-gray-800 dark:text-gray-100">
              3. AI-Powered Architectural Insights
            </h3>
            {renderAnalysisSection<AnalyzeSystemOutput>("Interaction Analysis", Layers, interactionAnalysis, (data) => (
              <div dangerouslySetInnerHTML={{ __html: data.analysis.replace(/\n/g, '<br />') }} />
            ))}

            {renderAnalysisSection<AnalyzeCapacityOutput>("Conceptual Scaling Potential", Scaling, capacityAnalysis, (data) => (
              <div dangerouslySetInnerHTML={{ __html: data.analysis.replace(/\n/g, '<br />') }} />
            ))}

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

                {data.considerationsForNextTier && data.considerationsForNextTier.length > 0 && (
                  <div className="mt-4 p-3 bg-accent/5 rounded-md border border-accent/20">
                    <h5 className="font-semibold text-md mb-1 text-accent/90">Considerations for Next Capacity Tier:</h5>
                    <ul className="list-disc list-inside space-y-0.5 text-sm text-foreground/75">
                      {data.considerationsForNextTier.map((consideration, i) => <li key={`next-tier-${i}`}>{consideration}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}

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
            ))}

            {microserviceSuggestions.attempted && renderAnalysisSection<SuggestMicroservicesOutput>("AI-Suggested Potential Microservices", Cpu, microserviceSuggestions, (data) => (
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
            ))}
            
            <Card className="shadow-xl rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary flex items-center">
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
                  onClick={() => {
                    toast({
                      title: "Feature in Development",
                      description: "Cost & Performance Simulation is coming soon!",
                    });
                  }}
                >
                  Explore Cost & Performance Simulation (Coming Soon)
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-xl rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary flex items-center">
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

            <Card className="shadow-xl rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary flex items-center">
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
                  onClick={() => {
                    toast({
                      title: "Feature in Development",
                      description: "Plugin & API Ecosystem is coming soon!",
                    });
                  }}
                >
                  Explore Plugin & API Ecosystem (Coming Soon)
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-xl rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary flex items-center">
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
                  onClick={() => {
                    toast({
                      title: "Feature in Development",
                      description: "Saved Profiles & Templates feature is coming soon!",
                    });
                  }}
                >
                  Explore Saved Profiles & Templates (Coming Soon)
                </Button>
              </CardContent>
            </Card>

          </div>
        )}
      </main>
      <footer className="py-8 text-center text-muted-foreground border-t border-border/50 mt-16">
        <p>&copy; {new Date().getFullYear()} Rustik. Orchestrating architectural wisdom.</p>
      </footer>
    </div>
  );
}
