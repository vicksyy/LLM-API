"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type LlmApiResponse = {
  answer?: string;
  error?: string;
};

function isLlmApiResponse(value: unknown): value is LlmApiResponse {
  if (!value || typeof value !== "object") return false;
  const answer = Reflect.get(value, "answer");
  const error = Reflect.get(value, "error");
  const answerOk = answer === undefined || typeof answer === "string";
  const errorOk = error === undefined || typeof error === "string";
  return answerOk && errorOk;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function submitPrompt() {
    setErrorMsg("");

    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) return;

    setMessages((prev) => [...prev, { role: "user", content: cleanPrompt }]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: cleanPrompt }),
      });

      const rawData: unknown = await res.json();
      const data = isLlmApiResponse(rawData) ? rawData : {};

      if (!res.ok) {
        setErrorMsg(data.error || "Error llamando al LLM");
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer || "(sin respuesta)" },
      ]);
    } catch (err) {
      console.error(err);
      setErrorMsg("Error de red llamando al LLM");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await submitPrompt();
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && prompt.trim()) {
        void submitPrompt();
      }
    }
  }

  return (
    <main className="billyllm-shell">
      <div className="billyllm-bg-billy" aria-hidden="true" />
      <div className="billyllm-panel">
        <header className="billyllm-header">
          <h1>BillyLLM</h1>
        </header>

        <section
          className={`billyllm-messages ${messages.length === 0 ? "billyllm-messages-empty" : ""}`}
        >
          {messages.length === 0 && (
            <div className="msg-row assistant">
              <div className="msg-content assistant">
                <p className="empty-greeting">
                  ¡Hola! Soy BillyLLM, ¿en qué puedo ayudarte hoy?
                </p>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`msg-row ${message.role}`}>
              <div className={`msg-content ${message.role}`}>
                <p className={`msg-bubble ${message.role}`}>{message.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="msg-row assistant">
              <div className="msg-content assistant">
                <p className="msg-bubble assistant typing">Escribiendo...</p>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </section>

        {errorMsg && <div className="chat-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="billyllm-composer">
          <button type="button" className="composer-icon-btn" aria-label="Adjuntar">
            +
          </button>
          <textarea
            className="chat-input"
            placeholder="Explícame qué es un LLM para un alumno de FP..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleInputKeyDown}
            rows={1}
          />
          <button className="composer-send-btn" type="submit" disabled={loading || !prompt.trim()}>
            ↑
          </button>
        </form>
      </div>
    </main>
  );
}
