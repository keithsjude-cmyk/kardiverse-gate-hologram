import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface VoiceGreetingProps {
  isActive: boolean;
  onComplete?: () => void;
}

export default function VoiceGreeting({ isActive, onComplete }: VoiceGreetingProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);

  const greetingText = "Welcome to the Gates of Display, from Kardiverse.";

  const speakGreeting = () => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(greetingText);
      
      // Configure voice settings for a more robotic/AI feel
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      
      // Try to find a more suitable voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Microsoft') || 
        voice.name.includes('Google') ||
        voice.lang.includes('en')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        onComplete?.();
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        console.error('Speech synthesis error');
        onComplete?.();
      };

      speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported');
      onComplete?.();
    }
  };

  useEffect(() => {
    if (isActive) {
      // Small delay for dramatic effect
      const timer = setTimeout(() => {
        speakGreeting();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  useEffect(() => {
    // Ensure voices are loaded
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        speechSynthesis.getVoices();
      };
      
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      } else {
        loadVoices();
      }
    }
  }, []);

  if (!isActive) return null;

  return (
    <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center space-y-4 z-10">
      {showSubtitles && (
        <div className="bg-card/80 backdrop-blur-md rounded-lg px-6 py-4 hologram-border max-w-2xl mx-4">
          <p className={`text-center text-lg font-medium transition-all duration-300 ${
            isPlaying ? 'hologram-text animate-pulse-glow' : 'text-foreground'
          }`}>
            "{greetingText}"
          </p>
        </div>
      )}
      
      <div className="flex space-x-4">
        <Button 
          onClick={speakGreeting}
          disabled={isPlaying}
          variant="outline"
          className="hologram-border"
        >
          {isPlaying ? '🔊 Speaking...' : '🔊 Repeat Greeting'}
        </Button>
        
        <Button 
          onClick={() => setShowSubtitles(!showSubtitles)}
          variant="outline"
          className="hologram-border"
        >
          {showSubtitles ? '👁️ Hide' : '👁️ Show'} Subtitles
        </Button>
      </div>
    </div>
  );
}