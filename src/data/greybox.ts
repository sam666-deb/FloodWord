import type { Scenario } from '../sim';

/**
 * Milestone 1 grey-box: three towns, two carriers, one harmful rumour.
 *
 * The question it answers: is racing or intercepting a rumour fun?
 * Tuned so the obvious plans are all tight:
 *  - Pell walks to Gatehold in 6h; you walk it in 4h, so you can get there first and speak.
 *  - Ferry Marigold reaches Crossing at ~5h, picks up the rumour and lands it in Saltmouth at ~10h.
 *  - You can't do both easily, unless you intercept Pell and take the Gatehold road to Saltmouth fast.
 */
export const greybox: Scenario = {
  hours: 36,
  towns: [
    { id: 'crossing', name: 'Crossing', position: [0, 0] },
    { id: 'gatehold', name: 'Gatehold', position: [16, -12] },
    { id: 'saltmouth', name: 'Saltmouth', position: [22, 14] },
  ],
  routes: [
    { id: 'crossing-gatehold', a: 'crossing', b: 'gatehold', kind: 'road' },
    { id: 'gatehold-saltmouth', a: 'gatehold', b: 'saltmouth', kind: 'road' },
    { id: 'crossing-saltmouth', a: 'crossing', b: 'saltmouth', kind: 'river' },
  ],
  carriers: [
    {
      id: 'pell',
      name: 'Pell the drover',
      kind: 'walker',
      speed: 4,
      trust: 0.6,
      schedule: ['crossing', 'gatehold', 'saltmouth'],
      departsAt: 0.5,
    },
    {
      id: 'marigold',
      name: 'Ferry Marigold',
      kind: 'boat',
      speed: 8,
      trust: 0.7,
      schedule: ['saltmouth', 'crossing'],
      departsAt: 1,
    },
  ],
  rumours: [
    {
      id: 'caravan',
      eventType: 'robbed caravan',
      text: 'The courier robbed a grain caravan on the Crossing road.',
      subject: 'player',
      origin: 'crossing',
      heat: 0.8,
      truth: 0.2,
      stance: -0.7,
      knownByPlayer: true,
    },
  ],
  player: { town: 'crossing', money: 30, speed: { road: 6, river: 5 } },
};
