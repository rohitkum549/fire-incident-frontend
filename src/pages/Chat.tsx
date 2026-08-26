import React, { useEffect, useState } from "react";
import { incidentService } from "../services/incidentService";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { ChatMessage } from "../types";

export const Chat: React.FC = () => {
  const [conversations, setConversations] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState<string>("");

  const loadMessages = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await incidentService.getChatMessages();
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chat channel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMessages();
  }, []);

  const handleSendMessage = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      name: "Operations Officer",
      message: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations((prev) => [...prev, newMessage]);
    setInputMessage("");
  };

  if (loading) {
    return <LoadingSpinner label="Connecting to command chat..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadMessages} />;
  }

  return (
    <main>
      <section className="chat-panel">
        <div className="chat-list">
          {conversations.map((item) => (
            <article key={item.id} className="chat-item">
              <strong>{item.name}</strong>
              <p className="chat-copy">{item.message}</p>
              <small>{item.time}</small>
            </article>
          ))}
          <form
            onSubmit={handleSendMessage}
            style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Send message to dispatch..."
              style={{
                flex: 1,
                padding: "0.5rem 0.75rem",
                borderRadius: "4px",
                border: "1px solid #374151",
                backgroundColor: "#111827",
                color: "#ffffff",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#dc2626",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </form>
        </div>
        <div className="chat-detail">
          <p className="metric-label">Active channel</p>
          <h2>Dispatch Center</h2>
          <p className="card-copy">Live updates and crew coordination for current incidents.</p>
        </div>
      </section>
    </main>
  );
};

export default Chat;
