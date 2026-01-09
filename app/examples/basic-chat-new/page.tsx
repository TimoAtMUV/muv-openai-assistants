import React from "react";
import { basicChatAssistantId } from "../../assistant-config";
import BasicChatClient from "./client";

const BasicChat = () => {
  return <BasicChatClient assistantId={basicChatAssistantId} />;
};

export default BasicChat;

