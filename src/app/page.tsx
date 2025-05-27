
import { AppHeader } from '@/components/layout/app-header';
import ArchitectureBlock from '@/components/architecture-block';
import { architectureComponents, type ArchitectureComponent } from '@/data/architecture-data';

interface CategorizedComponents {
  category: string;
  components: ArchitectureComponent[];
}

export default function Home() {
  const categorizedComponents: CategorizedComponents[] = [
    {
      category: 'Networking & Connectivity',
      components: architectureComponents.filter(c => ['anycast-ip', 'load-balancers', 'api-gateway', 'network-infra-strategies'].includes(c.id)),
    },
    {
      category: 'Application & Compute Logic',
      components: architectureComponents.filter(c => ['rust-app-nodes', 'microservices-architecture', 'async-io', 'per-core-socket', 'api-design-styles', 'app-design-principles'].includes(c.id)),
    },
    {
      category: 'Data Management & Storage',
      components: architectureComponents.filter(c => ['database-strategies', 'caching-strategies', 'shared-state-data-plane'].includes(c.id)),
    },
    {
      category: 'Operations, Scaling & Security',
      components: architectureComponents.filter(c => ['service-discovery-control-plane', 'observability-ops', 'deployment-cicd', 'autoscaling-resilience', 'security-architecture-principles', 'cost-management'].includes(c.id)),
    },
  ];

  // Fallback for any components not categorized explicitly (though all current ones should be)
  const uncategorizedComponents = architectureComponents.filter(
    c => !categorizedComponents.flatMap(cat => cat.components).find(comp => comp.id === c.id)
  );
  if (uncategorizedComponents.length > 0) {
    categorizedComponents.push({
        category: 'Other Components',
        components: uncategorizedComponents
    });
  }


  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-10 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-gray-800 dark:text-gray-100">
            The Backbone of <span className="text-primary">Modern Systems</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the core architectural components that empower robust, high-performance applications. Each element detailed below is a vital piece in constructing globally distributed and resilient services.
          </p>
        </div>
        
        <div className="space-y-16">
          {categorizedComponents.map(categoryGroup => (
            categoryGroup.components.length > 0 && (
              <section key={categoryGroup.category}>
                <h3 className="text-3xl font-bold tracking-tight mb-8 text-center text-gray-700 dark:text-gray-200 border-b-2 border-primary/30 pb-3">
                  {categoryGroup.category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {categoryGroup.components.map((component) => (
                    <ArchitectureBlock key={component.id} {...component} />
                  ))}
                </div>
              </section>
            )
          ))}
        </div>
      </main>
      <footer className="py-8 text-center text-muted-foreground border-t border-border/50 mt-16">
        <p>&copy; {new Date().getFullYear()} Rustik. Illustrating powerful backend architectures.</p>
      </footer>
    </div>
  );
}
