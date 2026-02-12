"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { MoodScale } from "@/components/MoodScale";
import { EnergySlider } from "@/components/EnergySlider";
import { MultiSelectChips } from "@/components/MultiSelectChips";
import { apiPost } from "@/lib/api";

type Mood = "muy_bien" | "bien" | "regular" | "mal";
type Sleep = "si" | "mas_o_menos" | "no";

export default function CheckinPage() {
  const [mood, setMood] = useState<Mood>("bien");
  const [sleep, setSleep] = useState<Sleep>("si");
  const [personal, setPersonal] = useState<string[]>(["ninguna"]);
  const [workIssue, setWorkIssue] = useState(false);
  const [workNote, setWorkNote] = useState("");
  const [energy, setEnergy] = useState(7);

  const [activated, setActivated] = useState<{ id: string; text: string }[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function submit() {
    const resp = await apiPost<{ activated_questions: any[]; feedback: string }>(
      "/api/checkin",
      {
        mood,
        sleep,
        personal_issues: personal,
        work_issue: workIssue,
        work_issue_note: workIssue ? workNote : null,
        energy
      }
    );

    setActivated(resp.activated_questions || []);
    setFeedback(resp.feedback || "Gracias.");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Check-in diario</h1>
      <p className="text-neutral-600">Toma 2–3 minutos.</p>

      <Card>
        <div className="space-y-4">
          <div>
            <div className="mb-2 font-medium">¿Cómo estás hoy?</div>
            <MoodScale value={mood} onChange={setMood} />
          </div>

          <div>
            <div className="mb-2 font-medium">¿Pudiste descansar bien anoche?</div>
            <select
              className="w-full rounded-xl border border-neutral-200 p-3"
              value={sleep}
              onChange={(e) => setSleep(e.target.value as Sleep)}
            >
              <option value="si">Sí</option>
              <option value="mas_o_menos">Más o menos</option>
              <option value="no">No</option>
            </select>
          </div>

          <div>
            <div className="mb-2 font-medium">
              ¿Estás atravesando alguna situación personal que pueda afectar tu día laboral?
            </div>
            <MultiSelectChips values={personal} onChange={setPersonal} />
          </div>

          <div>
            <div className="mb-2 font-medium">¿Ocurrió algo en el trabajo que hoy te impacte?</div>
            <div className="flex gap-2">
              <button
                type="button"
                className={[
                  "flex-1 rounded-xl border p-3",
                  workIssue ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-200"
                ].join(" ")}
                onClick={() => setWorkIssue(true)}
              >
                Sí
              </button>
              <button
                type="button"
                className={[
                  "flex-1 rounded-xl border p-3",
                  !workIssue ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-200"
                ].join(" ")}
                onClick={() => setWorkIssue(false)}
              >
                No
              </button>
            </div>

            {workIssue ? (
              <textarea
                className="mt-2 w-full rounded-xl border border-neutral-200 p-3"
                placeholder="Opcional: breve comentario"
                value={workNote}
                onChange={(e) => setWorkNote(e.target.value)}
              />
            ) : null}
          </div>

          <div>
            <div className="mb-2 font-medium">Nivel de energía para hoy</div>
            <EnergySlider value={energy} onChange={setEnergy} />
          </div>

          <button className="w-full rounded-xl bg-neutral-900 p-3 text-white" onClick={submit}>
            Enviar check-in
          </button>
        </div>
      </Card>

      {feedback ? (
        <Card>
          <div className="font-medium">Listo ✨</div>
          <div className="text-neutral-600 mt-1">{feedback}</div>

          {activated.length ? (
            <div className="mt-3">
              <div className="font-medium">Preguntas breves (solo si aplica)</div>
              <ul className="mt-2 list-disc pl-5 text-neutral-700">
                {activated.map((q) => (
                  <li key={q.id}>{q.text}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-3 text-neutral-600">Por hoy, nada más.</div>
          )}
        </Card>
      ) : null}
    </div>
  );
}
