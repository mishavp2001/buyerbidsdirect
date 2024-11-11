import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { TextField } from "@aws-amplify/ui-react";
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
  const [messages, setMessages] = useState<{ text: string; sender: string; expanded: boolean }[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [isWaitingForAI, setIsWaitingForAI] = useState<boolean>(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false); // New ref to track if initialization has already occurred

  const handleAIResponse = async (topic: string) => {
    if (!user?.userId || isWaitingForAI) return; // Prevent multiple requests if waiting for a response
    setIsWaitingForAI(true); // Disable input while waiting for AI
    setInputText("Waiting for response from AI bot..."); // Show waiting message
    try {
      const aiResponse = await fetchAIResponse(topic, address, info, user.userId);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: aiResponse, sender: 'Sales Bot', expanded: false }
      ]);
    } catch {
      setAlertActive(true);
    } finally {
      setIsWaitingForAI(false); // Re-enable input after AI response
      setInputText(""); // Show waiting message
    }
  };

  useEffect(() => {
    if (!hasInitialized.current) {  // Only run on initial load
      handleAIResponse("Introduce yourself and highlight property");
      hasInitialized.current = true; // Mark as initialized to prevent re-running
    }
  }, []);

  const handleKeyUp = async (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Enter" && inputText.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: inputText, sender: name, expanded: false }
      ]);
      const userMessage = inputText;
      setInputText("Waiting for response from AI bot..."); // Show waiting message
      setIsWaitingForAI(true); // Disable input while waiting

      await handleAIResponse(userMessage); // Await AI response

      setInputText(""); // Clear input after response
    }
  };

  const toggleExpand = (index: number) => {
    setMessages(prevMessages =>
      prevMessages.map((msg, i) =>
        i === index ? { ...msg, expanded: !msg.expanded } : msg
      )
    );
  };

  return (
    <div>
      <div ref={chatRef} className="chatWindow">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${index % 2 === 0 ? 'even' : 'odd'}`}
            onClick={() => toggleExpand(index)}
          >
            <p className={msg.expanded ? 'expanded' : 'collapsed'}>
              <span className={`message-sender ${msg.sender === 'Sales Bot' ? 'bot' : 'user'}`} >{msg.sender}:</span>
              <span className='message-text'>{msg.text}</span>
            </p>
          </div>
        ))}
        {alertActive && <span>AI connection issue</span>}
      </div>
      <TextField
        label=""
        descriptiveText="Type your question for this listing's Bot"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyUp={handleKeyUp}
        disabled={isWaitingForAI}
      />
    </div>
  );
};

export default Chat;
