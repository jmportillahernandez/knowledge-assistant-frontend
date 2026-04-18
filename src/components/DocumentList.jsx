import { deleteDocument, reindexDocument } from "../api/client";

export default function DocumentList({
    documents,
    loading,
    selectedDocumentId,
    onSelectDocument,
    onRefresh,
}) {
    const handleReindex = async (documentId) => {
        try {
            await reindexDocument(documentId);
            onRefresh();
        } catch (error) {
            alert(
                error?.response?.data?.detail || "No se pudo reindexar el documento."
            );
        }
    };

    const handleDelete = async (documentId) => {
        const confirmed = window.confirm(
            "¿Seguro que deseas eliminar este documento?"
        );

        if (!confirmed) return;

        try {
            await deleteDocument(documentId);
            onRefresh();
            if (selectedDocumentId === documentId) {
                onSelectDocument("");
            }
        } catch (error) {
            alert(
                error?.response?.data?.detail || "No se pudo eliminar el documento."
            );
        }
    };

    return (
        <section className="card">
            <div className="section-header">
                <h2>Documentos cargados</h2>
                <button onClick={onRefresh}>Actualizar</button>
            </div>

            {loading ? (
                <p>Cargando documentos...</p>
            ) : documents.length === 0 ? (
                <p>No hay documentos cargados.</p>
            ) : (
                <div className="table-wrapper">
                    <table className="docs-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Título</th>
                                <th>Archivo</th>
                                <th>Departamento</th>
                                <th>Sucursal</th>
                                <th>Tipo</th>
                                <th>Status</th>
                                <th>Seleccionar</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc) => (
                                <tr key={doc.id}>
                                    <td>{doc.id}</td>
                                    <td>{doc.title}</td>
                                    <td>{doc.original_name}</td>
                                    <td>{doc.department || "-"}</td>
                                    <td>{doc.branch || "-"}</td>
                                    <td>{doc.document_type || "-"}</td>
                                    <td>{doc.status}</td>
                                    <td>
                                        <input
                                            type="radio"
                                            name="selected_document"
                                            checked={selectedDocumentId === doc.id}
                                            onChange={() => onSelectDocument(doc.id)}
                                        />
                                    </td>
                                    <td className="actions-cell">
                                        <button onClick={() => handleReindex(doc.id)}>
                                            Reindexar
                                        </button>
                                        <button
                                            className="danger-button"
                                            onClick={() => handleDelete(doc.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}