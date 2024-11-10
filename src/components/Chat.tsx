import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { TextField, TextAreaField } from "@aws-amplify/ui-react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import ExpandIcon from '@mui/icons-material/Expand';
import FitScreenIcon from '@mui/icons-material/FitScreen';

interface ChatProps {
  address: string;
  name: string;
  info: string;
}

interface AIResponse {
  response: string;
}

const fetchAIResponse = async (topic: string, address: string, info: string, userId: string): Promise<string> => {
  try {
    const response = await fetch("https://9xsl4q3gdk.execute-api.us-east-2.amazonaws.com/Prod/getAssist", {
      method: "POST",
      body: JSON.stringify({ data: topic, address, info, userId }),
      headers: { "Content-Type": "application/json" }
    });

    const reader = response.body?.getReader();
    const { value } = await reader?.read() ?? {};
    const aiResponse: AIResponse = JSON.parse(new TextDecoder().decode(value));
    return aiResponse.response;
  } catch (error) {
    console.error("AI fetch error:", error);
    throw error;
  }
};

const Chat: React.FC<ChatProps> = ({ address, name, info }) => {
  const { user } = useAuthenticator();
  const [alertActive, setAlertActive] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(false);
  const chatRef = useRef<HTMLTextAreaElement>(null);

  const handleAIResponse = async (topic: string) => {
    if (!user?.userId) return;
    try {
      const aiResponse = await fetchAIResponse(topic, address, info, user.userId);
      if (chatRef.current) {
        chatRef.current.value += `Sales Bot says: ${aiResponse}\n`;
      }
    } catch {
      setAlertActive(true);
    }
  };

  useEffect(() => {
    handleAIResponse("Introduce yourself and highlight property");
  }, [address, info]);

  const handleKeyUp = async (evt: KeyboardEvent<HTMLInputElement>) => {
    const input = evt.currentTarget;
    const text = input.value.trim();
    if (evt.key === "Enter" && text) {
      const chat = chatRef.current;
      if (chat) {
        chat.value += `${name}: ${text}\n`;
      }
      input.value = "Waiting for response from AI bot ...";
      await handleAIResponse(text);
      input.value = "";
    }
  };

  return (
    <div className={`${expand ? 'expandChat' : ''}`}>
      {expand ? (
        <FitScreenIcon onClick={() => setExpand(false)} />
      ) : (
        <ExpandIcon onClick={() => setExpand(true)} />
      )}
      <h3>Chat</h3>
      <TextAreaField
        className="chat-area"
        labelHidden
        label="AI Chat"
        id="chat"
        rows={17}
        resize="vertical"
        maxLength={1000}
        ref={chatRef}
      />
      {alertActive && <span>AI connection issue</span>}
      <TextField
        label=""
        descriptiveText="Type your question for this listing's Bot"
        onKeyUp={handleKeyUp}
      />
    </div>
  );
};

export default Chat;
