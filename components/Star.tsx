
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, TREE_CONFIG } from '../constants';

interface StarProps {
  progressRef: React.MutableRefObject<number>;
}

const Star: React.FC<StarProps> = ({ progressRef }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const progress = progressRef.current;

    // Position: follow tree top height
    meshRef.current.position.y = (TREE_CONFIG.TREE_HEIGHT - 1.5) * progress;
    meshRef.current.position.x = Math.sin(time) * 0.1 * (1 - progress); // Subtle wobble in chaos
    
    // Rotation: elegant spin
    meshRef.current.rotation.y = time * 0.5;
    
    // Scale: pop in as tree forms
    meshRef.current.scale.setScalar(progress * 1.5);
    
    // Opacity
    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.opacity = progress;
    }
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        color={COLORS.BRIGHT_GOLD} 
        emissive={COLORS.GOLD} 
        emissiveIntensity={4} 
        metalness={1} 
        roughness={0}
        transparent
      />
      <pointLight color={COLORS.BRIGHT_GOLD} intensity={5} distance={10} />
    </mesh>
  );
};

export default Star;
