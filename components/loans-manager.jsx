"use client"

import { useState } from "react"

export default function LoansManager({ loans, setLoans, books, setBooks, students, setStudents }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("todos")
  const [showModal, setShowModal] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [returnFormData, setReturnFormData] = useState({
    isDamaged: false,
    multa: {
      monto: "",
      motivo: ""
    }
  })
  const [formData, setFormData] = useState({
    alumnoId: "",
    libroId: "",
    fechaPrestamo: new Date().toISOString().split("T")[0],
    fechaDevolucion: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  })

  // Función para obtener los datos del alumno
  const getStudentData = (studentId) => {
    return students.find((s) => s.id === studentId)
  }

  // Función para obtener los datos del libro
  const getBookData = (bookId) => {
    return books.find((b) => b.id === bookId)
  }

  // Filtrar préstamos
  const filteredLoans = loans.filter((loan) => {
    const student = getStudentData(loan.alumnoId)
    const book = getBookData(loan.libroId)

    const matchesSearch =
      student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricula.includes(searchTerm) ||
      book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm)

    const matchesFilter = filterStatus === "todos" || loan.estado === filterStatus

    return matchesSearch && matchesFilter
  })

  // Manejar el préstamo de un libro
  const handleSaveLoan = () => {
    // Verificar que el libro esté disponible
    const book = books.find((b) => b.id === parseInt(formData.libroId))
    const student = students.find((s) => s.id === parseInt(formData.alumnoId))

    if (!book || !student) {
      alert("Por favor selecciona un libro y un alumno")
      return
    }

    if (book.disponibles === 0) {
      alert("Este libro no tiene copias disponibles")
      return
    }

    // Crear el nuevo préstamo
    const newLoan = {
      ...formData,
      id: Math.max(...loans.map((l) => l.id), 0) + 1,
      alumnoId: parseInt(formData.alumnoId),
      libroId: parseInt(formData.libroId),
      estado: "activo",
    }

    // Actualizar disponibilidad del libro
    const updatedBooks = books.map((b) =>
      b.id === parseInt(formData.libroId)
        ? { ...b, disponibles: b.disponibles - 1 }
        : b
    )

    // Actualizar préstamos activos del alumno
    const updatedStudents = students.map((s) =>
      s.id === parseInt(formData.alumnoId)
        ? { ...s, prestamosActivos: s.prestamosActivos + 1 }
        : s
    )

    setLoans([...loans, newLoan])
    setBooks(updatedBooks)
    setStudents(updatedStudents)
    setShowModal(false)
  }

  // Iniciar proceso de devolución
  const handleStartReturn = (loan) => {
    setSelectedLoan(loan)
    setReturnFormData({
      isDamaged: false,
      multa: {
        monto: "",
        motivo: ""
      }
    })
    setShowReturnModal(true)
  }

  // Manejar la devolución de un libro
  const handleReturnBook = () => {
    if (!selectedLoan) return

    // Actualizar el estado del préstamo
    const updatedLoans = loans.map((l) =>
      l.id === selectedLoan.id 
        ? { 
            ...l, 
            estado: "devuelto",
            multa: returnFormData.isDamaged ? returnFormData.multa : null 
          } 
        : l
    )

    // Actualizar disponibilidad del libro
    const updatedBooks = books.map((b) =>
      b.id === selectedLoan.libroId
        ? { ...b, disponibles: b.disponibles + 1 }
        : b
    )

    // Actualizar préstamos activos del alumno
    const updatedStudents = students.map((s) =>
      s.id === selectedLoan.alumnoId
        ? { ...s, prestamosActivos: s.prestamosActivos - 1 }
        : s
    )

    setLoans(updatedLoans)
    setBooks(updatedBooks)
    setStudents(updatedStudents)
    setShowReturnModal(false)
    setSelectedLoan(null)
  }

  const activeLoansCount = loans.filter((l) => l.estado === "activo").length
  const returnedLoansCount = loans.filter((l) => l.estado === "devuelto").length
  const loansWithFinesCount = loans.filter((l) => l.multa).length

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 fw-bold mb-1">Gestión de Préstamos</h2>
          <p className="text-muted mb-0">Administra los préstamos de libros</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>Nuevo Préstamo
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card bg-primary bg-opacity-10">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-25 rounded p-2">
                <i className="bi bi-clock-history fs-3 text-primary"></i>
              </div>
              <div>
                <p className="text-muted small mb-0">Préstamos Activos</p>
                <p className="h3 fw-bold mb-0">{activeLoansCount}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card bg-success bg-opacity-10">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="bg-success bg-opacity-25 rounded p-2">
                <i className="bi bi-check-circle fs-3 text-success"></i>
              </div>
              <div>
                <p className="text-muted small mb-0">Devueltos</p>
                <p className="h3 fw-bold mb-0">{returnedLoansCount}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card bg-warning bg-opacity-10">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="bg-warning bg-opacity-25 rounded p-2">
                <i className="bi bi-exclamation-triangle fs-3 text-warning"></i>
              </div>
              <div>
                <p className="text-muted small mb-0">Con Multas</p>
                <p className="h3 fw-bold mb-0">{loansWithFinesCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-8">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por alumno, libro, matrícula o ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="btn-group w-100" role="group">
            <button
              type="button"
              className={`btn ${filterStatus === "todos" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilterStatus("todos")}
            >
              Todos
            </button>
            <button
              type="button"
              className={`btn ${filterStatus === "activo" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilterStatus("activo")}
            >
              Activos
            </button>
            <button
              type="button"
              className={`btn ${filterStatus === "devuelto" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilterStatus("devuelto")}
            >
              Devueltos
            </button>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {filteredLoans.map((loan) => {
          const student = getStudentData(loan.alumnoId)
          const book = getBookData(loan.libroId)

          return (
            <div key={loan.id} className="col-12 col-lg-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex gap-2">
                      <div className="bg-primary bg-opacity-10 rounded p-2">
                        <i className="bi bi-journal-text fs-5 text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">{book.titulo}</h6>
                        <p className="text-muted small mb-0">ISBN: {book.isbn}</p>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      {loan.multa && (
                        <span className="badge bg-warning text-dark">
                          <i className="bi bi-exclamation-triangle me-1"></i>
                          Multa: ${loan.multa.monto}
                        </span>
                      )}
                      <span className={`badge ${loan.estado === "activo" ? "bg-info" : "bg-success"}`}>
                        {loan.estado === "activo" ? "Activo" : "Devuelto"}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="small mb-1">
                      <i className="bi bi-person me-1"></i>
                      <strong>{student.nombre}</strong>{" "}
                      <span className="badge bg-secondary">{student.matricula}</span>
                    </p>
                    <p className="small mb-1">
                      <i className="bi bi-mortarboard me-1"></i>
                      {student.carrera}
                    </p>
                    <div className="d-flex gap-3 text-muted small">
                      <span>
                        <i className="bi bi-calendar-event me-1"></i>Préstamo: {loan.fechaPrestamo}
                      </span>
                      <span>
                        <i className="bi bi-calendar-check me-1"></i>Devolución: {loan.fechaDevolucion}
                      </span>
                    </div>
                    {loan.multa && (
                      <p className="small mt-2 text-warning">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        Motivo de multa: {loan.multa.motivo}
                      </p>
                    )}
                  </div>

                  {loan.estado === "activo" && (
                    <button className="btn btn-sm btn-success w-100" onClick={() => handleStartReturn(loan)}>
                      <i className="bi bi-check-circle me-1"></i>Marcar como Devuelto
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredLoans.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-journal-text fs-1 text-muted"></i>
          <p className="text-muted mt-2">No se encontraron préstamos</p>
        </div>
      )}

      {/* Modal de Devolución */}
      {showReturnModal && selectedLoan && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Devolución de Libro</h5>
                <button type="button" className="btn-close" onClick={() => setShowReturnModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isDamaged"
                      checked={returnFormData.isDamaged}
                      onChange={(e) => setReturnFormData({
                        ...returnFormData,
                        isDamaged: e.target.checked,
                        multa: e.target.checked ? returnFormData.multa : { monto: "", motivo: "" }
                      })}
                    />
                    <label className="form-check-label" htmlFor="isDamaged">
                      ¿El libro presenta daños?
                    </label>
                  </div>
                </div>

                {returnFormData.isDamaged && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Monto de la Multa ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={returnFormData.multa.monto}
                        onChange={(e) => setReturnFormData({
                          ...returnFormData,
                          multa: { ...returnFormData.multa, monto: e.target.value }
                        })}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Motivo de la Multa</label>
                      <textarea
                        className="form-control"
                        value={returnFormData.multa.motivo}
                        onChange={(e) => setReturnFormData({
                          ...returnFormData,
                          multa: { ...returnFormData.multa, motivo: e.target.value }
                        })}
                        placeholder="Describe los daños encontrados..."
                        rows="3"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowReturnModal(false)}>
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleReturnBook}
                  disabled={returnFormData.isDamaged && (!returnFormData.multa.monto || !returnFormData.multa.motivo)}
                >
                  Confirmar Devolución
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Nuevo Préstamo */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Registrar Nuevo Préstamo</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Alumno</label>
                  <select
                    className="form-select"
                    value={formData.alumnoId}
                    onChange={(e) => setFormData({ ...formData, alumnoId: e.target.value })}
                  >
                    <option value="">Seleccionar alumno...</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.nombre} - {student.matricula} ({student.carrera})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Libro</label>
                  <select
                    className="form-select"
                    value={formData.libroId}
                    onChange={(e) => setFormData({ ...formData, libroId: e.target.value })}
                  >
                    <option value="">Seleccionar libro...</option>
                    {books
                      .filter((book) => book.disponibles > 0)
                      .map((book) => (
                        <option key={book.id} value={book.id}>
                          {book.titulo} - {book.disponibles} copias disponibles
                        </option>
                      ))}
                  </select>
                </div>
                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label">Fecha Préstamo</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.fechaPrestamo}
                      onChange={(e) => setFormData({ ...formData, fechaPrestamo: e.target.value })}
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label">Fecha Devolución</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.fechaDevolucion}
                      onChange={(e) => setFormData({ ...formData, fechaDevolucion: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveLoan}
                  disabled={!formData.alumnoId || !formData.libroId}
                >
                  Registrar Préstamo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}