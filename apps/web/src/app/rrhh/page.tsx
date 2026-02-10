"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { apiGet } from "@/lib/api";

export default function RRHHPage() {
  const [team, setTeam] = useState("Operaciones");
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try {
      const resp = await apiGet(`/rrhh/team/${encodeURIComponent(team)}`);
      setData(resp);
    } catch {
      setErr("No autorizado o sin datos.");
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard RRHH</h1>
      <p className="text-neutral-600">Solo KPIs agregados por equipo.</p>

      <Card>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-xl border border-neutral-200 p-3"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          />
          <button className="rounded-xl bg-neutral-900 px-4 text-white" onClick={load}>
            Ver
          </button>
        </div>

        {err ? <div className="mt-2 text-sm text-red-600">{err}</div> : null}
      </Card>

      {data?.kpis ? (
        <Card>
          <pre className="text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        </Card>
      ) : null}
    </div>
  );
}
