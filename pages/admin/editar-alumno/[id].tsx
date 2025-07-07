"use client";

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Button } from '@/components/ui/Button';
import AlertModal from '@/components/AlertModal';

// Tipos

type Ejercicio = {
  nombre: string;
  descripcion: string;
  orden?: number; // Nuevo campo
};

type RutinaDia = {
  dia: string;
  ejercicios: Ejercicio[];
};

type Alumno = {
  nombre: string;
  email: string;
  membresia: {
    estado: string;
    fechaExpiracion?: string;
  };
  horario: {
    dias: string;
    hora: string;
  };
  progreso: {
    peso: string;
    imc: string;
  };
  rutina: RutinaDia[];
  observaciones: string;
};

const estadosMembresia = ['Activa', 'Vencida', 'Pendiente', 'Suspendida'];

const EditarAlumno = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [alumno, setAlumno] = useState<Alumno>({
    nombre: '',
    email: '',
    membresia: { estado: '', fechaExpiracion: '' },
    horario: { dias: '', hora: '' },
    progreso: { peso: '', imc: '' },
    rutina: [],
    observaciones: '',
  });

  const [diasActivos, setDiasActivos] = useState<number[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const toggleDiaActivo = (index: number) => {
    setDiasActivos((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rutinaFormateada = alumno.rutina.map((dia) => ({
  dia: dia.dia,
  ejercicios: dia.ejercicios.map((ejercicio) => ({
    nombre: ejercicio.nombre,
    descripcion: ejercicio.descripcion,
    orden: ejercicio.orden ?? 0,
  })),
}));


    const datosParaGuardar = {
      ...alumno,
      rutina: rutinaFormateada,
    };

    try {
      await axios.put(`/api/alumnos/${id}`, datosParaGuardar);
      showAlert('Cambios guardados correctamente');
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      alert('Hubo un error al guardar los cambios.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAlumno((prev) => ({ ...prev, [name]: value }));
  };

  const handleMembresiaChange = (field: keyof Alumno['membresia'], value: string) => {
    setAlumno((prev) => ({ ...prev, membresia: { ...prev.membresia, [field]: value } }));
  };

  const handleHorarioChange = (field: keyof Alumno['horario'], value: string) => {
    setAlumno((prev) => ({ ...prev, horario: { ...prev.horario, [field]: value } }));
  };

  const handleProgresoChange = (field: keyof Alumno['progreso'], value: string) => {
    setAlumno((prev) => ({ ...prev, progreso: { ...prev.progreso, [field]: value } }));
  };

  const handleRutinaDiaChange = (index: number, field: string, value: string) => {
    setAlumno((prev) => {
      const nuevaRutina = [...prev.rutina];
      if (field === 'dia') nuevaRutina[index].dia = value;
      return { ...prev, rutina: nuevaRutina };
    });
  };

  const handleEjercicioChange = (
  diaIndex: number,
  ejercicioIndex: number,
  campo: 'nombre' | 'descripcion' | 'orden',
  valor: string | number
) => {
  setAlumno((prev) => {
    const nuevaRutina = [...prev.rutina];
    const ejercicio = { ...nuevaRutina[diaIndex].ejercicios[ejercicioIndex] };

    if (campo === 'orden') {
      ejercicio.orden = valor as number;
    } else if (campo === 'nombre' || campo === 'descripcion') {
      ejercicio[campo] = valor as string;
    }

    nuevaRutina[diaIndex].ejercicios[ejercicioIndex] = ejercicio;
    return { ...prev, rutina: nuevaRutina };
  });
};



  const agregarEjercicio = (index: number) => {
  setAlumno((prev) => {
    const nuevaRutina = [...prev.rutina];
    const nuevoOrden = nuevaRutina[index].ejercicios.length + 1;
    nuevaRutina[index].ejercicios.push({ nombre: '', descripcion: '', orden: nuevoOrden });
    return { ...prev, rutina: nuevaRutina };
  });
};


  const eliminarEjercicio = (diaIndex: number, ejercicioIndex: number) => {
    setAlumno((prev) => {
      const nuevaRutina = [...prev.rutina];
      nuevaRutina[diaIndex].ejercicios.splice(ejercicioIndex, 1);
      return { ...prev, rutina: nuevaRutina };
    });
  };

  const agregarDia = () => {
    setAlumno((prev) => ({
      ...prev,
      rutina: [...prev.rutina, { dia: '', ejercicios: [] }],
    }));
  };

  const eliminarDia = (index: number) => {
    setAlumno((prev) => {
      const nuevaRutina = [...prev.rutina];
      nuevaRutina.splice(index, 1);
      return { ...prev, rutina: nuevaRutina };
    });
  };

  useEffect(() => {
  if (id) {
    axios.get(`/api/alumnos/${id}`)
      .then((res) => {
        const data = res.data;
        setAlumno({
          ...data,
          membresia: {
            estado: data.membresia?.estado || '',
            fechaExpiracion: data.membresia?.fechaExpiracion?.split('T')[0] || '',
          },
          horario: {
            dias: Array.isArray(data.horario?.dias) ? data.horario.dias.join(', ') : data.horario?.dias || '',
            hora: data.horario?.hora || '',
          },
          progreso: {
            peso: data.progreso?.peso || '',
            imc: data.progreso?.imc || '',
          },
          rutina: Array.isArray(data.rutina)
            ? data.rutina.map((dia: any) => ({
                dia: dia.dia || '',
                ejercicios: Array.isArray(dia.ejercicios)
                  ? dia.ejercicios.map((ej: any, idx: number) => ({
                      nombre: ej.nombre || '',
                      descripcion: ej.descripcion || '',
                      orden: typeof ej.orden === 'number' ? ej.orden : idx + 1,
                    }))
                  : Object.entries(dia)
                      .filter(([key]) => key !== 'dia')
                      .map(([nombre, descripcion], idx) => ({
                        nombre,
                        descripcion,
                        orden: idx + 1,
                      })),
              }))
            : [],
          observaciones: data.observaciones || '',
        });
      })
      .catch((error) => {
        console.error('Error al cargar datos:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
}, [id]);

if (loading) {
  return (
    <div className="flex justify-center items-center h-screen text-xl text-white bg-black">
      Cargando datos del alumno...
    </div>
  );
}


  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Editar Alumno</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block">Nombre</label>
          <input name="nombre" className="text-black w-full p-2 border" value={alumno.nombre} onChange={handleChange} />
        </div>
        <div>
          <label className="block">Email</label>
          <input name="email" className="text-black w-full p-2 border" value={alumno.email} onChange={handleChange} />
        </div>
        <div>
          <label className="block">Estado de Membresía</label>
          <select className="text-black w-full p-2 border" value={alumno.membresia.estado} onChange={(e) => handleMembresiaChange('estado', e.target.value)}>
            {estadosMembresia.map((estado) => (
              <option key={estado}>{estado}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block">Fecha de Expiración</label>
          <input type="date" className="text-black w-full p-2 border" value={alumno.membresia.fechaExpiracion} onChange={(e) => handleMembresiaChange('fechaExpiracion', e.target.value)} />
        </div>
        <div>
          <label className="block">Días y Hora</label>
          <input name="dias" className="text-black w-full p-2 border" value={alumno.horario.dias} onChange={(e) => handleHorarioChange('dias', e.target.value)} />
          <input name="hora" className="text-black w-full p-2 border mt-2" value={alumno.horario.hora} onChange={(e) => handleHorarioChange('hora', e.target.value)} />
        </div>
        <div>
        <label className="block mb-2 font-semibold">Progreso</label>
          <div className="flex items-center space-x-2 mb-2">
            <input
              name="peso"
              className="text-black p-2 border w-40"
              value={alumno.progreso.peso}
              onChange={(e) => handleProgresoChange('peso', e.target.value)}
              placeholder="Peso"
            />
            <span className="whitespace-nowrap">kilogramos</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              name="imc"
              className="text-black p-2 border w-40"
              value={alumno.progreso.imc}
              onChange={(e) => handleProgresoChange('imc', e.target.value)}
              placeholder="IMC"
            />
            <span className="whitespace-nowrap">IMC</span>
          </div>
        </div>
        <div>
          <label className="block">Observaciones</label>
          <textarea name="observaciones" className="text-black w-full p-2 border" value={alumno.observaciones} onChange={handleChange} />
        </div>
        <div className="px-2">
  <label className="block font-semibold text-lg mb-2">Rutina</label>
  {alumno.rutina.map((dia, i) => {
    const isActive = diasActivos.includes(i);
    return (
      <div
        key={i}
        className="mb-4 overflow-hidden transition-all duration-500 ease-in-out border rounded"
      >
        <div
          className="flex justify-between items-center bg-blue-600 hover:bg-blue-700 px-3 py-2 cursor-pointer"
          onClick={() => toggleDiaActivo(i)}
        >
          <span className="font-semibold text-white text-sm sm:text-base">
            {dia.dia || `Día ${i + 1}`}
          </span>
          <span className="text-xl text-white">{isActive ? '−' : '+'}</span>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden bg-white`}
          style={{
            maxHeight: isActive ? '1000px' : '0',
            padding: isActive ? '16px' : '0 16px',
            opacity: isActive ? 1 : 0,
          }}
        >
          {dia.ejercicios.map((ejercicio, j) => (
            <div
              key={j}
              className="flex flex-col sm:flex-row items-center gap-2 mb-3"
            >
              <input
                type="number"
                className="text-black p-2 border w-full sm:w-[60px] text-center text-sm"
                value={
                  typeof ejercicio.orden === 'number' ? ejercicio.orden : j + 1
                }
                onChange={(e) => {
                  const newValue = parseInt(e.target.value, 10);
                  if (!isNaN(newValue)) {
                    handleEjercicioChange(i, j, 'orden', newValue);
                  }
                }}
                placeholder="#"
              />

              <input
                className="text-black p-2 border w-full sm:w-1/3 text-center text-sm"
                value={ejercicio.nombre}
                onChange={(e) =>
                  handleEjercicioChange(i, j, 'nombre', e.target.value)
                }
                placeholder="Nombre del ejercicio"
              />

              <input
                className="text-black p-2 border w-full sm:flex-1 text-center text-sm"
                value={ejercicio.descripcion}
                onChange={(e) =>
                  handleEjercicioChange(i, j, 'descripcion', e.target.value)
                }
                placeholder="Repeticiones (ej: 4x10)"
              />

              <div className="relative group">
                <Button
                  type="button"
                  onClick={() => eliminarEjercicio(i, j)}
                  className="bg-red-600 hover:bg-red-700 w-[30px] h-[30px] text-white p-0"
                >
                  ×
                </Button>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Eliminar ejercicio
                </span>
              </div>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
            <Button
              type="button"
              onClick={() => agregarEjercicio(i)}
              className="w-full sm:w-1/2 text-sm"
            >
              + Añadir ejercicio
            </Button>
            <Button
              type="button"
              onClick={() => eliminarDia(i)}
              className="w-full sm:w-1/2 bg-red-500 hover:bg-red-600 text-white text-sm"
            >
              Eliminar día
            </Button>
          </div>
        </div>
      </div>
    );
  })}
  <Button
    type="button"
    onClick={agregarDia}
    className="mt-4 bg-green-600 hover:bg-green-700 text-white w-full text-sm"
  >
    + Añadir día
  </Button>
</div>

        <Button type="submit">Guardar Cambios y Retornar Menu General</Button>
      </form>
      {alertVisible && (
        <AlertModal
          title="Cambios guardados"
          message="Los datos del alumno fueron actualizados correctamente."
          onClose={() => {
            setAlertVisible(false);
            router.push('/admin'); 
          }}
        />
      )}
    </div>
  );
};


export default EditarAlumno;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = await clientPromise;
  const db = client.db('app_gym');
  const { id } = context.params!;

  const alumno = await db.collection('usuarios').findOne({
    _id: new ObjectId(id as string),
  });

  if (!alumno) return { notFound: true };

  return {
    props: {
      alumnoInicial: JSON.parse(JSON.stringify(alumno)),
    },
  };
};