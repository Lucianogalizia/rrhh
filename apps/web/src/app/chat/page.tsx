"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";
import { getToken } from "@/lib/auth";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [checkinContext, setCheckinContext] = useState<object | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const raw = sessionStorage.getItem("checkin_context");
    if (!raw) {
      router.replace("/checkin");
      return;
    }

    const ctx = JSON.parse(raw);
    setCheckinContext(ctx);
    startConversation(ctx);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function startConversation(ctx: object) {
    setLoading(true);
    try {
      const resp = await apiPost<{ reply: string; kpis: object | null; finished: boolean }>(
        "/api/chat/",
        { messages: [], checkin_context: ctx }
      );
      setMessages([{ role: "assistant", content: resp.reply }]);
      if (resp.finished) setFinished(true);
    } catch {
      setMessages([{
        role: "assistant",
        content: "Hola, gracias por completar tu check-in. ¿Cómo te sentís en este momento?"
      }]);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading || finished || !checkinContext) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const resp = await apiPost<{ reply: string; kpis: object | null; finished: boolean }>(
        "/api/chat/",
        { messages: updatedMessages, checkin_context: checkinContext }
      );

      setMessages([...updatedMessages, { role: "assistant", content: resp.reply }]);

      if (resp.finished) {
        setFinished(true);
        sessionStorage.removeItem("checkin_context");
      }
    } catch {
      setMessages([...updatedMessages, {
        role: "assistant",
        content: "Hubo un error. Por favor intentá de nuevo."
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <h1 className="text-xl font-semibold mb-3">Seguimiento diario</h1>

      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-neutral-900 text-white rounded-br-sm"
                  : "bg-neutral-100 text-neutral-800 rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-neutral-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {finished ? (
        <div className="mt-2 space-y-2">
          <div className="text-center text-sm text-neutral-500 py-3">
            Conversación finalizada. ¡Que tengas un buen día!
          </div>
          <button
            onClick={() => router.push("/checkin")}
            className="w-full rounded-xl border border-neutral-200 p-3 text-sm text-neutral-700"
          >
            Volver al inicio
          </button>
        </div>
      ) : (
        <div className="flex gap-2 mt-2">
          <input
            className="flex-1 rounded-xl border border-neutral-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
            placeholder="Escribí tu respuesta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="rounded-xl bg-neutral-900 px-4 text-white text-sm disabled:opacity-40"
          >
            Enviar
          </button>
        </div>
      )}
    </div>
  );
}
