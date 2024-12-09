import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders navbar links", () => {
  render(<App />);
  const loginLink = screen.getByText(/login/i);
  expect(loginLink).toBeInTheDocument();

  const chatbotLink = screen.getByText(/chatbot/i);
  expect(chatbotLink).toBeInTheDocument();

  const uploadLink = screen.getByText(/upload documents/i);
  expect(uploadLink).toBeInTheDocument();
});
