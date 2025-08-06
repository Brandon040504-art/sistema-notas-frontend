import React, { useEffect, useState } from 'react';
import axios from 'axios';

const estilos = {
  contenedor: {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#fdfdfd',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  titulo: {
    textAlign: 'center',
    marginBottom: '24px',
    color: '#2c3e50',
    fontSize: '28px'
  },
  formulario: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  input: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px'
  },
  boton: {
    padding: '8px 14px',
    backgroundColor: '#3498db',
    border: 'none',
    color: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  botonEliminar: {
    backgroundColor: '#e74c3c',
    border: 'none',
    color: 'white',
    padding: '6px 10px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  tabla: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px'
  },
  thtd: {
    padding: '12px',
    textAlign: 'center',
    borderBottom: '1px solid #ddd'
  },
  notaForm: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
    justifyContent: 'center'
  }
};

function Estudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [matricula, setMatricula] = useState('');
  const [nota, setNota] = useState('');
  const [materia, setMateria] = useState('');
  const [idSeleccionado, setIdSeleccionado] = useState('');

  const obtenerEstudiantes = async () => {
    try {
      const res = await axios.get('https://sistema-notas-backend.onrender.com/api/estudiantes');
      setEstudiantes(res.data);
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
    }
  };

  const agregarEstudiante = async () => {
    if (!nombre || !matricula) return alert('Campos requeridos');
    await axios.post('https://sistema-notas-backend.onrender.com/api/estudiantes', { nombre, matricula });
    setNombre('');
    setMatricula('');
    obtenerEstudiantes();
  };

  const eliminarEstudiante = async (id) => {
    try {
      await axios.delete(`https://sistema-notas-backend.onrender.com/api/estudiantes/${id}`);
      obtenerEstudiantes();
    } catch (err) {
      console.error('Error al eliminar estudiante:', err);
    }
  };

  const agregarNota = async () => {
    if (!nota || !materia || !idSeleccionado) return alert('Completa los campos de nota');
    try {
      await axios.post(`https://sistema-notas-backend.onrender.com/api/estudiantes/${idSeleccionado}/notas`, {
        materia,
        calificacion: parseFloat(nota)
      });
      setNota('');
      setMateria('');
      setIdSeleccionado('');
      obtenerEstudiantes();
    } catch (err) {
      console.error('Error al agregar nota:', err);
    }
  };

  useEffect(() => {
    obtenerEstudiantes();
  }, []);

  return (
    <div style={estilos.contenedor}>
      <h1 style={estilos.titulo}>Sistema de Notas Estudiantiles</h1>

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

      <table style={estilos.tabla}>
        <thead>
          <tr>
            <th style={estilos.thtd}>Nombre</th>
            <th style={estilos.thtd}>Matrícula</th>
            <th style={estilos.thtd}>Notas</th>
            <th style={estilos.thtd}>Eliminar</th>
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

                {/* Formulario para agregar nota */}
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
              </td>
              <td style={estilos.thtd}>
                <button
                  style={estilos.botonEliminar}
                  onClick={() => eliminarEstudiante(est._id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Estudiantes;
