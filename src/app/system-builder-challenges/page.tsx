
import { AppHeader } from '@/components/layout/app-header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, Settings, Code, Network, Database, Server, ShieldCheck, DollarSign, Layers, Activity, Scaling, Repeat, Wrench } from 'lucide-react';

export default function SystemBuilderChallengesPage() {
  const initialChallenges = [
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

  const scalingChallenges = [
    {
      icon: Database,
      title: 'Database Scalability',
      description: 'This is often the biggest challenge. Your database layer must also be able to handle this scale. This typically involves techniques like database sharding (splitting data across multiple databases), read replicas, using highly scalable NoSQL databases (e.g., Cassandra, ScyllaDB, DynamoDB), and robust caching strategies. The Rustik app currently doesn\'t detail database components, but they are critical.',
    },
    {
      icon: Server,
      title: 'Network Infrastructure',
      description: 'You need massive bandwidth, robust peering arrangements with ISPs, and sufficient capacity at each Point of Presence (PoP).',
    },
    {
      icon: Code,
      title: 'Application-Level Design',
      description: 'The specific logic of your application running on the Rust nodes must be highly optimized. Inefficient algorithms or poorly designed data access patterns can still bring a system to its knees.',
    },
    {
      icon: Layers,
      title: 'Caching, Caching, Caching',
      description: 'Aggressive caching at multiple levels (CDN, load balancer, in-memory caches on app nodes, database query caches) is essential to reduce load on backend systems.',
    },
    {
      icon: ShieldCheck,
      title: 'Operational Excellence',
      description: 'Requires a mature approach to operations, including:',
      subItems: [
        { icon: Activity, text: 'Monitoring & Alerting: Sophisticated monitoring to detect issues before they impact users.' },
        { icon: Scaling, text: 'Auto-scaling: Systems that can automatically add or remove capacity based on demand.' },
        { icon: Repeat, text: 'Deployment Strategies: Blue/green deployments, canary releases to roll out changes safely.' },
        { icon: Wrench, text: 'Configuration Management: Tools to manage the configuration of thousands of servers consistently.' },
      ],
    },
    {
      icon: DollarSign,
      title: 'Cost',
      description: 'Building, deploying, and maintaining infrastructure at this scale is a significant financial investment.',
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
          {initialChallenges.map((challenge, index) => (
            <Card key={`initial-${index}`} className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
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

        <div className="text-center my-16 sm:my-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-gray-800 dark:text-gray-100">
            Key Considerations for Massive Scale
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Achieving true massive scale (e.g., 1 billion users) with the described architectural components requires addressing these additional critical areas:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {scalingChallenges.map((challenge, index) => (
            <Card key={`scaling-${index}`} className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col">
              <CardHeader className="flex flex-row items-start gap-4 pb-4">
                <challenge.icon className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <CardTitle className="text-xl font-semibold text-primary">{challenge.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-foreground/80 mb-3">{challenge.description}</p>
                {challenge.subItems && challenge.subItems.length > 0 && (
                  <ul className="space-y-2 mt-3 pt-3 border-t border-border/50">
                    {challenge.subItems.map((item, subIndex) => (
                      <li key={`sub-${subIndex}`} className="flex items-start gap-3 text-sm text-foreground/70">
                        <item.icon className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
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
