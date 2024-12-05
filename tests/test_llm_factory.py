import backend.chatbot.llm_factory

def test_llm_factory():
    system_message = "Hello! How can I help you today?"
    query = "What are the best practices for HR policies?"
    response = backend.chatbot.llm_factory.LLMFactory.call_llm(system_message, query)
    print(response)

test_llm_factory()