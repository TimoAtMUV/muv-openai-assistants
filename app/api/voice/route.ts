import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Generate speech from text using OpenAI TTS
export async function POST(request: Request) {
  try {
    const {
      text,
      voice = "alloy",
      model = "tts-1",
      speed = 1.0,
    } = await request.json();

    if (!text || text.trim().length === 0) {
      return Response.json({ error: "Text ist erforderlich" }, { status: 400 });
    }

    const response = await openai.audio.speech.create({
      model: model as "tts-1" | "tts-1-hd",
      voice: voice as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer",
      input: text,
      speed: Math.max(0.25, Math.min(4.0, speed)), // Clamp speed between 0.25 and 4.0
    });

    // Convert the response to a buffer
    const buffer = Buffer.from(await response.arrayBuffer());

    // Return the audio file
    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="speech.mp3"`,
      },
    });
  } catch (error: any) {
    console.error("Error generating speech:", error);
    return Response.json(
      { error: error.message || "Sprache konnte nicht generiert werden" },
      { status: 500 }
    );
  }
}

