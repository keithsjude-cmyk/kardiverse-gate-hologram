import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Text } from '@react-three/drei';
import * as THREE from 'three';

interface HologramAvatarProps {
  isActive: boolean;
  onGreetingComplete?: () => void;
}

function Avatar({ isActive }: { isActive: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const [scale, setScale] = useState(0);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  useEffect(() => {
    if (isActive) {
      setScale(1);
    } else {
      setScale(0);
    }
  }, [isActive]);

  return (
    <group ref={meshRef} scale={scale}>
      {/* Head */}
      <Sphere args={[0.8, 32, 32]} position={[0, 1.5, 0]}>
        <meshStandardMaterial 
          color="#00BFFF" 
          transparent 
          opacity={0.7}
          emissive="#004080"
          wireframe={false}
        />
      </Sphere>
      
      {/* Body */}
      <Box args={[1.2, 2, 0.8]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#0080FF" 
          transparent 
          opacity={0.6}
          emissive="#002060"
          wireframe={false}
        />
      </Box>
      
      {/* Arms */}
      <Box args={[0.3, 1.5, 0.3]} position={[-0.8, 0.2, 0]}>
        <meshStandardMaterial 
          color="#0080FF" 
          transparent 
          opacity={0.6}
          emissive="#002060"
        />
      </Box>
      <Box args={[0.3, 1.5, 0.3]} position={[0.8, 0.2, 0]}>
        <meshStandardMaterial 
          color="#0080FF" 
          transparent 
          opacity={0.6}
          emissive="#002060"
        />
      </Box>
      
      {/* Holographic particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Sphere 
          key={i} 
          args={[0.02, 8, 8]} 
          position={[
            (Math.random() - 0.5) * 3,
            Math.random() * 3,
            (Math.random() - 0.5) * 3
          ]}
        >
          <meshBasicMaterial 
            color="#00FFFF" 
            transparent 
            opacity={Math.random() * 0.8 + 0.2}
          />
        </Sphere>
      ))}
    </group>
  );
}

function Scene({ isActive }: { isActive: boolean }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00BFFF" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8000FF" />
      <Avatar isActive={isActive} />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

export default function HologramAvatar({ isActive, onGreetingComplete }: HologramAvatarProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Scene isActive={isActive} />
      </Canvas>
      
      {/* Holographic overlay effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scan-lines w-full h-full"></div>
        <div className="particle-field">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}