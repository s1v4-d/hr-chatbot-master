import { useState } from "react";
import { chat } from "../api";
import "../styles/Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    try {
      const response = await chat(input);
      setMessages([...messages, { user: input, bot: response.data.reply }]);
      setInput("");
    } catch (err) {
      console.error("Chat failed", err);
    }
  };

  return (
    <div className="chat-container">
      <h1>Chat with HR Bot</h1>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div className="chat-message" key={index}>
            <strong>You:</strong> {msg.user}
            <br />
            <strong>Bot:</strong> {msg.bot}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;