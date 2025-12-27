
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import Scene from './components/Scene';
import Overlay from './components/Overlay';
import { TreeState } from './types';
import { COLORS } from './constants';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.CHAOS);

  const toggleState = () => {
    setTreeState(prev => prev === TreeState.CHAOS ? TreeState.FORMED : TreeState.CHAOS);
  };

  return (
    <div className="relative w-full h-screen bg-[#01160d]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 5, 25]} fov={45} />
        
        <color attach="background" args={[COLORS.DARK_EMERALD]} />
        <fog attach="fog" args={[COLORS.DARK_EMERALD, 10, 50]} />

        <Suspense fallback={null}>
          <Environment preset="night" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <Scene treeState={treeState} />

          <EffectComposer disableNormalPass>
            <Bloom 
              luminanceThreshold={0.8} 
              mipmapBlur 
              intensity={1.2} 
              radius={0.4}
            />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Suspense>

        <OrbitControls 
          enablePan={false} 
          minDistance={10} 
          maxDistance={40} 
          autoRotate={treeState === TreeState.FORMED}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>

      <Overlay treeState={treeState} onToggle={toggleState} />
    </div>
  );
};

export default App;
