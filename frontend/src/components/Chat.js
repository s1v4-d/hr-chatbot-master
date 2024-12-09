import { useState, useEffect } from "react";
import { chat } from "../api/api";
import "../styles/Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';

      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recog.onerror = (err) => {
        console.error("Speech recognition error:", err);
      };

      setRecognition(recog);
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput("");

    // Add user message to messages
    setMessages((prev) => [...prev, { user: userMessage, bot: "" }]);

    try {
      const response = await chat(userMessage);
      const botResponse = response.data.response;

      // Update the last message with bot response
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].bot = botResponse;
        return updated;
      });

      // Speak out the bot response
      speak(botResponse);
    } catch (err) {
      console.error("Chat failed", err);
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition && !listening) {
      recognition.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognition && listening) {
      recognition.stop();
      setListening(false);
    }
  };

  return (
    <div className="chat-container">
      <h1>Voice/Text HR Chatbot</h1>
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
          placeholder="Type your message or use voice"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div className="voice-controls">
        <button onClick={startListening} disabled={listening}>Start Voice</button>
        <button onClick={stopListening} disabled={!listening}>Stop Voice</button>
      </div>
    </div>
  );
};

export default Chat;
