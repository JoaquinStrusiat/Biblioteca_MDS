"use client"

export default function Sidebar({ activeSection, onSectionChange }) {
  const menuItems = [
    { id: "books", label: "Libros", icon: "bi-book" },
    { id: "students", label: "Alumnos", icon: "bi-people" },
    { id: "loans", label: "Préstamos", icon: "bi-journal-text" },
  ]

  return (
    <aside className="bg-light border-end w-100 h-100">
      <div className="d-flex flex-column h-100" style={{ position: "sticky", top: 0 }}>
        <div className="p-4 border-bottom">
          <h1 className="h5 fw-bold mb-1">Sistema Biblioteca</h1>
          <p className="text-muted small mb-0">Administración</p>
        </div>

        <nav className="flex-grow-1 p-3">
          <ul className="nav nav-pills flex-column gap-2">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id

              return (
                <li key={item.id} className="nav-item w-100">
                  <button
                    onClick={() => onSectionChange(item.id)}
                    className={`nav-link w-100 d-flex align-items-center ${isActive ? 'active' : ''}`}
                  >
                    <i className={`bi ${item.icon} me-2`} style={{ width: "20px" }}></i>
                    <span>{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-3 border-top text-center">
          <p className="text-muted small mb-0">v1.0.0</p>
        </div>
      </div>
    </aside>
  )
}
