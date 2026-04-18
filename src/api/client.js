import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

export const getDocuments = async () => {
    const response = await api.get("/knowledge/");
    return response.data;
};

export const uploadDocument = async (formData) => {
    const response = await api.post("/knowledge/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const reindexDocument = async (documentId) => {
    const response = await api.post(`/knowledge/${documentId}/reindex`);
    return response.data;
};

export const deleteDocument = async (documentId) => {
    const response = await api.delete(`/knowledge/${documentId}`);
    return response.data;
};

export const askAssistant = async (payload) => {
    const response = await api.post("/assistant/ask", payload);
    return response.data;
};