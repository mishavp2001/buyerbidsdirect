import { useEffect, useState } from 'react';

const ChatWidget = ({ instanceUrl, instanceId, contactFlowId }) => {
   const [chatSession, setChatSession] = useState(null);
   const [messages, setMessages] = useState([]);
   const [input, setInput] = useState("");

   // Initialize the Amazon Connect CCP (Contact Control Panel)
   useEffect(() => {
       connect.core.initCCP(document.getElementById('ccp'), {
           ccpUrl: instanceUrl, // Your Amazon Connect instance URL
           loginPopup: true, // Optional: to display login in popup
           loginPopupAutoClose: true,
           region: 'us-east-1' // Replace with your region
       });
   }, [instanceUrl]);

   // Initiate Chat Session
   const initiateChat = async () => {
       try {
           const session = await connect.ChatSession.create({
               contactFlowId: contactFlowId, // Your contact flow ID
               instanceId: instanceId, // Your Amazon Connect instance ID
               participantDetails: {
                   displayName: "Customer" // This could be dynamic based on user data
               }
           });
           session.connect(); // Connect to the chat session
           setChatSession(session);

           session.onMessage((message) => {
               setMessages((prevMessages) => [...prevMessages, message]);
           });
       } catch (error) {
           console.error("Error initiating chat: ", error);
       }
   };

   // Handle message send
   const sendMessage = (content) => {
       if (chatSession && content) {
           chatSession.sendMessage({ content });
           setMessages((prevMessages) => [
               ...prevMessages,
               { participantRole: 'CUSTOMER', content }
           ]);
           setInput(""); // Clear input after sending
       }
   };

   // Render chat messages
   const renderMessages = () => {
       return messages.map((msg, index) => (
           <div key={index} className={msg.participantRole === 'CUSTOMER' ? 'customer-message' : 'agent-message'}>
               {msg.content}
           </div>
       ));
   };

   return (
       <div className="chat-widget">
           <div id="ccp" style={{ display: 'none' }}></div> {/* CCP placeholder */}
           <button onClick={initiateChat}>Start Chat</button>

           <div className="chat-box">
               {renderMessages()}
           </div>
           <div className="chat-input">
               <input
                   type="text"
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   placeholder="Type a message..."
               />
               <button onClick={() => sendMessage(input)}>Send</button>
           </div>
       </div>
   );
};

export default ChatWidget;
