
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Updated, more modern R-like SVG icon for Rustik
const RustikLogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="h-10 w-10 text-primary">
    <path d="M25 15 H45 V35 H70 C80 35 85 42.5 85 50 C85 57.5 80 65 70 65 H45 V85 H25 V15 Z M45 50 H68 C73 50 73 55 68 55 H45 V50 Z" />
  </svg>
);


export function AppHeader() {
  return (
    <header className="bg-card text-card-foreground shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <RustikLogoIcon />
          <h1 className="text-3xl font-bold text-primary tracking-tight">Rustik</h1>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/master-flow">Master-Flow</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/">Components</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/system-builder-challenges">Builder Insights</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/system-visualizer">Visualizer</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
