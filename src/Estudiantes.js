import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://sistema-notas-backend.onrender.com/api/estudiantes";

function Estudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [nuevoEstudiante, setNuevoEstudiante] = useState({
    nombre: "",
    matricula: "",
  });

  const [materia, setMateria] = useState("");
  const [calificacion, setCalificacion] = useState("");
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);

  useEffect(() => {
    obtenerEstudiantes();
  }, []);

  const obtenerEstudiantes = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setEstudiantes(res.data);
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
    }
  };

  const handleChange = (e) => {
    setNuevoEstudiante({
      ...nuevoEstudiante,
      [e.target.name]: e.target.value,
    });
  };

  const agregarEstudiante = async (e) => {
    e.preventDefault();
    try {
      await axios.post(BASE_URL, {
        ...nuevoEstudiante,
        notas: [],
      });
      setNuevoEstudiante({ nombre: "", matricula: "" });
      obtenerEstudiantes();
    } catch (error) {
      console.error("Error al agregar estudiante:", error);
    }
  };

  const agregarNota = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${BASE_URL}/${estudianteSeleccionado}/agregar-nota`,
        {
          materia,
          calificacion: Number(calificacion),
        }
      );
      setMateria("");
      setCalificacion("");
      setEstudianteSeleccionado(null);
      obtenerEstudiantes();
    } catch (error) {
      console.error("Error al agregar nota:", error);
    }
  };

  const eliminarEstudiante = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este estudiante?")) {
      try {
        await axios.delete(`${BASE_URL}/${id}`);
        obtenerEstudiantes();
      } catch (error) {
        console.error("Error al eliminar estudiante:", error);
      }
    }
  };

  return (
    <div style={contenedor}>
      <h1 style={titulo}>Sistema de Notas Estudiantiles</h1>

      <div style={seccion}>
        <h2>Agregar Estudiante</h2>
        <form onSubmit={agregarEstudiante} style={formulario}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={nuevoEstudiante.nombre}
            onChange={handleChange}
            required
            style={input}
          />
          <input
            type="text"
            name="matricula"
            placeholder="Matrícula"
            value={nuevoEstudiante.matricula}
            onChange={handleChange}
            required
            style={input}
          />
          <button type="submit" style={botonPrimario}>Agregar</button>
        </form>
      </div>

      <div style={seccion}>
        <h2>Estudiantes Registrados</h2>
        {estudiantes.map((est) => (
          <div key={est._id} style={tarjeta}>
            <h3>{est.nombre} <span style={matricula}>({est.matricula})</span></h3>
            <ul>
              {est.notas.map((nota, index) => (
                <li key={index}>
                  <strong>{nota.materia}</strong>: {nota.calificacion}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: "10px" }}>
              <button onClick={() => setEstudianteSeleccionado(est._id)} style={botonSecundario}>
                Agregar Nota
              </button>
              <button onClick={() => eliminarEstudiante(est._id)} style={botonEliminar}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {estudianteSeleccionado && (
        <div style={seccion}>
          <h3>Agregar Nota</h3>
          <form onSubmit={agregarNota} style={formulario}>
            <input
              type="text"
              placeholder="Materia"
              value={materia}
              onChange={(e) => setMateria(e.target.value)}
              required
              style={input}
            />
            <input
              type="number"
              placeholder="Calificación"
              value={calificacion}
              onChange={(e) => setCalificacion(e.target.value)}
              required
              style={input}
            />
            <button type="submit" style={botonPrimario}>Guardar Nota</button>
          </form>
        </div>
      )}
    </div>
  );
}

// 🎨 ESTILOS CSS EN JS
const contenedor = {
  maxWidth: "900px",
  margin: "auto",
  padding: "30px",
  fontFamily: "'Segoe UI', sans-serif",
  backgroundColor: "#f4f6f8",
};

const titulo = {
  textAlign: "center",
  marginBottom: "30px",
  fontSize: "32px",
  color: "#333",
};

const seccion = {
  marginBottom: "40px",
};

const formulario = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
};

const input = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  flex: "1",
  minWidth: "200px",
};

const botonPrimario = {
  backgroundColor: "#28a745",
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const botonSecundario = {
  backgroundColor: "#007bff",
  color: "#fff",
  padding: "8px 15px",
  border: "none",
  borderRadius: "5px",
  marginRight: "10px",
  cursor: "pointer",
};

const botonEliminar = {
  backgroundColor: "#dc3545",
  color: "#fff",
  padding: "8px 15px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const tarjeta = {
  backgroundColor: "#fff",
  borderRadius: "10px",
  padding: "20px",
  marginBottom: "15px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const matricula = {
  color: "#888",
  fontSize: "14px",
};

export default Estudiantes;
