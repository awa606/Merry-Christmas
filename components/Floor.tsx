
import React from 'react';
import { MeshReflectorMaterial } from '@react-three/drei';
import { COLORS } from '../constants';

const Floor: React.FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.01, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={40}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color={COLORS.DARK_EMERALD}
        metalness={0.5}
        mirror={0} // Using reflector material instead of standard mirror
      />
    </mesh>
  );
};

export default Floor;
