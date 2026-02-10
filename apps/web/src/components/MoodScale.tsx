type Mood = "muy_bien" | "bien" | "regular" | "mal";

const options: { value: Mood; label: string; emoji: string }[] = [
  { value: "muy_bien", label: "Muy bien", emoji: "😄" },
  { value: "bien", label: "Bien", emoji: "🙂" },
  { value: "regular", label: "Regular", emoji: "😐" },
  { value: "mal", label: "Mal", emoji: "😞" }
];

export function MoodScale({
  value,
  onChange
}: {
  value: Mood;
  onChange: (v: Mood) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={[
            "rounded-xl border p-3 text-left",
            value === o.value
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "border-neutral-200 bg-white"
          ].join(" ")}
        >
          <div className="text-2xl">{o.emoji}</div>
          <div className="text-sm">{o.label}</div>
        </button>
      ))}
    </div>
  );
}
