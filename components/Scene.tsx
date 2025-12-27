
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Foliage from './Foliage';
import Ornaments from './Ornaments';
import Star from './Star';
import Floor from './Floor';
import AmbientSparkles from './AmbientSparkles';
import { TreeState } from '../types';
import { COLORS } from '../constants';

interface SceneProps {
  treeState: TreeState;
}

const Scene: React.FC<SceneProps> = ({ treeState }) => {
  const groupRef = useRef<THREE.Group>(null);
  const lerpFactor = 0.03;
  const progressRef = useRef(0);

  useFrame(() => {
    const targetProgress = treeState === TreeState.FORMED ? 1 : 0;
    progressRef.current = THREE.MathUtils.lerp(progressRef.current, targetProgress, lerpFactor);
  });

  return (
    <group ref={groupRef}>
      {/* Dynamic Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={2} color={COLORS.BRIGHT_GOLD} />
      <spotLight 
        position={[0, 20, 0]} 
        angle={0.3} 
        penumbra={1} 
        intensity={3} 
        castShadow 
        color={COLORS.GOLD}
      />

      {/* Tree Components */}
      <Foliage progressRef={progressRef} />
      <Ornaments progressRef={progressRef} />
      <Star progressRef={progressRef} />
      
      {/* Environment Extras */}
      <AmbientSparkles />
      <Floor />

      {/* Tree Trunk Base (Visible when formed) */}
      <mesh position={[0, -2, 0]} receiveShadow>
        <cylinderGeometry args={[0.8, 1, 4, 32]} />
        <meshStandardMaterial 
          color="#1a0f00" 
          roughness={0.8} 
          metalness={0.1} 
          opacity={progressRef.current} 
          transparent
        />
      </mesh>
    </group>
  );
};

export default Scene;
