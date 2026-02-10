const options = ["estrés", "ansiedad", "duelo", "preocupación personal", "ninguna"];

export function MultiSelectChips({
  values,
  onChange
}: {
  values: string[];
  onChange: (v: string[]) => void;
}) {
  function toggle(opt: string) {
    if (opt === "ninguna") return onChange(["ninguna"]);
    const filtered = values.filter((x) => x !== "ninguna");
    if (filtered.includes(opt)) onChange(filtered.filter((x) => x !== opt));
    else onChange([...filtered, opt]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = values.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={[
              "rounded-full px-3 py-1 text-sm border",
              active ? "bg-neutral-900 text-white border-neutral-900" : "bg-white border-neutral-200"
            ].join(" ")}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
