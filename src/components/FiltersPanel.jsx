export default function FiltersPanel({
    filters,
    setFilters,
    documents,
    selectedDocumentId,
    setSelectedDocumentId,
}) {
    return (
        <section className="card">
            <h2>Filtros de consulta</h2>

            <div className="form-grid">
                <input
                    type="text"
                    placeholder="Departamento"
                    value={filters.department}
                    onChange={(e) =>
                        setFilters((prev) => ({ ...prev, department: e.target.value }))
                    }
                />

                <input
                    type="text"
                    placeholder="Sucursal"
                    value={filters.branch}
                    onChange={(e) =>
                        setFilters((prev) => ({ ...prev, branch: e.target.value }))
                    }
                />

                <input
                    type="text"
                    placeholder="Tipo de documento"
                    value={filters.document_type}
                    onChange={(e) =>
                        setFilters((prev) => ({ ...prev, document_type: e.target.value }))
                    }
                />

                <select
                    value={selectedDocumentId}
                    onChange={(e) => setSelectedDocumentId(e.target.value)}
                >
                    <option value="">Todos los documentos</option>
                    {documents.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                            #{doc.id} - {doc.title}
                        </option>
                    ))}
                </select>
            </div>
        </section>
    );
}