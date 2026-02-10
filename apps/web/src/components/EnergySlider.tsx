export function EnergySlider({
  value,
  onChange
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-600">0</span>
        <span className="text-sm font-medium">Energía: {value}</span>
        <span className="text-sm text-neutral-600">10</span>
      </div>

      <input
        type="range"
        min={0}
        max={10}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full"
      />
    </div>
  );
}
