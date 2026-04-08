type DebugSettings = {
  soundEnabled: boolean;
  pixiEnabled: boolean;
  lowFx: boolean;
  simulateReducedMotion: boolean;
};

type DebugHudProps = {
  settings: DebugSettings;
  onToggle: (key: keyof DebugSettings) => void;
};

const items: Array<{ key: keyof DebugSettings; label: string }> = [
  { key: 'soundEnabled', label: 'SFX' },
  { key: 'pixiEnabled', label: 'Pixi FX' },
  { key: 'lowFx', label: 'Low FX' },
  { key: 'simulateReducedMotion', label: 'Reduce Motion' },
];

export const DebugHud = ({ settings, onToggle }: DebugHudProps) => (
  <aside className="debug-hud" aria-label="Debug toggles">
    <p className="debug-hud__title">Control Rack</p>
    <div className="debug-hud__grid">
      {items.map((item) => (
        <button
          key={item.key}
          className={`debug-hud__toggle ${settings[item.key] ? 'is-active' : ''}`}
          type="button"
          onClick={() => onToggle(item.key)}
          aria-pressed={settings[item.key]}
        >
          <span>{item.label}</span>
          <span>{settings[item.key] ? 'ON' : 'OFF'}</span>
        </button>
      ))}
    </div>
  </aside>
);
