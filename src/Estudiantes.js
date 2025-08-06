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
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Sistema de Notas Estudiantiles</h1>

      <h2>Agregar Estudiante</h2>
      <form onSubmit={agregarEstudiante} style={estilosFormulario}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={nuevoEstudiante.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="matricula"
          placeholder="Matrícula"
          value={nuevoEstudiante.matricula}
          onChange={handleChange}
          required
        />
        <button type="submit" style={boton}>Agregar</button>
      </form>

      <h2>Lista de Estudiantes</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {estudiantes.map((est) => (
          <li key={est._id} style={caja}>
            <strong>{est.nombre}</strong> ({est.matricula})
            <ul>
              {est.notas.map((nota, index) => (
                <li key={index}>
                  {nota.materia}: {nota.calificacion}
                </li>
              ))}
            </ul>
            <button onClick={() => setEstudianteSeleccionado(est._id)} style={boton}>
              Agregar Nota
            </button>
            <button
              onClick={() => eliminarEstudiante(est._id)}
              style={{ ...boton, backgroundColor: "red", marginLeft: "10px" }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {estudianteSeleccionado && (
        <div>
          <h3>Agregar Nota</h3>
          <form onSubmit={agregarNota} style={estilosFormulario}>
            <input
              type="text"
              placeholder="Materia"
              value={materia}
              onChange={(e) => setMateria(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Calificación"
              value={calificacion}
              onChange={(e) => setCalificacion(e.target.value)}
              required
            />
            <button type="submit" style={boton}>Guardar Nota</button>
          </form>
        </div>
      )}
    </div>
  );
}

// 🎨 Estilos visuales básicos
const estilosFormulario = {
  marginBottom: "20px",
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const caja = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "10px",
  marginBottom: "10px",
  backgroundColor: "#f9f9f9",
};

const boton = {
  padding: "5px 10px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#007bff",
  color: "#fff",
  cursor: "pointer",
};

export default Estudiantes;
