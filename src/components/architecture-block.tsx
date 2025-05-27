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
import { Badge } from '@/components/ui/badge'; // Added Badge import
import type { ArchitectureComponent } from '@/data/architecture-data'; // Ensure this type is imported

interface ArchitectureBlockProps extends ArchitectureComponent {} // Use the imported type

const ArchitectureBlock: FC<ArchitectureBlockProps> = ({
  title,
  icon: Icon,
  types,
  useCases,
  realWorldExamples,
  eli5Summary,
  eli5Details,
  complexity, // Added complexity
}) => {
  const complexityVariant = (complexityLevel: ArchitectureComponent['complexity']): 'default' | 'secondary' | 'destructive' => {
    switch (complexityLevel) {
      case 'Beginner':
        return 'default'; // Or 'secondary' if default is too strong
      case 'Intermediate':
        return 'secondary'; // Or a custom variant if needed
      case 'Advanced':
        return 'destructive'; // Or a custom variant for advanced
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
              {types.map((type, index) => <li key={index}>{type}</li>)}
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
