# voice-chat-bot-using-rag

#to launch the backend:
python -m uvicorn main:app --reload

#to launch the frontend:
cd frontend
npm start

 docker build -t myapp /workspaces/hr-chatbot-backend
 docker run -d -p 8000:8000 myapp
