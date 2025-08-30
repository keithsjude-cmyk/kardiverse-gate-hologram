import { useState, useEffect } from 'react';

interface KardiverseLogoProps {
  isVisible: boolean;
  className?: string;
}

export default function KardiverseLogo({ isVisible, className = '' }: KardiverseLogoProps) {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowLogo(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowLogo(false);
    }
  }, [isVisible]);

  return (
    <div className={`absolute top-8 left-8 transition-all duration-1000 ${
      showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    } ${className}`}>
      <div className="flex items-center space-x-3 hologram-glow p-4 rounded-lg bg-card/30 backdrop-blur-md hologram-border">
        {/* Animated logo icon */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse-glow">
            <div className="absolute inset-2 rounded-full border-2 border-primary animate-spin" 
                 style={{ animationDuration: '3s' }} />
            <div className="absolute inset-3 rounded-full bg-primary/30" />
            <div className="absolute inset-4 rounded-full bg-accent animate-pulse" />
          </div>
          <div className="absolute -inset-1 rounded-full bg-primary/20 animate-ping" />
        </div>
        
        {/* Logo text */}
        <div className="flex flex-col">
          <h1 className="text-xl font-bold hologram-text tracking-wider">
            KARDIVERSE
          </h1>
          <p className="text-xs text-muted-foreground tracking-widest uppercase">
            Gates of Display
          </p>
        </div>
      </div>
    </div>
  );
}