
'use client';

import { useState, useRef } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { architectureComponents, type ArchitectureComponent, type CodeSnippet } from '@/data/architecture-data';
import { FileCode, Code2 } from 'lucide-react'; // Using Code2 for page title

export default function CodeSnippetsPage() {
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

  const componentsWithSnippets = architectureComponents.filter(
    (component) => component.codeSnippets && component.codeSnippets.length > 0
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-10 sm:py-16">
        <div
          className="text-center mb-12 sm:mb-16 group"
          onMouseEnter={() => triggerHoverMessage("Browse practical code examples for various architectural components.")}
        >
          <Code2 className="h-24 w-24 text-primary mb-8 mx-auto group-hover:text-accent transition-colors" />
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-gray-800 dark:text-gray-100 group-hover:text-accent transition-colors">
            Architectural Code Snippets
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore practical code examples related to the architectural components discussed in Rustik. These snippets offer a glimpse into how concepts might be implemented.
          </p>
        </div>

        {componentsWithSnippets.length > 0 ? (
          <Accordion type="multiple" className="w-full max-w-4xl mx-auto space-y-6">
            {componentsWithSnippets.map((component) => {
              const ComponentIcon = component.icon;
              return (
                <AccordionItem
                  value={component.id}
                  key={component.id}
                  className="border border-border/70 rounded-xl shadow-lg overflow-hidden bg-card"
                >
                  <AccordionTrigger
                    className="px-6 py-4 text-xl font-semibold hover:no-underline bg-muted/30 hover:bg-muted/50 data-[state=open]:border-b data-[state=open]:border-border/70 group"
                    onMouseEnter={() => triggerHoverMessage(`View snippets for ${component.title}`)}
                  >
                    <div className="flex items-center gap-3 text-left group-hover:text-accent transition-colors">
                      <ComponentIcon className="h-7 w-7 text-primary flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-200">{component.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-6 space-y-6">
                    {component.codeSnippets?.map((snippet, index) => (
                      <Card
                        key={index}
                        className="code-snippet-container rounded-lg border bg-muted/20 shadow-md overflow-hidden group"
                        onMouseEnter={() => triggerHoverMessage(snippet.description || `Code snippet in ${snippet.language}`)}
                      >
                        {(snippet.filename || snippet.description) && (
                          <CardHeader className="px-4 py-2.5 border-b bg-muted/40">
                            <CardTitle className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                              {snippet.filename && <strong className="font-mono text-sm text-foreground/80">{snippet.filename}</strong>}
                              {snippet.filename && snippet.description && <span className="mx-2 text-muted-foreground/70">|</span>}
                              {snippet.description && <span className="italic">{snippet.description}</span>}
                            </CardTitle>
                          </CardHeader>
                        )}
                        <CardContent className="p-0">
                          <pre className="p-4 text-xs overflow-x-auto bg-muted/10">
                            <code className={`language-${snippet.language}`}>{snippet.code.trim()}</code>
                          </pre>
                        </CardContent>
                      </Card>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <Card className="w-full max-w-2xl mx-auto shadow-lg text-center">
            <CardHeader>
              <CardTitle className="text-primary">No Code Snippets Available Yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                It looks like there are no code snippets currently defined for any architectural components.
                You can add them in <code className="font-mono bg-muted px-1 py-0.5 rounded-sm">src/data/architecture-data.ts</code>.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {hoverMessage && (
        <div
          key={Date.now()}
          className="fixed bottom-5 right-5 p-4 bg-accent text-accent-foreground rounded-lg shadow-2xl z-[100] w-auto max-w-md animate-fade-in-out-message border-2 border-primary/50"
        >
          <div className="flex items-center">
            <div className="flex space-x-1.5 mr-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400 animate-ping opacity-80" style={{ animationDuration: '1.5s' }}></span>
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-300 animate-ping opacity-80" style={{ animationDelay: '0.25s', animationDuration: '1.5s' }}></span>
              <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-ping opacity-80" style={{ animationDelay: '0.5s', animationDuration: '1.5s' }}></span>
            </div>
            <p className="text-sm">{hoverMessage}</p>
          </div>
        </div>
      )}

      <footer className="py-8 text-center text-muted-foreground border-t border-border/50 mt-16">
        <p>&copy; {new Date().getFullYear()} Rustik. Bridging concepts with code.</p>
      </footer>
    </div>
  );
}
