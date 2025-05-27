
import { AppHeader } from '@/components/layout/app-header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye, Construction } from 'lucide-react';

export default function SystemVisualizerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-10 sm:py-16 flex flex-col items-center justify-center text-center">
        <Construction className="h-24 w-24 text-primary mb-8" />
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 text-gray-800 dark:text-gray-100">
          System Visualizer - Coming Soon!
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          This is where the System Visualizer will live. Imagine a tool where you can select architectural components and see them come together in a conceptual diagram, helping you understand potential system structures.
        </p>
        <div className="space-y-4">
            <p className="text-md text-foreground/80">
                We're envisioning features like:
            </p>
            <ul className="list-disc list-inside text-left max-w-md mx-auto text-foreground/70 space-y-2">
                <li>Selecting components from our library.</li>
                <li>Viewing a dynamic, high-level diagram of chosen components.</li>
                <li>Getting AI-powered explanations of how selected components might interact.</li>
                <li>Exploring common architectural patterns.</li>
            </ul>
        </div>
        <div className="mt-12">
          <Button asChild variant="outline">
            <Link href="/system-builder-challenges">Learn about System Building Challenges</Link>
          </Button>
        </div>
      </main>
      <footer className="py-8 text-center text-muted-foreground border-t border-border/50 mt-16">
        <p>&copy; {new Date().getFullYear()} Rustik. Visualizing the future of architecture.</p>
      </footer>
    </div>
  );
}
