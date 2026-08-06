export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
}

export interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}