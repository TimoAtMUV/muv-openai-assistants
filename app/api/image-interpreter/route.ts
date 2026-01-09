import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Analyze an image using GPT-4 Vision
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const prompt = formData.get("prompt") as string || "Beschreibe dieses Bild im Detail.";

    if (!imageFile) {
      return Response.json({ error: "Bild ist erforderlich" }, { status: 400 });
    }

    // Convert image to base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = imageFile.type || "image/jpeg";

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const analysis = response.choices[0]?.message?.content || "Keine Analyse verfügbar.";

    return Response.json({ analysis });
  } catch (error: any) {
    console.error("Error analyzing image:", error);
    return Response.json(
      { error: error.message || "Bild konnte nicht analysiert werden" },
      { status: 500 }
    );
  }
}

