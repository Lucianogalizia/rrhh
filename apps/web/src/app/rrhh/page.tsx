"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { apiGet } from "@/lib/api";
import { getToken } from "@/lib/auth";

function getRoleFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export default function RRHHPage() {
  const router = useRouter();
  const [team, setTeam] = useState("Operaciones");
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    const role = getRoleFromToken(token);
    setAuthorized(role === "rrhh");
  }, [router]);

  async function load() {
    setErr(null);
    try {
      const resp = await apiGet(`/api/rrhh/team/${encodeURIComponent(team)}`);
      setData(resp);
    } catch {
      setErr("No autorizado o sin datos.");
    }
  }

  if (authorized === null) {
    return <div className="p-4 text-neutral-500">Verificando acceso...</div>;
  }

  if (authorized === false) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Acceso restringido</h1>
        <Card>
          <p className="text-neutral-600">
            Esta sección es solo para el equipo de RRHH. Tu usuario no tiene permisos para verla.
          </p>
        </Card>
      </div>
    );
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

      {data?.kpis && Object.keys(data.kpis).length > 0 ? (
        <Card>
          <div className="font-medium mb-2">KPIs — Equipo: {data.team}</div>
          <div className="space-y-2">
            {Object.entries(data.kpis as Record<string, number>).map(([key, val]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-neutral-600 capitalize">{key.replace(/_/g, " ")}</span>
                <span className="font-medium">{(val * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </Card>
      ) : data ? (
        <Card>
          <p className="text-sm text-neutral-500">Sin datos registrados para este equipo todavía.</p>
        </Card>
      ) : null}
    </div>
  );
}
