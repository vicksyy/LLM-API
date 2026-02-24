import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Falta OPENAI_API_KEY en variables de entorno.");
}

export const openai = new OpenAI({ apiKey });
