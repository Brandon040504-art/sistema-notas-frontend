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

  return (
    <div style={{ padding: "20px" }}>
      <h2>Agregar Estudiante</h2>
      <form onSubmit={agregarEstudiante}>
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
        <button type="submit">Agregar</button>
      </form>

      <h2>Lista de Estudiantes</h2>
      <ul>
        {estudiantes.map((est) => (
          <li key={est._id}>
            <strong>{est.nombre}</strong> ({est.matricula})
            <ul>
              {est.notas.map((nota, index) => (
                <li key={index}>
                  {nota.materia}: {nota.calificacion}
                </li>
              ))}
            </ul>
            <button onClick={() => setEstudianteSeleccionado(est._id)}>
              Agregar Nota
            </button>
          </li>
        ))}
      </ul>

      {estudianteSeleccionado && (
        <div>
          <h3>Agregar Nota</h3>
          <form onSubmit={agregarNota}>
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
            <button type="submit">Guardar Nota</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Estudiantes;
