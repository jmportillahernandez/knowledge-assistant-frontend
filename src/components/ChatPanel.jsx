import { useState } from "react";
import { askAssistant } from "../api/client";

export default function ChatPanel({
    filters,
    selectedDocumentId,
    messages,
    setMessages,
}) {
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAsk = async (event) => {
        event.preventDefault();

        if (!question.trim()) return;

        const userMessage = {
            role: "user",
            content: question,
        };

        setMessages((prev) => [...prev, userMessage]);

        try {
            setLoading(true);

            const payload = {
                question,
                top_k: 5,
                department: filters.department || null,
                branch: filters.branch || null,
                document_type: filters.document_type || null,
                document_id: selectedDocumentId ? Number(selectedDocumentId) : null,
            };

            const result = await askAssistant(payload);

            const assistantMessage = {
                role: "assistant",
                content: result.answer,
                sources: result.sources || [],
            };

            setMessages((prev) => [...prev, assistantMessage]);
            setQuestion("");
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        error?.response?.data?.detail ||
                        "No se pudo procesar la consulta.",
                    sources: [],
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="card">
            <h2>Asistente</h2>

            <div className="chat-box">
                {messages.length === 0 ? (
                    <p className="empty-chat">
                        Haz una pregunta sobre tus documentos cargados.
                    </p>
                ) : (
                    messages.map((message, index) => (
                        <div key={index} className={`message ${message.role}`}>
                            <div className="message-role">
                                {message.role === "user" ? "Tú" : "Asistente"}
                            </div>
                            <div className="message-content">{message.content}</div>

                            {message.sources && message.sources.length > 0 && (
                                <div className="sources-box">
                                    <strong>Fuentes:</strong>
                                    <ul>
                                        {message.sources.map((source, sourceIndex) => (
                                            <li key={sourceIndex}>
                                                Documento #{source.document_id} - {source.title} | página{" "}
                                                {source.page} | área: {source.department || "-"} | sucursal:{" "}
                                                {source.branch || "-"} | tipo:{" "}
                                                {source.document_type || "-"}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleAsk} className="chat-form">
                <textarea
                    placeholder="Escribe tu pregunta..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={4}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Consultando..." : "Preguntar"}
                </button>
            </form>
        </section>
    );
}