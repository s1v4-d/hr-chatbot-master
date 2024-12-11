import { useState, useContext, useEffect, useRef } from "react";
import { chatAPI } from "../api/api";
import { IndexingContext } from "../context/IndexingContext";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Container
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import StopIcon from "@mui/icons-material/Stop";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import VoiceRecordModal from "./VoiceRecordModal";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);
  const { isIndexing } = useContext(IndexingContext);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  const [speakingIndex, setSpeakingIndex] = useState(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    // Ensure voices are loaded
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {};
    }
  }, []);

  const getFemaleVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return voices.find(
      (v) =>
        v.name.toLowerCase().includes("female") ||
        (v.lang.startsWith("en") && v.name.toLowerCase().includes("female"))
    ) || voices.find(v => v.lang.startsWith("en")) || voices[0];
  };

  const startSpeaking = (text, index) => {
    stopSpeaking(); // Stop any current speech
    if ('speechSynthesis' in window) {
      const cleanedText = text.replace(/\*\*/g, ""); // remove asterisks for TTS
      utteranceRef.current = new SpeechSynthesisUtterance(cleanedText);
      const voice = getFemaleVoice();
      if (voice) utteranceRef.current.voice = voice;
      utteranceRef.current.onend = () => {
        setSpeakingIndex(null);
      };
      speechSynthesis.speak(utteranceRef.current);
      setSpeakingIndex(index);
    }
  };

  const stopSpeaking = () => {
    if (utteranceRef.current && speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setSpeakingIndex(null);
  };

  const toggleSpeak = (text, index) => {
    if (speakingIndex === index) {
      // Currently speaking this message, stop it
      stopSpeaking();
    } else {
      // Start speaking this message
      startSpeaking(text, index);
    }
  };

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
    // Called from VoiceRecordModal after send
    setMessages((prev) => [...prev, { user: userMsg, bot: botMsg }]);
  };

  return (
    <Box display="flex" flexDirection="column" height="calc(100vh - 64px)">
      <Box display="flex" flexDirection="column" flexGrow={1}>
        <Box
          flexGrow={1}
          overflow="hidden"
          display="flex"
          flexDirection="column"
        >
          <Container
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              paddingTop: 2,
              paddingBottom: 2,
            }}
          >
            <Typography variant="h4" mb={2}>HR Chatbot</Typography>
            <Paper
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mb: 2
              }}
              elevation={3}
            >
              {messages.map((msg, index) => (
                <Box key={index}>
                  <Paper sx={{ p:1.5, mb:1, bgcolor: "#e3f2fd" }} elevation={1}>
                    <Typography variant="body1"><strong>You:</strong> {msg.user}</Typography>
                  </Paper>
                  <Paper sx={{ p:1.5, position: "relative" }} elevation={1}>
                    <Typography variant="body1" sx={{ mb:1, whiteSpace: "pre-wrap" }}>
                      <strong>Bot:</strong>{" "}
                      {msg.bot ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.bot}
                        </ReactMarkdown>
                      ) : (
                        loadingResponse && index === messages.length - 1 ? "Typing..." : ""
                      )}
                    </Typography>
                    {msg.bot && (
                      <IconButton
                        size="small"
                        sx={{ position: "absolute", top: 8, right: 8 }}
                        onClick={() => toggleSpeak(msg.bot, index)}
                      >
                        {speakingIndex === index ? <StopIcon /> : <VolumeUpIcon />}
                      </IconButton>
                    )}
                  </Paper>
                </Box>
              ))}
              {loadingResponse && messages.length === 0 && (
                <Typography variant="body1">Typing...</Typography>
              )}
            </Paper>
            <Box display="flex" gap={1}>
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
            {loadingResponse && (
              <Box mt={2} display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            )}
          </Container>
        </Box>
      </Box>
      <VoiceRecordModal
        open={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onSendMessage={handleVoiceMessage}
      />
    </Box>
  );
};

export default Chat;
