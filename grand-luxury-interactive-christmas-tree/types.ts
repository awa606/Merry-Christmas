
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
