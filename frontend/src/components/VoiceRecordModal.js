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

const VoiceRecordModal = ({ open, onClose, onSendTranscript }) => {
  const [recognition, setRecognition] = useState(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = 'en-US';

      recog.onresult = (event) => {
        let finalTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
        setTranscript(finalTranscript.trim());
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
    // If currently listening, stop first
    if (listening) {
      recognition.stop();
      setListening(false);
    }
    // Send transcript up to parent
    onSendTranscript(transcript.trim());
    setTranscript("");
    onClose(); // Close modal after sending
  };

  const handleCancel = () => {
    setTranscript("");
    if (listening) {
      recognition.stop();
      setListening(false);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>Record Your Voice Message</DialogTitle>
      <DialogContent>
        <Typography variant="body1" mb={2}>
          Press the microphone to start/stop recording. Speak your query, then send.
        </Typography>
        <Box display="flex" justifyContent="center" gap={2} mb={2}>
          <IconButton color={listening ? "secondary" : "primary"} onClick={listening ? stopListening : startListening}>
            {listening ? <StopIcon /> : <MicIcon />}
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
