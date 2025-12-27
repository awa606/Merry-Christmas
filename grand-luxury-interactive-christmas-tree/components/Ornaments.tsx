
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TREE_CONFIG, COLORS } from '../constants';
import { OrnamentData } from '../types';

interface OrnamentsProps {
  progressRef: React.MutableRefObject<number>;
}

const Ornaments: React.FC<OrnamentsProps> = ({ progressRef }) => {
  const ballMeshRef = useRef<THREE.InstancedMesh>(null);
  const giftMeshRef = useRef<THREE.InstancedMesh>(null);
  const lightMeshRef = useRef<THREE.InstancedMesh>(null);

  const ornamentData = useMemo(() => {
    const data: OrnamentData[] = [];
    const colors = [COLORS.GOLD, COLORS.LUXURY_RED, COLORS.SILVER, COLORS.BRIGHT_GOLD];
    
    for (let i = 0; i < TREE_CONFIG.ORNAMENT_COUNT; i++) {
      const typeRand = Math.random();
      const type = typeRand > 0.8 ? 'gift' : (typeRand > 0.4 ? 'ball' : 'light');
      
      // Chaos Pos
      const r = TREE_CONFIG.CHAOS_RADIUS * Math.random();
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;

      // Target Pos
      const py = Math.random() * (TREE_CONFIG.TREE_HEIGHT - 1);
      const pRadius = (1 - py / TREE_CONFIG.TREE_HEIGHT) * TREE_CONFIG.BASE_RADIUS;
      const angle = Math.random() * Math.PI * 2;
      
      data.push({
        id: i,
        type,
        chaosPosition: [
          r * Math.sin(theta) * Math.cos(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(theta)
        ],
        targetPosition: [
          pRadius * Math.cos(angle),
          py - 1.8,
          pRadius * Math.sin(angle)
        ],
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: type === 'gift' ? 0.3 + Math.random() * 0.2 : 0.15 + Math.random() * 0.15,
        weight: type === 'gift' ? 2.5 : (type === 'ball' ? 1.0 : 0.2)
      });
    }
    return data;
  }, []);

  const ballData = useMemo(() => ornamentData.filter(d => d.type === 'ball'), [ornamentData]);
  const giftData = useMemo(() => ornamentData.filter(d => d.type === 'gift'), [ornamentData]);
  const lightData = useMemo(() => ornamentData.filter(d => d.type === 'light'), [ornamentData]);

  const dummy = new THREE.Object3D();
  const tempPos = new THREE.Vector3();
  const chaosVec = new THREE.Vector3();
  const targetVec = new THREE.Vector3();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const progress = progressRef.current;

    const updateInstances = (mesh: THREE.InstancedMesh | null, subData: OrnamentData[]) => {
      if (!mesh) return;
      subData.forEach((d, i) => {
        chaosVec.set(...d.chaosPosition);
        targetVec.set(...d.targetPosition);
        
        // Physics weight influence on pathing
        const weightOffset = Math.sin(time + d.id) * 0.1 * (1 - progress) * d.weight;
        tempPos.lerpVectors(chaosVec, targetVec, progress);
        tempPos.y += weightOffset;

        dummy.position.copy(tempPos);
        dummy.scale.setScalar(d.scale * (0.5 + progress * 0.5));
        
        // Rotating gifts
        if(d.type === 'gift') {
           dummy.rotation.set(time * 0.2 + d.id, time * 0.1, 0);
        } else {
           dummy.rotation.set(0,0,0);
        }
        
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        mesh.setColorAt(i, new THREE.Color(d.color));
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    };

    updateInstances(ballMeshRef.current, ballData);
    updateInstances(giftMeshRef.current, giftData);
    updateInstances(lightMeshRef.current, lightData);
  });

  return (
    <group>
      <instancedMesh ref={ballMeshRef} args={[undefined, undefined, ballData.length]} castShadow>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial metalness={0.9} roughness={0.1} />
      </instancedMesh>

      <instancedMesh ref={giftMeshRef} args={[undefined, undefined, giftData.length]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial metalness={0.6} roughness={0.4} />
      </instancedMesh>

      <instancedMesh ref={lightMeshRef} args={[undefined, undefined, lightData.length]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial emissiveIntensity={5} toneMapped={false} />
      </instancedMesh>
    </group>
  );
};

export default Ornaments;
