
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LockKeyhole } from 'lucide-react'; // Icon was for Admin link

// A-style/Compass-style logo
const RustikArchitectLogo = () => (
  <svg viewBox="0 0 100 100" fill="currentColor" className="h-12 w-12 text-primary relative z-10">
    {/* A-shape legs */}
    <path d="M50 10 L20 90 L35 90 L50 40 L65 90 L80 90 L50 10 Z" />
    {/* Arc/crossbar */}
    <path d="M30 65 Q50 55 70 65" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
  </svg>
);

export function AppHeader() {
  const pathname = usePathname();
  const [mottoCycleTexts] = useState(["Dream", "Click", "Architect", "Built with Rustik"]);
  const [currentMottoCycleIndex, setCurrentMottoCycleIndex] = useState(0);
  const [showMottoSuffix, setShowMottoSuffix] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMottoCycleIndex((prevIndex) => (prevIndex + 1) % mottoCycleTexts.length);
    }, 30000); // Change text every 30 seconds

    return () => clearInterval(intervalId);
  }, [mottoCycleTexts.length]);

  const dotColors = [
    'bg-red-500',
    'bg-orange-400',
    'bg-yellow-400',
    'bg-green-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
  ];

  const mottoWords = ["Dream.", "Click.", "Architect."];
  const mottoTooltips = [
    "Got an idea? Start visualizing your system here.",
    "Select components and see how they interact.",
    "Design and understand complex architectures conceptually."
  ];

  const handleMottoWordClick = () => {
    setShowMottoSuffix(true);
  };

  const navItems = [
    { href: "/master-flow", label: "Master-Flow" },
    { href: "/", label: "Components" },
    { href: "/system-builder-challenges", label: "Builder Insights" },
    { href: "/system-visualizer", label: "Visualizer" },
    // { href: "/admin", label: "Admin Panel", icon: LockKeyhole }, // Admin link REMOVED
  ];

  return (
    <header className="bg-card text-card-foreground shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-3 px-4 sm:px-6">
        <Link href="/" className="flex flex-col items-center group">
          <div className="relative flex flex-col items-center">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <RustikArchitectLogo />
              {dotColors.map((color, index) => (
                <span
                  key={`logo-dot-${index}`}
                  className={`absolute w-2 h-2 rounded-full animate-orbit-blink ${color}`}
                  style={{ animationDelay: `${index * 0.5}s` }}
                />
              ))}
            </div>
            <h1 className="text-3xl font-bold text-primary tracking-tight mt-1">Rustik</h1>
            
            <div className="h-6 mt-1 text-sm text-center text-muted-foreground min-w-[150px] overflow-hidden">
              <span className="animate-slide-in-out-text absolute left-1/2 -translate-x-1/2">
                {mottoCycleTexts[currentMottoCycleIndex]}
              </span>
            </div>

             <div className="flex items-baseline space-x-1 text-xs text-muted-foreground mt-2 italic">
              <TooltipProvider>
                {mottoWords.map((word, index) => (
                  <Tooltip key={word}>
                    <TooltipTrigger asChild>
                      <span onClick={handleMottoWordClick} className="cursor-pointer hover:text-primary transition-colors">
                        {word}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{mottoTooltips[index]}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
              {showMottoSuffix && (
                <span className="ml-1 animate-fade-in-fast">Do it with Rustik!</span>
              )}
            </div>
          </div>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
          {navItems.map((item) => (
            <div key={item.href} className="flex flex-col items-center py-1">
              <Button variant="ghost" asChild className="pb-0.5 text-sm sm:text-base px-2 sm:px-3">
                <Link href={item.href} className="flex items-center gap-1.5">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </Link>
              </Button>
              {pathname === item.href && (
                <div className="flex h-1 mt-0.5 rounded-full overflow-hidden">
                  {dotColors.map((bgColor, index) => (
                    <span
                      key={`${item.href}-underline-${index}`}
                      className={`h-full w-2 ${bgColor}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}
