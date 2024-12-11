import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import SendIcon from "@mui/icons-material/Send";
import CancelIcon from "@mui/icons-material/Cancel";
import { chatAPI } from "../api/api";

// Helper function to choose a female voice if available
const getFemaleVoice = () => {
  const voices = speechSynthesis.getVoices();
  // Try to find an English female voice
  return voices.find(
    (v) =>
      v.name.toLowerCase().includes("female") ||
      (v.lang === "en-US" && v.name.toLowerCase().includes("female"))
  ) || voices[0];
};

const VoiceRecordModal = ({ open, onClose, onSendMessage }) => {
  const [recognition, setRecognition] = useState(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';

      recog.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        setTranscript(spoken);
      };

      recog.onerror = (err) => {
        console.error("Speech recognition error:", err);
      };
      setRecognition(recog);
    }
  }, []);

  const startListening = () => {
    if (recognition && !listening) {
      setTranscript("");
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

  const handleSend = async () => {
    if (!transcript.trim()) return;
    // Send the transcript to the chat backend
    const response = await chatAPI(transcript.trim());
    const botResponse = response.data.response;
    onSendMessage(transcript.trim(), botResponse);
    speak(botResponse);
    setTranscript("");
    onClose();
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      setSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = getFemaleVoice();
      if (voice) utterance.voice = voice;
      utterance.onend = () => {
        setSpeaking(false);
      };
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window && speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  const handleCancel = () => {
    setTranscript("");
    stopListening();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>Record Your Voice Message</DialogTitle>
      <DialogContent>
        <Typography variant="body1" mb={2}>
          Press the microphone to start recording. Press stop to finish.
        </Typography>
        <Box display="flex" justifyContent="center" gap={2} mb={2}>
          <IconButton color="primary" onClick={startListening} disabled={listening}>
            <MicIcon />
          </IconButton>
          <IconButton color="error" onClick={stopListening} disabled={!listening}>
            <StopIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ minHeight: "2rem" }}>
          Transcript: {transcript}
        </Typography>
        {speaking && (
          <Box mt={2}>
            <Button variant="outlined" onClick={stopSpeaking}>Stop Voice Output</Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button startIcon={<CancelIcon />} onClick={handleCancel}>Cancel</Button>
        <Button startIcon={<SendIcon />} variant="contained" onClick={handleSend} disabled={!transcript.trim()}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VoiceRecordModal;
