import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Send a new message to a thread
export async function POST(request, { params: { threadId } }) {
  const { content, assistantId: customAssistantId } = await request.json();

  // Use custom assistant ID if provided, otherwise use default
  const targetAssistantId = customAssistantId || assistantId;

  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  });

  const stream = openai.beta.threads.runs.stream(threadId, {
    assistant_id: targetAssistantId,
  });

  return new Response(stream.toReadableStream());
}
