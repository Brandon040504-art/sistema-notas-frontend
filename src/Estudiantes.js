import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Necesitarás React Router

const estilos = { /* mismos estilos que tienes */ };

function Estudiantes() {
  const navigate = useNavigate();
  const [estudiantes, setEstudiantes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [matricula, setMatricula] = useState('');
  const [nota, setNota] = useState('');
  const [materia, setMateria] = useState('');
  const [idSeleccionado, setIdSeleccionado] = useState('');
  const [usuario, setUsuario] = useState(null);

  const obtenerUsuario = () => {
    const data = localStorage.getItem('usuario');
    if (data) {
      setUsuario(JSON.parse(data));
    } else {
      navigate('/login'); // Si no hay sesión, redirige
    }
  };

  const obtenerEstudiantes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        'https://sistema-notas-backend.onrender.com/api/estudiantes',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEstudiantes(res.data);
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
    }
  };

  const agregarEstudiante = async () => {
    if (!nombre || !matricula) return alert('Campos requeridos');
    const token = localStorage.getItem('token');
    await axios.post(
      'https://sistema-notas-backend.onrender.com/api/estudiantes',
      { nombre, matricula },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNombre('');
    setMatricula('');
    obtenerEstudiantes();
  };

  const eliminarEstudiante = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://sistema-notas-backend.onrender.com/api/estudiantes/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      obtenerEstudiantes();
    } catch (err) {
      console.error('Error al eliminar estudiante:', err);
    }
  };

  const agregarNota = async () => {
    if (!nota || !materia || !idSeleccionado) return alert('Completa los campos de nota');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `https://sistema-notas-backend.onrender.com/api/estudiantes/${idSeleccionado}/notas`,
        {
          materia,
          calificacion: parseFloat(nota)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNota('');
      setMateria('');
      setIdSeleccionado('');
      obtenerEstudiantes();
    } catch (err) {
      console.error('Error al agregar nota:', err);
    }
  };

  useEffect(() => {
    obtenerUsuario();
    obtenerEstudiantes();
  }, []);

  return (
    <div style={estilos.contenedor}>
      <h1 style={estilos.titulo}>Sistema de Notas Estudiantiles</h1>

      {/* Mostrar solo si es Admin o Profesor */}
      {(usuario?.rol === 'admin' || usuario?.rol === 'profesor') && (
        <div style={estilos.formulario}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            style={estilos.input}
          />
          <input
            type="text"
            placeholder="Matrícula"
            value={matricula}
            onChange={e => setMatricula(e.target.value)}
            style={estilos.input}
          />
          <button onClick={agregarEstudiante} style={estilos.boton}>Agregar Estudiante</button>
        </div>
      )}

      <table style={estilos.tabla}>
        <thead>
          <tr>
            <th style={estilos.thtd}>Nombre</th>
            <th style={estilos.thtd}>Matrícula</th>
            <th style={estilos.thtd}>Notas</th>
            {(usuario?.rol === 'admin' || usuario?.rol === 'profesor') && (
              <th style={estilos.thtd}>Eliminar</th>
            )}
          </tr>
        </thead>
        <tbody>
          {estudiantes.map(est => (
            <tr key={est._id}>
              <td style={estilos.thtd}>{est.nombre}</td>
              <td style={estilos.thtd}>{est.matricula}</td>
              <td style={estilos.thtd}>
                {est.notas?.map((nota, i) => (
                  <div key={i}>{nota.materia}: {nota.calificacion}</div>
                ))}

                {/* Solo Admin y Profesor pueden agregar notas */}
                {(usuario?.rol === 'admin' || usuario?.rol === 'profesor') && (
                  <div style={estilos.notaForm}>
                    <input
                      type="text"
                      placeholder="Materia"
                      value={idSeleccionado === est._id ? materia : ''}
                      onChange={e => {
                        setIdSeleccionado(est._id);
                        setMateria(e.target.value);
                      }}
                      style={estilos.input}
                    />
                    <input
                      type="number"
                      placeholder="Calificación"
                      value={idSeleccionado === est._id ? nota : ''}
                      onChange={e => {
                        setIdSeleccionado(est._id);
                        setNota(e.target.value);
                      }}
                      style={estilos.input}
                    />
                    <button
                      style={estilos.boton}
                      onClick={agregarNota}
                    >
                      +
                    </button>
                  </div>
                )}
              </td>
              {(usuario?.rol === 'admin' || usuario?.rol === 'profesor') && (
                <td style={estilos.thtd}>
                  <button
                    style={estilos.botonEliminar}
                    onClick={() => eliminarEstudiante(est._id)}
                  >
                    🗑️
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Estudiantes;
