
import { AppHeader } from '@/components/layout/app-header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Settings, Code, Network } from 'lucide-react';

export default function SystemBuilderChallengesPage() {
  const challenges = [
    {
      icon: Lightbulb,
      title: 'Understanding Requirements',
      description: 'A "powerful system" means different things for different applications. The tool would need to understand specific needs like scalability, security, data storage, real-time features, etc.',
    },
    {
      icon: Settings,
      title: 'Component Interaction & Configuration',
      description: 'Simply listing components isn\'t enough. They need to be configured to work together correctly. For example, a load balancer needs to know which app nodes to send traffic to, and the app nodes need to connect to the right database. This involves intricate logic.',
    },
    {
      icon: Code,
      title: 'Generating Glue Code & Infrastructure',
      description: 'Beyond just picking components, the system would need to generate all the connecting code, configuration files, deployment scripts, and potentially even infrastructure-as-code (like Terraform or CloudFormation).',
    },
    {
      icon: Network,
      title: 'Vast Number of Combinations',
      description: 'The number of ways components can be combined and configured is enormous. Ensuring the generated system is truly "powerful" and correct for a given set of choices is a massive challenge.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-10 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-gray-800 dark:text-gray-100">
            The Dream of "Click-to-Build" Systems
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            While the idea of automatically generating a powerful, production-ready system with a few clicks is exciting, there are significant complexities involved. Here are some of the key challenges:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {challenges.map((challenge, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <challenge.icon className="h-8 w-8 text-primary" />
                <CardTitle className="text-xl font-semibold text-primary">{challenge.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">{challenge.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mb-12 sm:mb-16 p-8 bg-card rounded-xl shadow-lg">
          <h3 className="text-3xl font-bold tracking-tight mb-6 text-gray-800 dark:text-gray-100">
            A More Feasible Approach: The System Visualizer
          </h3>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Instead of full system generation, a more achievable first step is a "System Visualizer." This tool would allow you to select architectural components and see a high-level diagram of how they might connect, along with explanations of their interactions. It's a way to learn and experiment with system design in a more guided way.
          </p>
          <Button asChild size="lg">
            <Link href="/system-visualizer">Explore the System Visualizer Concept</Link>
          </Button>
        </div>
      </main>
      <footer className="py-8 text-center text-muted-foreground border-t border-border/50 mt-16">
        <p>&copy; {new Date().getFullYear()} Rustik. Exploring the frontiers of system design.</p>
      </footer>
    </div>
  );
}
