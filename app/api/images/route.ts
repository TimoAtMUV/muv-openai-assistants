import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Generate an image using DALL-E
export async function POST(request: Request) {
  try {
    const { prompt, size = "1024x1024", quality = "standard" } = await request.json();

    if (!prompt) {
      return Response.json({ error: "Eingabeaufforderung ist erforderlich" }, { status: 400 });
    }

    // DALL-E 3 only supports n=1
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: size as "1024x1024" | "1792x1024" | "1024x1792",
      quality: quality as "standard" | "hd",
      n: 1,
    });

    return Response.json({ images: response.data });
  } catch (error: any) {
    console.error("Error generating image:", error);
    return Response.json(
      { error: error.message || "Bild konnte nicht generiert werden" },
      { status: 500 }
    );
  }
}

