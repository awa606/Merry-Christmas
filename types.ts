
import { ThreeElements } from '@react-three/fiber';

// Augment the JSX namespace to include React Three Fiber elements globally
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

export enum TreeState {
  CHAOS = 'CHAOS',
  FORMED = 'FORMED'
}

export interface OrnamentData {
  id: number;
  type: 'ball' | 'gift' | 'light';
  chaosPosition: [number, number, number];
  targetPosition: [number, number, number];
  color: string;
  scale: number;
  weight: number;
}
