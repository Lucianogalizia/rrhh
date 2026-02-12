"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { MoodScale } from "@/components/MoodScale";
import { EnergySlider } from "@/components/EnergySlider";
import { MultiSelectChips } from "@/components/MultiSelectChips";
import { apiPost } from "@/lib/api";
import { getToken } from "@/lib/auth";

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    console.log("CLICK DETECTADO"); // 👈 esto debería verse en la consola
    setLoading(true);
    setError(null);
    setFeedback(null);
    setActivated([]);

    try {
      const token = getToken();

      if (!token) {
        setError("No hay sesión activa. Volvé a /login.");
        return;
      }

      const resp = await apiPost<{
        activated_questions: { id: string; text: string }[];
        feedback: string;
      }>("/api/checkin/", {
        mood,
        sleep,
        personal_issues: personal,
        work_issue: workIssue,
        work_issue_note: workIssue ? workNote : null,
        energy
      });

      setActivated(resp.activated_questions || []);
      setFeedback(resp.feedback || "Gracias.");
    } catch (err: any) {
      console.error("ERROR:", err);
      setError("Error enviando el check-in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Check-in diario</h1>

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
              ¿Situación personal que pueda afectar tu día?
            </div>
            <MultiSelectChips values={personal} onChange={setPersonal} />
          </div>

          <div>
            <div className="mb-2 font-medium">¿Algo laboral te impacta hoy?</div>
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 rounded-xl border p-3 ${
                  workIssue
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "border-neutral-200"
                }`}
                onClick={() => setWorkIssue(true)}
              >
                Sí
              </button>
              <button
                type="button"
                className={`flex-1 rounded-xl border p-3 ${
                  !workIssue
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "border-neutral-200"
                }`}
                onClick={() => setWorkIssue(false)}
              >
                No
              </button>
            </div>
          </div>

          <div>
            <div className="mb-2 font-medium">Nivel de energía</div>
            <EnergySlider value={energy} onChange={setEnergy} />
          </div>

          <button
            type="button"
            className="w-full rounded-xl bg-neutral-900 p-3 text-white disabled:opacity-60"
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar check-in"}
          </button>

          {error && <div className="text-red-600 text-sm">{error}</div>}
        </div>
      </Card>

      {feedback && (
        <Card>
          <div className="font-medium">Respuesta:</div>
          <div className="mt-2 text-neutral-700">{feedback}</div>
        </Card>
      )}

      {activated.length > 0 && (
        <Card>
          <div className="font-medium">Preguntas activadas:</div>
          <ul className="mt-2 list-disc pl-5">
            {activated.map((q) => (
              <li key={q.id}>{q.text}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
