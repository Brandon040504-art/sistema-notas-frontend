import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Estudiantes from "./Estudiantes";
import Login from "./Login";

function App() {
  const rol = localStorage.getItem("rol");
  const nombre = localStorage.getItem("nombre");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <Router>
      <nav style={{ padding: "10px", background: "#eee" }}>
        <Link to="/">Inicio</Link> |{" "}
        <Link to="/estudiantes">Estudiantes</Link> |{" "}
        {!rol ? <Link to="/login">Login</Link> : <button onClick={logout}>Salir</button>}
        {rol && <span style={{ marginLeft: "10px" }}>Bienvenido {nombre} ({rol})</span>}
      </nav>

      <Routes>
        <Route path="/" element={<h1>Página principal</h1>} />
        <Route path="/estudiantes" element={<Estudiantes />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

