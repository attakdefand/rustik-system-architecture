
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react'; // New Icon for Interview Prep

const RustikArchitectLogo = () => (
  <svg viewBox="0 0 100 100" fill="currentColor" className="h-12 w-12 text-primary relative z-10">
    {/* Stylized R */}
    <path d="M30 90 L30 10 L50 10 Q70 10 70 30 Q70 50 50 50 L50 50 L75 90 L55 90 L45 60 L30 90 Z" />
    <path d="M50 50 L50 70" stroke="currentColor" strokeWidth="10" fill="none" />
  </svg>
);

const navItems = [
  { href: "/master-flow", label: "Master-Flow", pageId: "master-flow" },
  { href: "/", label: "Components", pageId: "components" },
  { href: "/system-builder-challenges", label: "Builder Insights", pageId: "builder-insights" },
  { href: "/system-visualizer", label: "Visualizer", pageId: "visualizer" },
  { href: "/system-design-interview", label: "Interview Prep", icon: HelpCircle, pageId: "interview-prep" },
];

const generalMessages = [
  "Explore diverse architectural components and their types.",
  "Visualize system interactions and scaling potential with AI.",
  "Gain insights into real-world builder challenges for large systems.",
  "Prepare for system design interviews with practical examples and frameworks.",
  "Rustik: Conceptualize and understand complex, high-performance architectures.",
  "Discover the building blocks of modern, scalable software.",
  "Leverage AI to analyze and understand system design trade-offs.",
];

const dotColors = [
  'bg-red-500',
  'bg-orange-400',
  'bg-yellow-400',
  'bg-green-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-purple-500',
];

export function AppHeader() {
  const pathname = usePathname();
  const [mottoCycleTexts] = useState(["Dream", "Click", "Architect", "Built with Rustik"]);
  const [currentMottoCycleIndex, setCurrentMottoCycleIndex] = useState(0);
  const [showMottoSuffix, setShowMottoSuffix] = useState(false);

  const [highlightedNavIndex, setHighlightedNavIndex] = useState(0);
  const [currentDynamicMessage, setCurrentDynamicMessage] = useState("");
  const [messageKey, setMessageKey] = useState(0); // Used to re-trigger animation

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMottoCycleIndex((prevIndex) => (prevIndex + 1) % mottoCycleTexts.length);
    }, 30000);
    return () => clearInterval(intervalId);
  }, [mottoCycleTexts.length]);

  useEffect(() => {
    const navInterval = setInterval(() => {
      setHighlightedNavIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % navItems.length;
        const nextPageId = navItems[nextIndex].pageId;
        if (nextPageId === "master-flow") {
          setCurrentDynamicMessage("Master-Flow: Your hub for comprehensive architectural analysis!");
        } else {
          const randomIndex = Math.floor(Math.random() * generalMessages.length);
          setCurrentDynamicMessage(generalMessages[randomIndex]);
        }
        setMessageKey(prev => prev + 1); // Force re-render of message for animation
        return nextIndex;
      });
    }, 5000); // 5 seconds per item

    // Set initial message
    if (navItems[0].pageId === "master-flow") {
      setCurrentDynamicMessage("Master-Flow: Your hub for comprehensive architectural analysis!");
    } else {
      const randomIndex = Math.floor(Math.random() * generalMessages.length);
      setCurrentDynamicMessage(generalMessages[randomIndex]);
    }
    setMessageKey(prev => prev + 1);


    return () => clearInterval(navInterval);
  }, []);


  const handleMottoWordClick = () => {
    setShowMottoSuffix(true);
  };

  return (
    <header className="bg-card text-card-foreground shadow-lg sticky top-0 z-50 py-3">
      <div className="container mx-auto flex flex-col items-center">
        <div className="flex items-center justify-between w-full px-4 sm:px-6">
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span onClick={handleMottoWordClick} className="cursor-pointer hover:text-primary transition-colors">Dream.</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Got an idea? Start visualizing your system here.
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span onClick={handleMottoWordClick} className="cursor-pointer hover:text-primary transition-colors">Click.</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Select components and see how they interact.
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span onClick={handleMottoWordClick} className="cursor-pointer hover:text-primary transition-colors">Architect.</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Design and understand complex architectures conceptually.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {showMottoSuffix && (
                  <span className="ml-1 animate-fade-in-fast">Do it with Rustik!</span>
                )}
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
            {navItems.map((item, index) => (
              <div key={item.href} className="flex flex-col items-center py-1">
                <Button variant="ghost" asChild className={`pb-0.5 text-sm sm:text-base px-2 sm:px-3 ${pathname === item.href ? 'text-primary font-semibold' : (highlightedNavIndex === index ? 'text-accent font-medium' : '')}`}>
                  <Link href={item.href} className="flex items-center gap-1.5">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                </Button>
                {/* Static underline for active page */}
                {pathname === item.href && (
                  <div className="flex h-1 mt-0.5 rounded-full overflow-hidden">
                    {dotColors.map((bgColor, dotIndex) => (
                      <span
                        key={`${item.href}-active-underline-${dotIndex}`}
                        className={`h-full w-2 ${bgColor}`}
                      />
                    ))}
                  </div>
                )}
                {/* Animated blinking dots for highlighted item */}
                {highlightedNavIndex === index && pathname !== item.href && (
                  <div className="flex h-2 mt-0.5 space-x-0.5 items-center justify-center">
                    {dotColors.slice(0,3).map((color, dotIndex) => ( // Using 3 dots for subtlety
                        <span
                        key={`${item.href}-highlight-dot-${dotIndex}`}
                        className={`h-1.5 w-1.5 rounded-full ${color} ${
                            dotIndex === 0 ? 'animate-blink-red' : dotIndex === 1 ? 'animate-blink-yellow' : 'animate-blink-green'
                        }`}
                        />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
        {currentDynamicMessage && (
          <div key={messageKey} className="w-full text-center mt-2 px-4">
            <p className="text-sm text-muted-foreground animate-fade-in-out-message italic">
              {currentDynamicMessage}
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
