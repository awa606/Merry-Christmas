
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TREE_CONFIG, COLORS } from '../constants';

const foliageVertexShader = `
  uniform float uProgress;
  uniform float uTime;
  attribute vec3 aChaos;
  attribute vec3 aTarget;
  attribute float aRandom;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Interpolate between chaos and target positions
    vec3 pos = mix(aChaos, aTarget, uProgress);
    
    // Subtle breathing animation
    pos += sin(uTime + aRandom * 10.0) * 0.05 * (1.0 - uProgress);
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size based on distance and progress
    gl_PointSize = (15.0 / -mvPosition.z) * (1.0 + aRandom);
    
    vColor = mix(vec3(0.01, 0.1, 0.05), vec3(0.04, 0.22, 0.15), aRandom);
    if(aRandom > 0.95) vColor = vec3(0.83, 0.68, 0.21); // Gold specks
    
    vAlpha = smoothstep(0.0, 0.2, uProgress) * 0.8 + 0.2;
  }
`;

const foliageFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    float strength = 1.0 - (dist * 2.0);
    gl_FragColor = vec4(vColor, strength * vAlpha);
  }
`;

interface FoliageProps {
  progressRef: React.MutableRefObject<number>;
}

const Foliage: React.FC<FoliageProps> = ({ progressRef }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  const { chaos, target, randoms } = useMemo(() => {
    const chaos = new Float32Array(TREE_CONFIG.FOLIAGE_COUNT * 3);
    const target = new Float32Array(TREE_CONFIG.FOLIAGE_COUNT * 3);
    const randoms = new Float32Array(TREE_CONFIG.FOLIAGE_COUNT);

    for (let i = 0; i < TREE_CONFIG.FOLIAGE_COUNT; i++) {
      const i3 = i * 3;

      // Chaos: Random sphere
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = TREE_CONFIG.CHAOS_RADIUS * Math.pow(Math.random(), 0.5);
      chaos[i3] = r * Math.sin(phi) * Math.cos(theta);
      chaos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      chaos[i3 + 2] = r * Math.cos(phi);

      // Target: Cone/Tree shape
      const py = Math.random() * TREE_CONFIG.TREE_HEIGHT;
      const pRadius = (1 - py / TREE_CONFIG.TREE_HEIGHT) * TREE_CONFIG.BASE_RADIUS;
      const angle = Math.random() * Math.PI * 2;
      const spread = (Math.random() - 0.5) * 0.8; // some thickness
      
      target[i3] = (pRadius + spread) * Math.cos(angle);
      target[i3 + 1] = py - 2; // Offset to sit on ground
      target[i3 + 2] = (pRadius + spread) * Math.sin(angle);

      randoms[i] = Math.random();
    }
    return { chaos, target, randoms };
  }, []);

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uProgress.value = progressRef.current;
      shaderRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={chaos.length / 3} 
          array={chaos} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-aChaos" 
          count={chaos.length / 3} 
          array={chaos} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-aTarget" 
          count={target.length / 3} 
          array={target} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-aRandom" 
          count={randoms.length} 
          array={randoms} 
          itemSize={1} 
        />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderRef}
        vertexShader={foliageVertexShader}
        fragmentShader={foliageFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uProgress: { value: 0 },
          uTime: { value: 0 },
        }}
      />
    </points>
  );
};

export default Foliage;
