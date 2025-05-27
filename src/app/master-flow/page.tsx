
'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Brain, Layers, Scaling, Zap, Maximize } from 'lucide-react';
import { architectureComponents, type ArchitectureComponent, type TypeDefinition } from '@/data/architecture-data';

import { analyzeSystem, type AnalyzeSystemInput, type AnalyzeSystemOutput } from '@/ai/flows/analyze-system-flow';
import { analyzeCapacityPotential, type AnalyzeCapacityOutput } from '@/ai/flows/analyze-capacity-flow';
import { suggestCapacityTier, type SuggestCapacityTierOutput } from '@/ai/flows/suggest-capacity-tier-flow';

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
}

export default function MasterFlowPage() {
  const [selectedTypesMap, setSelectedTypesMap] = useState<Map<string, Set<string>>>(new Map());
  
  const [interactionAnalysis, setInteractionAnalysis] = useState<AnalysisState<AnalyzeSystemOutput>>({ data: null, isLoading: false, error: null });
  const [capacityAnalysis, setCapacityAnalysis] = useState<AnalysisState<AnalyzeCapacityOutput>>({ data: null, isLoading: false, error: null });
  const [tierSuggestion, setTierSuggestion] = useState<AnalysisState<SuggestCapacityTierOutput>>({ data: null, isLoading: false, error: null });

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

  const handleAnalyzeProfile = async () => {
    const flowInput = getFlowInput();
    if (flowInput.components.length === 0) {
      setInteractionAnalysis({ data: null, isLoading: false, error: "Please select at least one component type to analyze." });
      setCapacityAnalysis({ data: null, isLoading: false, error: "Please select at least one component type to analyze." });
      setTierSuggestion({ data: null, isLoading: false, error: "Please select at least one component type to analyze." });
      setAnalysesTriggered(true);
      return;
    }

    setAnalysesTriggered(true);
    setInteractionAnalysis({ data: null, isLoading: true, error: null });
    setCapacityAnalysis({ data: null, isLoading: true, error: null });
    setTierSuggestion({ data: null, isLoading: true, error: null });

    try {
      // Promise.allSettled might be better if we want to show partial results even if one flow fails
      const [interactionResult, capacityResult, tierResult] = await Promise.all([
        analyzeSystem(flowInput).then(data => ({ data, error: null })).catch(error => ({ data: null, error: error instanceof Error ? error.message : "Interaction analysis failed." })),
        analyzeCapacityPotential(flowInput).then(data => ({ data, error: null })).catch(error => ({ data: null, error: error instanceof Error ? error.message : "Capacity analysis failed." })),
        suggestCapacityTier(flowInput).then(data => ({ data, error: null })).catch(error => ({ data: null, error: error instanceof Error ? error.message : "Tier suggestion failed." })),
      ]);

      setInteractionAnalysis({ data: interactionResult.data, isLoading: false, error: interactionResult.error });
      setCapacityAnalysis({ data: capacityResult.data, isLoading: false, error: capacityResult.error });
      setTierSuggestion({ data: tierResult.data, isLoading: false, error: tierResult.error });

    } catch (error) {
      console.error("Master Flow Analysis Orchestration Error:", error);
      const generalError = "An unexpected error occurred while orchestrating analyses.";
      if (!interactionAnalysis.data && !interactionAnalysis.error) setInteractionAnalysis({ data:null, isLoading: false, error: generalError});
      if (!capacityAnalysis.data && !capacityAnalysis.error) setCapacityAnalysis({ data:null, isLoading: false, error: generalError});
      if (!tierSuggestion.data && !tierSuggestion.error) setTierSuggestion({ data:null, isLoading: false, error: generalError});
    }
  };
  
  const countSelectedTypes = () => {
    let count = 0;
    selectedTypesMap.forEach(typesSet => count += typesSet.size);
    return count;
  };

  const isAnalysisButtonDisabled = countSelectedTypes() === 0 || interactionAnalysis.isLoading || capacityAnalysis.isLoading || tierSuggestion.isLoading;

  const renderAnalysisSection = <T,>(title: string, icon: React.ElementType, state: AnalysisState<T>, contentRenderer: (data: T) => React.ReactNode) => (
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
      </CardContent>
    </Card>
  );


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
                <div>
                  <CardHeader className="flex flex-row items-start space-x-3 pb-2 pt-4 px-4 bg-muted/30">
                    <component.icon className="h-7 w-7 text-accent mt-1 flex-shrink-0" />
                    <div className="flex-grow">
                      <CardTitle className="text-md font-semibold leading-tight text-foreground">{component.title}</CardTitle>
                      <Badge variant={complexityVariant(component.complexity)} className="mt-1 text-xs px-1.5 py-0.5">
                        {component.complexity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 pb-3 px-4 text-xs text-muted-foreground">
                    <p className="line-clamp-2">{component.eli5Details || "No detailed explanation available."}</p>
                  </CardContent>
                </div>
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
            {interactionAnalysis.isLoading || capacityAnalysis.isLoading || tierSuggestion.isLoading ? "Analyzing Full Profile..." : "Analyze Full Architectural Profile"}
          </Button>
          {countSelectedTypes() > 0 && !(interactionAnalysis.isLoading || capacityAnalysis.isLoading || tierSuggestion.isLoading) && (
            <p className="text-sm text-muted-foreground mt-2">
              {selectedTypesMap.size} component category(s) with {countSelectedTypes()} type(s) selected.
            </p>
          )}
          {countSelectedTypes() === 0 && !(interactionAnalysis.isLoading || capacityAnalysis.isLoading || tierSuggestion.isLoading) && (
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
          </div>
        )}
      </main>
      <footer className="py-8 text-center text-muted-foreground border-t border-border/50 mt-16">
        <p>&copy; {new Date().getFullYear()} Rustik. Orchestrating architectural wisdom.</p>
      </footer>
    </div>
  );
}
