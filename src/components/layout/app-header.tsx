
'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react';

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

const mottoCycleTexts = ["Dream", "Click", "Architect", "Built with Rustik"];

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
  const [currentMottoCycleIndex, setCurrentMottoCycleIndex] = useState(0);
  const [showMottoSuffix, setShowMottoSuffix] = useState(false);

  const [highlightedNavIndex, setHighlightedNavIndex] = useState(0);
  const [currentDynamicMessage, setCurrentDynamicMessage] = useState("");
  const [messageKey, setMessageKey] = useState(0);

  const navItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pendulumStyle, setPendulumStyle] = useState<{ left: string; width: string; opacity: number }>({
    left: '0px',
    width: '0px',
    opacity: 0,
  });
  const navRef = useRef<HTMLElement | null>(null);


  useEffect(() => {
    const mottoIntervalId = setInterval(() => {
      setCurrentMottoCycleIndex((prevIndex) => (prevIndex + 1) % mottoCycleTexts.length);
    }, 30000); // Change motto text every 30 seconds

    const navInterval = setInterval(() => {
      setHighlightedNavIndex(prevIndex => (prevIndex + 1) % navItems.length);
    }, 5000); // Highlight next nav item every 5 seconds

    return () => {
      clearInterval(mottoIntervalId);
      clearInterval(navInterval);
    };
  }, [mottoCycleTexts.length]);

  useEffect(() => {
    const selectedNavItem = navItems[highlightedNavIndex];
    if (selectedNavItem.pageId === "master-flow") {
      setCurrentDynamicMessage("Master-Flow: Your hub for comprehensive architectural analysis!");
    } else {
      const randomIndex = Math.floor(Math.random() * generalMessages.length);
      setCurrentDynamicMessage(generalMessages[randomIndex]);
    }
    setMessageKey(prev => prev + 1);

    const targetElement = navItemRefs.current[highlightedNavIndex];
    if (targetElement && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      
      setPendulumStyle({
        left: `${targetRect.left - navRect.left}px`,
        width: `${targetRect.width}px`,
        opacity: 1,
      });
    } else {
      // Fallback or hide if target isn't rendered yet
      setPendulumStyle(prev => ({ ...prev, opacity: 0 }));
    }

  }, [highlightedNavIndex]);
  
  // Initial message set
  useEffect(() => {
    const initialNavItem = navItems[0];
     if (initialNavItem.pageId === "master-flow") {
      setCurrentDynamicMessage("Master-Flow: Your hub for comprehensive architectural analysis!");
    } else {
      const randomIndex = Math.floor(Math.random() * generalMessages.length);
      setCurrentDynamicMessage(generalMessages[randomIndex]);
    }
    setMessageKey(prev => prev + 1);
  },[])


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
              <div className="h-6 mt-1 text-sm text-center text-muted-foreground min-w-[150px] max-w-[250px] overflow-hidden">
                 <span className="animate-slide-in-out-text absolute left-1/2 -translate-x-1/2">
                  {mottoCycleTexts[currentMottoCycleIndex]}
                </span>
              </div>
              <div className="flex items-baseline space-x-1 text-xs text-muted-foreground mt-2 italic">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span onClick={handleMottoWordClick} className="cursor-pointer hover:text-primary transition-colors">Dream.</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Got an idea? Start visualizing your system here.</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span onClick={handleMottoWordClick} className="cursor-pointer hover:text-primary transition-colors">Click.</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select components and see how they interact.</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                       <span onClick={handleMottoWordClick} className="cursor-pointer hover:text-primary transition-colors">Architect.</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Design and understand complex architectures conceptually.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {showMottoSuffix && (
                  <span className="ml-1 animate-fade-in-fast">Do it with Rustik!</span>
                )}
              </div>
            </div>
          </Link>

          <nav ref={navRef} className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end relative">
            {navItems.map((item, index) => (
              <div 
                key={item.href} 
                ref={el => navItemRefs.current[index] = el}
                className="flex flex-col items-center py-1"
              >
                <Button 
                  variant="ghost" 
                  asChild 
                  className={`pb-0.5 text-sm sm:text-base px-2 sm:px-3 
                              ${pathname === item.href ? 'text-primary font-semibold' : ''}`}
                >
                  <Link href={item.href} className="flex items-center gap-1.5">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                </Button>
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
              </div>
            ))}
             <div
              className="absolute bottom-0 h-1 rounded-full flex overflow-hidden transition-all duration-500 ease-in-out pointer-events-none"
              style={{ left: pendulumStyle.left, width: pendulumStyle.width, opacity: pendulumStyle.opacity }}
            >
              {dotColors.map((bgColor, dotIndex) => (
                <span
                  key={`pendulum-dot-${dotIndex}`}
                  className={`h-full flex-grow ${bgColor}`} // Use flex-grow to fill width
                />
              ))}
            </div>
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
