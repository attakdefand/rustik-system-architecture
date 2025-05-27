
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Simple R-like SVG icon for Rustik
const RustikLogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="h-10 w-10 text-primary">
    <path d="M25 15 H75 C85 15 85 25 75 25 H45 V40 H70 C80 40 80 50 70 50 H45 V85 H30 V15 H25 Z" />
    <path d="M45 50 L75 85 H60 L30 50 H45 Z" />
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
