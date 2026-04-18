import { useEffect, useState } from "react";
import Header from "./components/Header";
import DocumentUpload from "./components/DocumentUpload";
import DocumentList from "./components/DocumentList";
import FiltersPanel from "./components/FiltersPanel";
import ChatPanel from "./components/ChatPanel";
import { getDocuments } from "./api/client";

export default function App() {
    const [documents, setDocuments] = useState([]);
    const [loadingDocuments, setLoadingDocuments] = useState(false);
    const [selectedDocumentId, setSelectedDocumentId] = useState("");
    const [messages, setMessages] = useState([]);
    const [filters, setFilters] = useState({
        department: "",
        branch: "",
        document_type: "",
    });

    const loadDocuments = async () => {
        try {
            setLoadingDocuments(true);
            const data = await getDocuments();
            setDocuments(data);
        } catch (error) {
            console.error("Error loading documents:", error);
        } finally {
            setLoadingDocuments(false);
        }
    };

    useEffect(() => {
        loadDocuments();
    }, []);

    return (
        <div className="app-container">
            <Header />

            <div className="layout-grid">
                <div className="left-column">
                    <DocumentUpload onUploaded={loadDocuments} />

                    <DocumentList
                        documents={documents}
                        loading={loadingDocuments}
                        selectedDocumentId={Number(selectedDocumentId) || ""}
                        onSelectDocument={setSelectedDocumentId}
                        onRefresh={loadDocuments}
                    />
                </div>

                <div className="right-column">
                    <FiltersPanel
                        filters={filters}
                        setFilters={setFilters}
                        documents={documents}
                        selectedDocumentId={selectedDocumentId}
                        setSelectedDocumentId={setSelectedDocumentId}
                    />

                    <ChatPanel
                        filters={filters}
                        selectedDocumentId={selectedDocumentId}
                        messages={messages}
                        setMessages={setMessages}
                    />
                </div>
            </div>
        </div>
    );
}