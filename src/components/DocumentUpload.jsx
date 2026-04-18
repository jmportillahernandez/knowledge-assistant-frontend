import { useState } from "react";
import { uploadDocument } from "../api/client";

export default function DocumentUpload({ onUploaded }) {
    const [title, setTitle] = useState("");
    const [department, setDepartment] = useState("");
    const [branch, setBranch] = useState("");
    const [documentType, setDocumentType] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            setMessage("Selecciona un archivo PDF.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const formData = new FormData();
            formData.append("title", title);
            formData.append("department", department);
            formData.append("branch", branch);
            formData.append("document_type", documentType);
            formData.append("file", file);

            await uploadDocument(formData);

            setTitle("");
            setDepartment("");
            setBranch("");
            setDocumentType("");
            setFile(null);
            setMessage("Documento cargado e indexado correctamente.");

            onUploaded();
        } catch (error) {
            setMessage(
                error?.response?.data?.detail || "Ocurrió un error al subir el documento."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="card">
            <h2>Cargar documento</h2>

            <form onSubmit={handleSubmit} className="form-grid">
                <input
                    type="text"
                    placeholder="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Departamento"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Sucursal"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Tipo de documento"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                />

                <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Subiendo..." : "Subir documento"}
                </button>
            </form>

            {message && <p className="status-message">{message}</p>}
        </section>
    );
}