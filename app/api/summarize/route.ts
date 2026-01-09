import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Summarize text using OpenAI
export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return Response.json({ error: "Text ist erforderlich" }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Du bist ein hilfreicher Assistent, der Transkriptionen zusammenfasst. Erstelle eine prägnante und informative Zusammenfassung des gegebenen Textes.",
        },
        {
          role: "user",
          content: `Bitte fasse folgenden Text zusammen:\n\n${text}`,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const summary = response.choices[0]?.message?.content || "Keine Zusammenfassung verfügbar.";

    return Response.json({ summary });
  } catch (error: any) {
    console.error("Error summarizing text:", error);
    return Response.json(
      { error: error.message || "Text konnte nicht zusammengefasst werden" },
      { status: 500 }
    );
  }
}

