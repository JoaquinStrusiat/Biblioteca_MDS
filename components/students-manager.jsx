"use client"

import { useState } from "react"

// Component imports only

export default function StudentsManager({ students, setStudents }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    matricula: "",
    email: "",
    telefono: "",
    carrera: "",
  })

  const filteredStudents = students.filter(
    (student) =>
      student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricula.includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleOpenModal = (student = null) => {
    if (student) {
      setEditingStudent(student)
      setFormData({
        nombre: student.nombre,
        matricula: student.matricula,
        email: student.email,
        telefono: student.telefono,
        carrera: student.carrera,
      })
    } else {
      setEditingStudent(null)
      setFormData({
        nombre: "",
        matricula: "",
        email: "",
        telefono: "",
        carrera: "",
      })
    }
    setShowModal(true)
  }

  const handleSaveStudent = () => {
    if (editingStudent) {
      setStudents(students.map((student) => (student.id === editingStudent.id ? { ...student, ...formData } : student)))
    } else {
      const newStudent = {
        ...formData,
        id: Math.max(...students.map((s) => s.id), 0) + 1,
        prestamosActivos: 0,
      }
      setStudents([...students, newStudent])
    }
    setShowModal(false)
  }

  const handleDeleteStudent = (id) => {
    if (confirm("¿Estás seguro de eliminar este alumno?")) {
      setStudents(students.filter((student) => student.id !== id))
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 fw-bold mb-1">Gestión de Alumnos</h2>
          <p className="text-muted mb-0">Administra el registro de estudiantes</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <i className="bi bi-plus-circle me-2"></i>Agregar Alumno
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
            placeholder="Buscar por nombre, matrícula o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="row g-3">
        {filteredStudents.map((student) => (
          <div key={student.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex gap-3 mb-3">
                  <div className="bg-primary bg-opacity-10 rounded p-2">
                    <i className="bi bi-person-circle fs-3 text-primary"></i>
                  </div>
                  <div className="flex-fill">
                    <h5 className="card-title mb-1">{student.nombre}</h5>
                    <div className="d-flex gap-2 align-items-center">
                      <span className="badge bg-secondary">{student.matricula}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="small mb-2">
                    <i className="bi bi-mortarboard-fill me-1"></i>
                    <span className="fw-medium">{student.carrera}</span>
                  </p>
                  <p className="small mb-1">
                    <i className="bi bi-envelope me-1"></i>
                    <span className="text-truncate d-inline-block" style={{ maxWidth: "200px" }}>
                      {student.email}
                    </span>
                  </p>
                  <p className="small mb-2">
                    <i className="bi bi-telephone me-1"></i>
                    {student.telefono}
                  </p>
                  <span className={`badge ${student.prestamosActivos > 0 ? "bg-info" : "bg-secondary"}`}>
                    {student.prestamosActivos} préstamo{student.prestamosActivos !== 1 ? "s" : ""} activo
                    {student.prestamosActivos !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-info flex-fill text-white" onClick={() => handleOpenModal(student)}>
                    <i className="bi bi-pencil me-1"></i>Editar
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteStudent(student.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-people fs-1 text-muted"></i>
          <p className="text-muted mt-2">No se encontraron alumnos</p>
        </div>
      )}

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingStudent ? "Editar Alumno" : "Agregar Nuevo Alumno"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre Completo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Nombre del alumno"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Matrícula</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.matricula}
                    onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                    placeholder="2024001"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alumno@escuela.edu"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="+52 555 1234"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Carrera</label>
                  <select
                    className="form-select"
                    value={formData.carrera}
                    onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                  >
                    <option value="">Seleccionar carrera...</option>
                    <option value="Tecnicatura Universitaria en Programación">Tecnicatura Universitaria en Programación</option>
                    <option value="Ingeniería en Sistemas">Ingeniería en Sistemas</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveStudent}>
                  {editingStudent ? "Guardar Cambios" : "Agregar Alumno"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
