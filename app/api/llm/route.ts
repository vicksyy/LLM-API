import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

type LlmRequestBody = {
  prompt: string;
};

function isLlmRequestBody(value: unknown): value is LlmRequestBody {
  if (!value || typeof value !== "object") return false;
  return "prompt" in value && typeof value.prompt === "string";
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();

    if (!isLlmRequestBody(body) || !body.prompt.trim()) {
      return NextResponse.json(
        { error: "Falta el campo 'prompt' en el body" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente que responde de forma clara y corta para alumnos de FP y puedes contestar solo preguntas sobre Disney.",
        },
        {
          role: "user",
          content: body.prompt,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ ok: true, answer: text });
  } catch (error) {
    console.error("Error en /api/llm:", error);
    return NextResponse.json(
      { ok: false, error: "Error generando respuesta" },
      { status: 500 }
    );
  }
}
