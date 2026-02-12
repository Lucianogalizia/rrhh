"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { apiPost } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
  const r = useRouter();
  const [email, setEmail] = useState("demo@empresa.com");
  const [password, setPassword] = useState("Demo123!");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const resp = await apiPost<{ access_token: string }>("/api/auth/login", { email, password });
      setToken(resp.access_token);
      r.push("/checkin");
    } catch (err: any) {
      setError("No pudimos iniciar sesión. Revisá tus datos.");
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Bienvenido/a</h1>
      <p className="text-neutral-600">
        Este check-in es breve. No diagnostica ni etiqueta: te acompaña y te ayuda a cuidar tu día.
      </p>

      <Card>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="text-sm text-neutral-600">Email corporativo</label>
            <input
              className="mt-1 w-full rounded-xl border border-neutral-200 p-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div>
            <label className="text-sm text-neutral-600">Contraseña</label>
            <input
              className="mt-1 w-full rounded-xl border border-neutral-200 p-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          <button
            className="w-full rounded-xl bg-neutral-900 p-3 text-white"
            type="submit"
          >
            Entrar
          </button>
        </form>
      </Card>
    </div>
  );
}
