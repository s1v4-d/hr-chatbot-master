from backend.chatbot.chatbot import HRChatbot

def test_chatbot():
    chatbot = HRChatbot()
    response = chatbot.chatbot("What are the best practices for HR policies?")
    assert response is not None
    assert isinstance(response, str)
    assert len(response) > 0
    print(response)
    print("Chatbot test passed.")

test_chatbot()