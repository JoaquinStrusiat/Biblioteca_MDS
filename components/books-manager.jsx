"use client"

import { useState } from "react"

// Component imports only

export default function BooksManager({ books, setBooks }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    isbn: "",
    categoria: "",
    copias: "",
    disponibles: "",
  })

  const filteredBooks = books.filter(
    (book) =>
      book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm),
  )

  const handleOpenModal = (book = null) => {
    if (book) {
      setEditingBook(book)
      setFormData(book)
    } else {
      setEditingBook(null)
      setFormData({
        titulo: "",
        autor: "",
        isbn: "",
        categoria: "",
        copias: "",
        disponibles: "",
      })
    }
    setShowModal(true)
  }

  const handleSaveBook = () => {
    if (editingBook) {
      setBooks(books.map((book) => (book.id === editingBook.id ? { ...formData, id: book.id } : book)))
    } else {
      const newBook = {
        ...formData,
        id: Math.max(...books.map((b) => b.id), 0) + 1,
        copias: Number.parseInt(formData.copias) || 0,
        disponibles: Number.parseInt(formData.disponibles) || 0,
      }
      setBooks([...books, newBook])
    }
    setShowModal(false)
  }

  const handleDeleteBook = (id) => {
    if (confirm("¿Estás seguro de eliminar este libro?")) {
      setBooks(books.filter((book) => book.id !== id))
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 fw-bold mb-1">Gestión de Libros</h2>
          <p className="text-muted mb-0">Administra el catálogo de la biblioteca</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <i className="bi bi-plus-circle me-2"></i>Agregar Libro
        </button>
      </div>

      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por título, autor o ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="row g-3">
        {filteredBooks.map((book) => (
          <div key={book.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex gap-3 mb-3">
                  <div className="bg-primary bg-opacity-10 rounded p-2">
                    <i className="bi bi-book fs-3 text-primary"></i>
                  </div>
                  <div className="flex-fill">
                    <h5 className="card-title mb-1">{book.titulo}</h5>
                    <p className="text-muted small mb-0">{book.autor}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="small mb-1">
                    <strong>ISBN:</strong> {book.isbn}
                  </p>
                  <p className="small mb-2">
                    <strong>Categoría:</strong> {book.categoria}
                  </p>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`badge ${book.disponibles > 0 ? "bg-success" : "bg-danger"}`}>
                      {book.disponibles > 0 ? "Disponible" : "No disponible"}
                    </span>
                    <span className="text-muted small">
                      {book.disponibles}/{book.copias} copias
                    </span>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-info flex-fill text-white" onClick={() => handleOpenModal(book)}>
                    <i className="bi bi-pencil me-1"></i>Editar
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteBook(book.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-book fs-1 text-muted"></i>
          <p className="text-muted mt-2">No se encontraron libros</p>
        </div>
      )}

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingBook ? "Editar Libro" : "Agregar Nuevo Libro"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Título</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Título del libro"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Autor</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.autor}
                    onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                    placeholder="Nombre del autor"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">ISBN</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    placeholder="978-XXXXXXXXXX"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Categoría</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    placeholder="Ficción, Ciencia, etc."
                  />
                </div>
                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label">Copias Totales</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.copias}
                      onChange={(e) => setFormData({ ...formData, copias: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label">Disponibles</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.disponibles}
                      onChange={(e) => setFormData({ ...formData, disponibles: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveBook}>
                  {editingBook ? "Guardar Cambios" : "Agregar Libro"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
