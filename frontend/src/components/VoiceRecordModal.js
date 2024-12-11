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

const VoiceRecordModal = ({ open, onClose, onSendMessage }) => {
  const [recognition, setRecognition] = useState(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

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
    const response = await chatAPI(transcript.trim());
    const botResponse = response.data.response;
    onSendMessage(transcript.trim(), botResponse);
    setTranscript("");
    onClose();
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
