import { SPEEDS, useGame } from '../game/store';
import { formatClock } from '../game/snapshot';

function TopBar() {
  const clock = useGame((s) => s.snapshot.clock);
  const money = useGame((s) => s.snapshot.money);
  const speed = useGame((s) => s.hoursPerSecond);
  const ended = useGame((s) => s.snapshot.ended);
  const setSpeed = useGame((s) => s.setSpeed);
  return (
    <header className="panel top-bar">
      <span className="clock">{clock}</span>
      <span>{money} coins</span>
      <div className="speeds">
        {SPEEDS.map((s) => (
          <button key={s.label} className={speed === s.hoursPerSecond ? 'active' : ''} disabled={ended} onClick={() => setSpeed(s.hoursPerSecond)}>
            {s.label}
          </button>
        ))}
      </div>
    </header>
  );
}

function Actions() {
  const snap = useGame((s) => s.snapshot);
  const dispatch = useGame((s) => s.dispatch);
  const error = useGame((s) => s.lastError);
  return (
    <section className="panel actions">
      <h2>{snap.location}</h2>

      {snap.interceptOptions.map((o) => (
        <button key={o.carrierId} className="primary" onClick={() => dispatch({ type: 'intercept', carrierId: o.carrierId })}>
          Bribe {o.name} to forget ({snap.bribeCost} coins)
        </button>
      ))}

      {snap.speakOptions.map((o) => (
        <button key={o.rumourId} onClick={() => dispatch({ type: 'speak', rumourId: o.rumourId })}>
          Tell your side: “{o.text}”
        </button>
      ))}

      {snap.travelOptions.map((o) => (
        <button key={o.routeId} onClick={() => dispatch({ type: 'travel', routeId: o.routeId })}>
          Go to {o.toName} by {o.kind} ({o.hours.toFixed(1)}h)
        </button>
      ))}

      {error && <p className="error">{error}</p>}
    </section>
  );
}

function Reputation() {
  const towns = useGame((s) => s.snapshot.towns);
  return (
    <section className="panel reputation">
      <h2>What the towns think of you</h2>
      <ul>
        {towns.map((t) => (
          <li key={t.id}>
            <span>{t.name}</span>
            <span className={t.reputation < -0.1 ? 'bad' : t.reputation > 0.1 ? 'good' : ''}>{t.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Log() {
  const log = useGame((s) => s.snapshot.log);
  const revealAll = useGame((s) => s.revealAll);
  const toggle = useGame((s) => s.toggleRevealAll);
  const entries = log.filter((e) => e.witnessed || revealAll).slice(-8).reverse();
  return (
    <section className="panel log">
      <label className="debug">
        <input type="checkbox" checked={revealAll} onChange={toggle} /> Debug: reveal hidden rumours
      </label>
      <ol>
        {entries.map((e, i) => (
          <li key={`${e.time}-${i}`} className={e.witnessed ? '' : 'hidden-event'}>
            <time>{formatClock(e.time).replace('Day ', 'D')}</time> {e.text}
          </li>
        ))}
      </ol>
    </section>
  );
}

function Outcome() {
  const snap = useGame((s) => s.snapshot);
  const restart = useGame((s) => s.restart);
  if (!snap.ended) return null;
  const friendly = snap.towns.filter((t) => t.reputation > -0.1).length;
  return (
    <div className="outcome">
      <div className="panel">
        <h2>Nightfall, day 2</h2>
        <p>
          {friendly} of {snap.towns.length} towns still have the door open for you.
        </p>
        <ul>
          {snap.towns.map((t) => (
            <li key={t.id}>
              {t.name}: <strong>{t.label}</strong> ({t.reputation.toFixed(2)})
            </li>
          ))}
        </ul>
        <button className="primary" onClick={restart}>
          Play again
        </button>
      </div>
    </div>
  );
}

export function Hud() {
  return (
    <div className="hud">
      <TopBar />
      <Actions />
      <Reputation />
      <Log />
      <Outcome />
    </div>
  );
}
