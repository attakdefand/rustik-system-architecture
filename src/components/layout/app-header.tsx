
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// New A-style/Compass-style logo
const RustikArchitectLogo = () => (
  <svg viewBox="0 0 100 100" fill="currentColor" className="h-12 w-12 text-primary relative z-10">
    {/* A-shape legs */}
    <path d="M50 10 L20 90 L35 90 L50 40 L65 90 L80 90 L50 10 Z" />
    {/* Arc/crossbar */}
    <path d="M30 65 Q50 55 70 65" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
  </svg>
);

export function AppHeader() {
  const mottoTexts = ["Dream", "Click", "Architect", "Built with Rustik"];
  const [currentMottoIndex, setCurrentMottoIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMottoIndex((prevIndex) => (prevIndex + 1) % mottoTexts.length);
    }, 30000); // Change text every 30 seconds

    return () => clearInterval(intervalId);
  }, [mottoTexts.length]);

  const dotColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
  ];

  return (
    <header className="bg-card text-card-foreground shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-3 px-4 sm:px-6">
        <Link href="/" className="flex flex-col items-center group">
          <div className="relative flex flex-col items-center"> {/* Ensures vertical stacking of logo elements */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <RustikArchitectLogo />
              {dotColors.map((color, index) => (
                <span
                  key={index}
                  className={`absolute w-2 h-2 rounded-full animate-orbit-blink ${color}`}
                  style={{ animationDelay: `${index * 0.5}s` }}
                />
              ))}
            </div>
            <h1 className="text-3xl font-bold text-primary tracking-tight mt-1">Rustik</h1>
            {/* Cycling Motto Text - Positioned here */}
            <div className="h-6 mt-1 text-sm text-center text-muted-foreground min-w-[150px] overflow-hidden">
              <span className="animate-slide-in-out-text absolute left-1/2 -translate-x-1/2">
                {mottoTexts[currentMottoIndex]}
              </span>
            </div>
          </div>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/master-flow" className="flex flex-col items-center">
              <span>Master-Flow</span>
            </Link>
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
