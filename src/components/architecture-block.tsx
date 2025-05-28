
import type { FC } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { ArchitectureComponent, TypeDefinition, CodeSnippet } from '@/data/architecture-data';

interface ArchitectureBlockProps extends ArchitectureComponent {}

const ArchitectureBlock: FC<ArchitectureBlockProps> = ({
  title,
  icon: Icon,
  types,
  useCases,
  realWorldExamples,
  eli5Summary,
  eli5Details,
  complexity,
  implementationGuidance,
  codeSnippets, // Added codeSnippets
}) => {
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

  return (
    <Card className="flex flex-col shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/5 dark:bg-primary/10 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Icon className="h-10 w-10 text-primary" />
            <CardTitle className="text-2xl font-semibold text-primary">{title}</CardTitle>
          </div>
          <Badge variant={complexityVariant(complexity)} className="whitespace-nowrap">
            {complexity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-accent">Types</h3>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-foreground/80">
              {types.map((type: TypeDefinition, index: number) => <li key={index}>{type.name}</li>)}
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-2 text-accent">Use Cases</h3>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-foreground/80">
              {useCases.map((useCase, index) => <li key={index}>{useCase}</li>)}
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-2 text-accent">Real-World Examples</h3>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-foreground/80">
              {realWorldExamples.map((example, index) => <li key={index}>{example}</li>)}
            </ul>
          </div>
          {implementationGuidance && implementationGuidance.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2 text-accent">Implementation Guidance</h3>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-foreground/80">
                  {implementationGuidance.map((step, index) => <li key={index}>{step}</li>)}
                </ul>
              </div>
            </>
          )}
          {codeSnippets && codeSnippets.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3 text-accent">Code Snippets</h3>
                <div className="space-y-4">
                  {codeSnippets.map((snippet, index) => (
                    <div key={index} className="code-snippet-container rounded-md border bg-muted/30 overflow-hidden">
                      { (snippet.filename || snippet.description) &&
                        <div className="px-4 py-2 border-b bg-muted/50 text-xs text-muted-foreground">
                          {snippet.filename && <strong className="font-mono">{snippet.filename}</strong>}
                          {snippet.filename && snippet.description && <span className="mx-2">|</span>}
                          {snippet.description && <span className="italic">{snippet.description}</span>}
                        </div>
                      }
                      <pre className="p-4 text-xs overflow-x-auto">
                        <code className={`language-${snippet.language}`}>{snippet.code.trim()}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <div className="p-6 pt-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-accent/20">
            <AccordionTrigger className="text-base font-medium text-accent hover:no-underline hover:text-accent/80">
              {eli5Summary}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-foreground/70 pt-2">
              {eli5Details}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
};

export default ArchitectureBlock;
