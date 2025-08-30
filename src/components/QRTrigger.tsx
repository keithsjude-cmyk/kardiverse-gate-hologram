import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface QRTriggerProps {
  onScan: () => void;
}

export default function QRTrigger({ onScan }: QRTriggerProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showManualTrigger, setShowManualTrigger] = useState(false);

  useEffect(() => {
    const generateQR = async () => {
      try {
        // In a real implementation, this would be the URL to trigger the hologram
        const triggerUrl = `${window.location.origin}?trigger=hologram`;
        const qrDataUrl = await QRCode.toDataURL(triggerUrl, {
          errorCorrectionLevel: 'H',
          margin: 1,
          color: {
            dark: '#00BFFF',
            light: '#000011'
          },
          width: 256
        });
        setQrCodeUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQR();
  }, []);

  useEffect(() => {
    // Check if page was loaded with trigger parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('trigger') === 'hologram') {
      setTimeout(() => onScan(), 1000);
    }
  }, [onScan]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <Card className="p-8 hologram-border bg-card/50 backdrop-blur-sm">
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-bold hologram-text">
            Scan to Activate Hologram
          </h3>
          
          {qrCodeUrl && (
            <div className="flex justify-center">
              <div className="p-4 rounded-lg hologram-glow bg-primary/10">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code to activate hologram" 
                  className="w-48 h-48 animate-pulse-glow"
                />
              </div>
            </div>
          )}
          
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Scan this QR code with your mobile device to activate the Kardiverse hologram experience, 
            or use the manual trigger below for demonstration.
          </p>
          
          <div className="pt-4">
            <Button 
              onClick={() => setShowManualTrigger(!showManualTrigger)}
              variant="outline" 
              className="hologram-border"
            >
              {showManualTrigger ? 'Hide' : 'Show'} Manual Trigger
            </Button>
            
            {showManualTrigger && (
              <div className="mt-4">
                <Button 
                  onClick={onScan}
                  className="hologram-glow bg-primary hover:bg-primary-glow"
                  size="lg"
                >
                  🔮 Activate Hologram Demo
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}