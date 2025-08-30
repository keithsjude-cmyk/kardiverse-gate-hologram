import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import HologramAvatar from '@/components/HologramAvatar';
import QRTrigger from '@/components/QRTrigger';
import VoiceGreeting from '@/components/VoiceGreeting';
import KardiverseLogo from '@/components/KardiverseLogo';
import BackgroundEffects from '@/components/BackgroundEffects';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [isHologramActive, setIsHologramActive] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [greetingComplete, setGreetingComplete] = useState(false);

  const handleScan = () => {
    setIsHologramActive(true);
    setShowDemo(true);
  };

  const resetDemo = () => {
    setIsHologramActive(false);
    setShowDemo(false);
    setGreetingComplete(false);
  };

  useEffect(() => {
    // Auto-reset demo after 30 seconds
    if (showDemo) {
      const timer = setTimeout(() => {
        resetDemo();
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [showDemo]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background Effects */}
      <BackgroundEffects isActive={isHologramActive} />
      
      {/* Kardiverse Logo */}
      <KardiverseLogo isVisible={showDemo} />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {!showDemo ? (
          // Landing Screen
          <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <Card className="max-w-4xl mx-auto p-8 hologram-border bg-card/30 backdrop-blur-md">
              <div className="text-center space-y-8">
                {/* Hero Section */}
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-bold hologram-text mb-6">
                    KARDIVERSE
                  </h1>
                  <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
                    Gates of Display
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Experience the future with our interactive hologram avatar demo. 
                    Scan the QR code to witness cutting-edge holographic technology come to life.
                  </p>
                </div>
                
                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 my-12">
                  <div className="p-6 rounded-lg hologram-border bg-card/20">
                    <div className="text-4xl mb-4">🎭</div>
                    <h3 className="text-xl font-semibold mb-2 text-primary">3D Hologram Avatar</h3>
                    <p className="text-sm text-muted-foreground">
                      Interactive 3D avatar with realistic holographic effects and animations
                    </p>
                  </div>
                  <div className="p-6 rounded-lg hologram-border bg-card/20">
                    <div className="text-4xl mb-4">🗣️</div>
                    <h3 className="text-xl font-semibold mb-2 text-primary">AI Voice Synthesis</h3>
                    <p className="text-sm text-muted-foreground">
                      Neural text-to-speech with synchronized lip movements and subtitles
                    </p>
                  </div>
                  <div className="p-6 rounded-lg hologram-border bg-card/20">
                    <div className="text-4xl mb-4">📱</div>
                    <h3 className="text-xl font-semibold mb-2 text-primary">QR Activation</h3>
                    <p className="text-sm text-muted-foreground">
                      Instant activation via QR code scan or NFC trigger
                    </p>
                  </div>
                </div>
                
                {/* QR Trigger */}
                <QRTrigger onScan={handleScan} />
              </div>
            </Card>
          </div>
        ) : (
          // Hologram Demo Screen
          <div className="min-h-screen relative">
            {/* Avatar Container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-4xl h-96 md:h-[600px]">
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-2xl hologram-text animate-pulse">
                      Loading Hologram...
                    </div>
                  </div>
                }>
                  <HologramAvatar 
                    isActive={isHologramActive} 
                    onGreetingComplete={() => setGreetingComplete(true)}
                  />
                </Suspense>
              </div>
            </div>
            
            {/* Voice Greeting */}
            <VoiceGreeting 
              isActive={isHologramActive} 
              onComplete={() => setGreetingComplete(true)} 
            />
            
            {/* Demo Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button 
                onClick={resetDemo}
                variant="outline" 
                className="hologram-border"
                size="sm"
              >
                🔄 Reset Demo
              </Button>
              {greetingComplete && (
                <div className="text-xs text-muted-foreground text-center">
                  Demo will auto-reset in 30s
                </div>
              )}
            </div>
            
            {/* Demo Info */}
            <div className="absolute bottom-4 right-4 max-w-sm">
              <Card className="p-4 hologram-border bg-card/80 backdrop-blur-md">
                <h4 className="font-semibold text-primary mb-2">Demo Features</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Interactive 3D holographic avatar</li>
                  <li>• AI voice synthesis greeting</li>
                  <li>• Real-time particle effects</li>
                  <li>• Responsive design (mobile & desktop)</li>
                  <li>• QR code trigger system</li>
                </ul>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
