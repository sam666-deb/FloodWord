// All world state is plain JSON-serialisable data (no classes, Maps or Sets),
// so a World can be saved, diffed, replayed and sent to analytics as-is.

export type TownId = string;
export type RouteId = string;
export type RumourId = string;
export type CarrierId = string;

export type RouteKind = 'road' | 'river';
export type CarrierKind = 'walker' | 'boat' | 'bird' | 'post';

export interface Town {
  id: TownId;
  name: string;
  /** Map position in km: x runs east, z runs south. */
  position: [number, number];
}

export interface Route {
  id: RouteId;
  a: TownId;
  b: TownId;
  kind: RouteKind;
  /** Travel length in km, longer than the straight line because roads and rivers wind. */
  length: number;
}

export type Location =
  | { at: 'town'; town: TownId }
  | { at: 'route'; routeId: RouteId; from: TownId; to: TownId; distance: number };

/** The event a rumour describes. Individual tellings of it (RumourCopy) drift apart. */
export interface Rumour {
  id: RumourId;
  eventType: string;
  text: string;
  /** Who it is about. Rumours about 'player' feed town reputation. */
  subject: string;
  origin: TownId;
  createdAt: number;
  /** 0..1, how juicy it is. Raises the chance of distortion on each retelling. */
  heat: number;
  /** 0..1, how true the original account is. Retellings drift down from here. */
  truth: number;
  /** Set when this rumour claims another one is false. */
  contradicts?: RumourId;
}

/** One telling of a rumour, as carried by a carrier or held by a town. */
export interface RumourCopy {
  rumourId: RumourId;
  /** 0..1, where 1 is exactly what happened. */
  truth: number;
  /** -1..1 effect on the subject's reputation. Exaggeration pushes it outward. */
  stance: number;
  hops: number;
}

/** A rumour as a town believes it. */
export interface Claim extends RumourCopy {
  confidence: number;
  heardAt: number;
  via: string;
}

export interface TownState {
  claims: Record<RumourId, Claim>;
}

export interface Carrier {
  id: CarrierId;
  name: string;
  kind: CarrierKind;
  /** km per hour. */
  speed: number;
  /** 0..1, how much towns believe what this carrier tells them. */
  trust: number;
  /** Towns visited in a loop. */
  schedule: TownId[];
  /** Index in `schedule` of the town the carrier is at, or heading to. */
  stop: number;
  location: Location;
  dwellUntil: number;
  cargo: Record<RumourId, RumourCopy>;
}

export interface Player {
  money: number;
  /** km per hour on each kind of route. */
  speed: Record<RouteKind, number>;
  location: Location;
  /** Rumours the player has seen. Unknown rumours stay hidden on the map. */
  known: Record<RumourId, true>;
}

export interface GameEvent {
  time: number;
  text: string;
  /** False for things the player didn't see. Hidden unless debugging. */
  witnessed: boolean;
}

export interface World {
  /** Game hours since the scenario started. */
  time: number;
  endsAt: number;
  rng: { seed: number };
  towns: Record<TownId, Town>;
  routes: Record<RouteId, Route>;
  rumours: Record<RumourId, Rumour>;
  townState: Record<TownId, TownState>;
  carriers: Record<CarrierId, Carrier>;
  player: Player;
  log: GameEvent[];
}

/** Starting data for a world. Lives in src/data; the sim only knows its shape. */
export interface Scenario {
  hours: number;
  towns: Town[];
  /** Length defaults to the straight-line distance × ROUTE_WINDING. */
  routes: Array<Omit<Route, 'length'> & { length?: number }>;
  carriers: Array<Pick<Carrier, 'id' | 'name' | 'kind' | 'speed' | 'trust' | 'schedule'> & { departsAt: number }>;
  rumours: Array<Omit<Rumour, 'createdAt'> & { stance: number; knownByPlayer?: boolean }>;
  player: { town: TownId; money: number; speed: Record<RouteKind, number> };
}
