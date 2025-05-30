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
  Container,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import StopIcon from "@mui/icons-material/Stop";
import SettingsIcon from "@mui/icons-material/Settings";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import VoiceRecordModal from "./VoiceRecordModal";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);
  const { isIndexing } = useContext(IndexingContext);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [multiqueryEnabled, setMultiqueryEnabled] = useState(false);
  const [rerankingEnabled, setRerankingEnabled] = useState(false);
  const [streamEnabled, setStreamEnabled] = useState(false);

  const [speakingIndex, setSpeakingIndex] = useState(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          user: null,
          bot: "Hello! I'm your HR assistant. Ask me about documents, policies, or upload a file. How can I help you today?"
        }
      ]);
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {};
    }
  }, [messages]);

  const getFemaleVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.name.toLowerCase().includes("female")) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0]
    );
  };

  const startSpeaking = (text, index) => {
    stopSpeaking();
    if ("speechSynthesis" in window) {
      const cleanedText = text.replace(/\*\*/g, "");
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
      stopSpeaking();
    } else {
      startSpeaking(text, index);
    }
  };

  const sendTextMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput("");
    await processUserMessage(userMessage);
  };

  const processUserMessage = async (userMessage) => {
    setMessages((prev) => [...prev, { user: userMessage, bot: "" }]);
    setLoadingResponse(true);
    try {
      if (!streamEnabled) {
        // Non-stream request using chatAPI
        const response = await chatAPI(userMessage, {
          multiquery: multiqueryEnabled,
          reranking: rerankingEnabled
        });
        const botResponse = response.data.response;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].bot = botResponse;
          return updated;
        });
      } else {
        // Streaming scenario via fetch
        const token = localStorage.getItem("token");
        const headers = { "Content-Type": "application/json" };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch("http://localhost:8000/api/chat", {
          method: "POST",
          headers,
          body: JSON.stringify({
            query: userMessage,
            multiquery: multiqueryEnabled,
            reranking: rerankingEnabled,
            stream: true
          })
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let done = false;
        let partialBotResponse = "";

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            partialBotResponse += chunk;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1].bot = partialBotResponse;
              return updated;
            });
          }
        }
      }
    } catch (err) {
      console.error("Chat failed", err);
    } finally {
      setLoadingResponse(false);
    }
  };

  const onSendTranscript = async (transcript) => {
    await processUserMessage(transcript);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isIndexing && !loadingResponse && input.trim()) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="calc(100vh - 64px)">
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Typography variant="h4">HR Chatbot</Typography>
        <IconButton onClick={() => setSettingsOpen(true)}>
          <SettingsIcon />
        </IconButton>
      </Box>
      <Box display="flex" flexDirection="column" flexGrow={1}>
        <Box flexGrow={1} display="flex" flexDirection="column" overflow="hidden">
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
            <Paper
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mb: 2,
                backgroundColor: "#f0f0f0",
                borderRadius: 2,
              }}
              elevation={3}
            >
              {messages.map((msg, index) => (
                <Box key={index}>
                  {msg.user && (
                    <Card
                      sx={{
                        mb: 1,
                        alignSelf: "flex-end",
                        backgroundColor: "#cce5ff",
                        maxWidth: "80%",
                        ml: "auto"
                      }}
                    >
                      <CardContent>
                        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                          <strong>You:</strong> {msg.user}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                  {msg.bot && (
                    <Card
                      sx={{
                        position: "relative",
                        backgroundColor: "#ffffff",
                        maxWidth: "80%",
                        mr: "auto"
                      }}
                    >
                      <CardContent>
                        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 1 }}>
                          <strong>Bot:</strong>{" "}
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.bot}
                          </ReactMarkdown>
                        </Typography>
                        <IconButton
                          size="small"
                          sx={{ position: "absolute", top: 8, right: 8 }}
                          onClick={() => toggleSpeak(msg.bot, index)}
                        >
                          {speakingIndex === index ? <StopIcon /> : <VolumeUpIcon />}
                        </IconButton>
                      </CardContent>
                    </Card>
                  )}
                  {!msg.bot && loadingResponse && index === messages.length - 1 && (
                    <Card
                      sx={{
                        backgroundColor: "#ffffff",
                        maxWidth: "80%",
                        mr: "auto"
                      }}
                    >
                      <CardContent>
                        <Typography variant="body1">
                          <strong>Bot:</strong> Typing...
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Box>
              ))}
            </Paper>

            <Box display="flex" gap={1}>
              <TextField
                variant="outlined"
                fullWidth
                placeholder={isIndexing ? "Indexing in progress..." : "Type your message"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isIndexing || loadingResponse}
              />
              <Button variant="contained" onClick={sendTextMessage} disabled={isIndexing || loadingResponse || !input.trim()}>
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
        onSendTranscript={onSendTranscript}
      />

      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControlLabel
            control={<Switch checked={multiqueryEnabled} onChange={(e) => setMultiqueryEnabled(e.target.checked)} />}
            label="Enable Multiquery"
          />
          <FormControlLabel
            control={<Switch checked={rerankingEnabled} onChange={(e) => setRerankingEnabled(e.target.checked)} />}
            label="Enable Reranking"
          />
          <FormControlLabel
            control={<Switch checked={streamEnabled} onChange={(e) => setStreamEnabled(e.target.checked)} />}
            label="Enable Streaming"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chat;
