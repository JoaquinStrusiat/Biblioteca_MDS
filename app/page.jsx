"use client"

import { useState } from "react"
import Sidebar from "../components/sidebar"
import BooksManager from "../components/books-manager"
import StudentsManager from "../components/students-manager"
import LoansManager from "../components/loans-manager"

// Datos iniciales
const initialBooks = [
  {
    id: 1,
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    isbn: "978-0307474728",
    categoria: "Ficción",
    copias: 3,
    disponibles: 2,
  },
  {
    id: 2,
    titulo: "Don Quijote de la Mancha",
    autor: "Miguel de Cervantes",
    isbn: "978-8424936464",
    categoria: "Clásicos",
    copias: 5,
    disponibles: 4,
  },
  {
    id: 3,
    titulo: "1984",
    autor: "George Orwell",
    isbn: "978-0451524935",
    categoria: "Distopía",
    copias: 4,
    disponibles: 1,
  },
  {
    id: 4,
    titulo: "El principito",
    autor: "Antoine de Saint-Exupéry",
    isbn: "978-0156012195",
    categoria: "Infantil",
    copias: 6,
    disponibles: 6,
  },
  {
    id: 5,
    titulo: "Crónica de una muerte anunciada",
    autor: "Gabriel García Márquez",
    isbn: "978-0307387349",
    categoria: "Ficción",
    copias: 2,
    disponibles: 0,
  },
  {
    id: 6,
    titulo: "La sombra del viento",
    autor: "Carlos Ruiz Zafón",
    isbn: "978-8408163381",
    categoria: "Misterio",
    copias: 3,
    disponibles: 3,
  },
]

const initialStudents = [
  {
    id: 1,
    nombre: "María González",
    matricula: "2024001",
    email: "maria.gonzalez@escuela.edu",
    telefono: "+52 555 1234",
    carrera: "Tecnicatura Universitaria en Programación",
    prestamosActivos: 2,
  },
  {
    id: 2,
    nombre: "Juan Pérez",
    matricula: "2024002",
    email: "juan.perez@escuela.edu",
    telefono: "+52 555 5678",
    carrera: "Ingeniería en Sistemas",
    prestamosActivos: 1,
  },
  {
    id: 3,
    nombre: "Ana Martínez",
    matricula: "2024003",
    email: "ana.martinez@escuela.edu",
    telefono: "+52 555 9012",
    carrera: "Tecnicatura Universitaria en Programación",
    prestamosActivos: 0,
  },
  {
    id: 4,
    nombre: "Carlos Rodríguez",
    matricula: "2024004",
    email: "carlos.rodriguez@escuela.edu",
    telefono: "+52 555 3456",
    carrera: "Ingeniería en Sistemas",
    prestamosActivos: 3,
  },
  {
    id: 5,
    nombre: "Laura Sánchez",
    matricula: "2024005",
    email: "laura.sanchez@escuela.edu",
    telefono: "+52 555 7890",
    carrera: "Tecnicatura Universitaria en Programación",
    prestamosActivos: 1,
  },
  {
    id: 6,
    nombre: "Diego Torres",
    matricula: "2024006",
    email: "diego.torres@escuela.edu",
    telefono: "+52 555 2345",
    carrera: "Ingeniería en Sistemas",
    prestamosActivos: 0,
  },
]

const initialLoans = [
  {
    id: 1,
    alumnoId: 1,
    libroId: 1,
    fechaPrestamo: "2024-01-15",
    fechaDevolucion: "2024-01-29",
    estado: "activo",
  },
  {
    id: 2,
    alumnoId: 1,
    libroId: 2,
    fechaPrestamo: "2024-01-18",
    fechaDevolucion: "2024-02-01",
    estado: "activo",
  },
  {
    id: 3,
    alumnoId: 2,
    libroId: 3,
    fechaPrestamo: "2024-01-10",
    fechaDevolucion: "2024-01-24",
    estado: "activo",
  },
]

export default function Home() {
  const [activeSection, setActiveSection] = useState("books")
  const [books, setBooks] = useState(initialBooks)
  const [students, setStudents] = useState(initialStudents)
  const [loans, setLoans] = useState(initialLoans)

  return (
    <div className="d-flex">
      <div style={{ width: "250px", height: "100vh", position: "fixed", left: 0, top: 0 }}>
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>

      <main style={{ marginLeft: "250px", minHeight: "100vh", width: "calc(100% - 250px)" }}>
        <div className="container-fluid py-4">
          {activeSection === "books" && (
            <BooksManager books={books} setBooks={setBooks} />
          )}
          {activeSection === "students" && (
            <StudentsManager students={students} setStudents={setStudents} />
          )}
          {activeSection === "loans" && (
            <LoansManager 
              loans={loans} 
              setLoans={setLoans} 
              books={books} 
              setBooks={setBooks} 
              students={students} 
              setStudents={setStudents} 
            />
          )}
        </div>
      </main>
    </div>
  )
}
