
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, BrainCircuit, ListChecks, Info } from 'lucide-react';
import Link from 'next/link';
import { analyzeCapacityPotential, type AnalyzeCapacityInput, type AnalyzeCapacityOutput } from '@/ai/flows/analyze-capacity-flow';
import { architectureComponents } from '@/data/architecture-data'; // To get icons

function CapacityAnalyzerContent() {
  const searchParams = useSearchParams();
  const [selection, setSelection] = useState<AnalyzeCapacityInput | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeCapacityOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const selectionString = searchParams.get('selection');
    if (selectionString) {
      try {
        const parsedSelection: AnalyzeCapacityInput = JSON.parse(decodeURIComponent(selectionString));
        if (parsedSelection && parsedSelection.components && parsedSelection.components.length > 0) {
          setSelection(parsedSelection);
        } else {
          setError("No valid components selected. Please make selections in the System Visualizer.");
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Failed to parse selection from query params", e);
        setError("Invalid selection data. Please try again from the System Visualizer.");
        setIsLoading(false);
      }
    } else {
      setError("No selection provided. Please make selections in the System Visualizer.");
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selection && selection.components.length > 0) {
      setIsLoading(true);
      setError(null);
      analyzeCapacityPotential(selection)
        .then(result => {
          setAnalysisResult(result);
        })
        .catch(err => {
          console.error("AI Capacity Analysis Error:", err);
          setError(err instanceof Error ? err.message : "An unknown error occurred during AI analysis.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selection]);

  const getComponentIcon = (title: string) => {
    const component = architectureComponents.find(c => c.title === title);
    return component ? component.icon : Info;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-10 sm:py-16 flex flex-col items-center">
        <div className="text-center w-full max-w-3xl mb-12">
          <BrainCircuit className="h-24 w-24 text-primary mb-8 mx-auto" />
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 text-gray-800 dark:text-gray-100">
            Scaling Potential Analysis
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Conceptual AI-powered analysis of how your selected architectural components might contribute to overall system capacity and handle large user loads.
          </p>
        </div>

        {!selection && !isLoading && error && (
          <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertTriangle className="mr-2 h-6 w-6" />
                Analysis Blocked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button asChild>
                <Link href="/system-visualizer">Go to System Visualizer</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {selection && selection.components.length > 0 && (
          <div className="w-full max-w-4xl space-y-10">
            <Card className="shadow-xl rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-accent flex items-center">
                  <ListChecks className="h-6 w-6 mr-3" />
                  Your Selected Configuration:
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {selection.components.map((comp, index) => {
                    const Icon = getComponentIcon(comp.componentTitle);
                    return (
                      <li key={index} className="p-3 rounded-md bg-muted/30 border">
                        <div className="flex items-center mb-1">
                          <Icon className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                          <span className="font-medium">{comp.componentTitle}</span>
                        </div>
                        {comp.selectedTypes && comp.selectedTypes.length > 0 && (
                          <ul className="list-disc list-inside pl-7 text-sm text-foreground/80 space-y-0.5 mt-1">
                            {comp.selectedTypes.map(type => (
                              <li key={type}>{type}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-xl rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-accent flex items-center">
                  <BrainCircuit className="h-6 w-6 mr-3" />
                  AI-Generated Scaling Analysis:
                </CardTitle>
                <CardDescription>
                  This conceptual analysis explores strengths, potential bottlenecks, and scaling factors for your selected components.
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none p-6 bg-card border rounded-lg shadow-inner text-foreground/90 space-y-4">
                {isLoading && (
                  <>
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </>
                )}
                {error && !isLoading && (
                  <div className="p-4 rounded-md bg-destructive/10 text-destructive flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Analysis Failed</p>
                      <p className="text-xs">{error}</p>
                    </div>
                  </div>
                )}
                {analysisResult && !isLoading && !error && (
                  <div dangerouslySetInnerHTML={{ __html: analysisResult.analysis.replace(/\n/g, '<br />') }} />
                )}
              </CardContent>
            </Card>
             <div className="text-center mt-8">
                <Button asChild variant="outline">
                    <Link href="/system-visualizer">Back to System Visualizer</Link>
                </Button>
            </div>
          </div>
        )}
      </main>
      <footer className="py-8 text-center text-muted-foreground border-t border-border/50 mt-16">
        <p>&copy; {new Date().getFullYear()} Rustik. Analyzing hyperscale potential.</p>
      </footer>
    </div>
  );
}


export default function CapacityAnalyzerPage() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <CapacityAnalyzerContent />
    </Suspense>
  );
}
