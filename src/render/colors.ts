import { Color } from 'three';

export const palette = {
  ground: '#a9b88a',
  water: '#4f7fa3',
  road: '#b59a6a',
  background: '#cfd8d3',
  player: '#e2b33c',
  walker: '#6d5a48',
  boat: '#3f5f78',
  rumourBad: '#c0503a',
  rumourGood: '#4f9a5a',
} as const;

const distrusted = new Color(palette.rumourBad);
const neutral = new Color('#9a9a8e');
const trusted = new Color(palette.rumourGood);

/** Town colour from reputation -1..1: red, grey, green. */
export function reputationColor(value: number): Color {
  return value < 0 ? neutral.clone().lerp(distrusted, -value) : neutral.clone().lerp(trusted, value);
}
