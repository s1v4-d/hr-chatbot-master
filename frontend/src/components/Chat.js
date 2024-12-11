import { useState, useContext, useEffect } from "react";
import { chatAPI } from "../api/api";
import { IndexingContext } from "../context/IndexingContext";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  IconButton
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import VoiceRecordModal from "./VoiceRecordModal";
import "../styles/Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);
  const { isIndexing } = useContext(IndexingContext);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput("");
    setLoadingResponse(true);
    setMessages((prev) => [...prev, { user: userMessage, bot: "" }]);
    try {
      const response = await chatAPI(userMessage);
      const botResponse = response.data.response;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].bot = botResponse;
        return updated;
      });
    } catch (err) {
      console.error("Chat failed", err);
    } finally {
      setLoadingResponse(false);
    }
  };

  const handleVoiceMessage = (userMsg, botMsg) => {
    // Called from the VoiceRecordModal after send
    setMessages((prev) => [...prev, { user: userMsg, bot: botMsg }]);
  };

  return (
    <Box
      display="flex" 
      flexDirection="column"
      alignItems="center"
      justifyContent="start"
      height="100vh"
      bgcolor="#f4f4f4"
      p={2}
    >
      <Typography variant="h4" mb={2}>HR Chatbot</Typography>
      <Paper 
        sx={{ 
          width: "80%", maxWidth: 600, p: 2, mb: 2,
          height: 300, overflowY: "auto"
        }}
      >
        {messages.map((msg, index) => (
          <Box key={index} mb={2}>
            <Typography variant="body1"><strong>You:</strong> {msg.user}</Typography>
            <Typography variant="body1"><strong>Bot:</strong> {msg.bot || (loadingResponse && index === messages.length - 1 ? "Typing..." : "")}</Typography>
          </Box>
        ))}
      </Paper>
      <Box display="flex" gap={1} width="80%" maxWidth={600} mb={2}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder={isIndexing ? "Indexing in progress..." : "Type your message"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isIndexing || loadingResponse}
        />
        <Button variant="contained" onClick={sendMessage} disabled={isIndexing || loadingResponse || !input.trim()}>
          Send
        </Button>
        <IconButton color="primary" onClick={() => setVoiceModalOpen(true)} disabled={isIndexing || loadingResponse}>
          <MicIcon />
        </IconButton>
      </Box>
      {loadingResponse && <CircularProgress />}

      <VoiceRecordModal
        open={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onSendMessage={handleVoiceMessage}
      />
    </Box>
  );
};

export default Chat;
