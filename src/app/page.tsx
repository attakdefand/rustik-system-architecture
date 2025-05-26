import { AppHeader } from '@/components/layout/app-header';
import ArchitectureBlock from '@/components/architecture-block';
import { architectureComponents } from '@/data/architecture-data';

export default function Home() {
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {architectureComponents.map((component) => (
            <ArchitectureBlock key={component.id} {...component} />
          ))}
        </div>
      </main>
      <footer className="py-8 text-center text-muted-foreground border-t border-border/50 mt-16">
        <p>&copy; {new Date().getFullYear()} Rustik. Illustrating powerful backend architectures.</p>
      </footer>
    </div>
  );
}
