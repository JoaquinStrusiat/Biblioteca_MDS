export const metadata = {
  title: "Sistema de Biblioteca",
  description: "Administración de préstamos de libros",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" async></script>
      </head>
      <body className="min-vh-100">{children}</body>
    </html>
  )
}
