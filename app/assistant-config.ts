export let assistantId = ""; // set your assistant ID here

if (assistantId === "") {
  assistantId = process.env.OPENAI_ASSISTANT_ID;
}

export let basicChatAssistantId = process.env.BASIC_CHAT_ASSISTANT_ID || "";