"use client";

import clientPromise from "../../lib/mongodb";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/Button';
import AlertModal from '@/components/AlertModal';

interface Alumno {
  _id: string;
  nombre: string;
  email: string;
  membresia: string | {
    estado: string;
    fechaExpiracion?: string;
  };
}

function formatearFecha(fechaStr?: string): string {
  if (!fechaStr) return 'sin fecha';
  try {
    const fecha = new Date(fechaStr);
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(fecha);
  } catch (e) {
    return 'fecha inválida';
  }
}

export default function AdminPanel({ alumnos }: { alumnos: Alumno[] }) {
  
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [mostrarAlertaInicial, setMostrarAlertaInicial] = useState(true);
  const [alumnoIdSeleccionado, setAlumnoIdSeleccionado] = useState<string | null>(null);
  const eliminarAlumno = async () => {
  
    if (!alumnoIdSeleccionado) return;

    try {
      await fetch(`/api/alumnos/${alumnoIdSeleccionado}`, {
        method: 'DELETE',
    });

    setShowModal(false);
    setAlumnoIdSeleccionado(null);
    router.replace(router.asPath); // Refresca la lista
  } catch (error) {
    console.error('Error al eliminar alumno:', error);
    alert('No se pudo eliminar el alumno. Intenta de nuevo.');
  }
};

const confirmarEliminacion = (id: string) => {
  setAlumnoIdSeleccionado(id);
  setShowModal(true);
};

  return (
  <div className="max-w-5xl mx-auto mb-10 p-4">
    {/* ✅ MODAL DE ADVERTENCIA AL INGRESAR */}
      {mostrarAlertaInicial && (
        <AlertModal
          title="Acceso restringido"
          message="Esta sección está reservada para administradores, la cual estara protegida por contraseña de acceso."
          onClose={() => setMostrarAlertaInicial(false)}
        />
      )}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-center mt-10">Panel de Administración - Alumnos</h1>
      
    </div>

    <div className="hidden sm:block overflow-x-auto">
      <table className="min-w-full border text-sm md:text-base">
        <thead className="bg-gradient-to-b from-green-700/80 to-green-300/50">
          <tr>
            <th className="border px-4 py-2 text-left">Nombre</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Membresía</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((alumno) => {
            const estado = typeof alumno.membresia === 'object' ? alumno.membresia.estado : alumno.membresia;

            const color =
              estado === 'activa'
                ? 'bg-green-200 text-green-800'
                : estado === 'vencida'
                ? 'bg-red-200 text-red-800'
                : 'bg-yellow-200 text-yellow-800';

            const textoMembresia = typeof alumno.membresia === 'object'
              ? `${alumno.membresia.estado} (${formatearFecha(alumno.membresia.fechaExpiracion)})`
              : alumno.membresia;

            return (
              <tr key={alumno._id} className="hover:bg-gray-50 hover:text-black">
                <td className="border px-4 py-2">{alumno.nombre}</td>
                <td className="border px-4 py-2">{alumno.email}</td>
                <td className={`border px-4 py-2 text-center font-semibold ${color}`}>
                  {textoMembresia}
                </td>
                <td className="border px-4 py-2">
                  <div className="flex justify-center items-center gap-2">
                    <Link href={`/admin/editar-alumno/${alumno._id}`}>
                      <Button>Editar</Button>
                    </Link>
                    <Button
                      onClick={() => confirmarEliminacion(alumno._id)}
                      className="bg-red-600 hover:bg-red-700 text-white w-auto"
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
          {alumnos.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4">
                No hay alumnos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
      {/* TARJETAS - visible solo en mobile */}
      <div className="block sm:hidden space-y-4 mt-6">
        {alumnos.map((alumno) => {
          const estado = typeof alumno.membresia === 'object' ? alumno.membresia.estado : alumno.membresia;
          const color =
            estado === 'activa'
              ? 'bg-green-200 text-green-800'
              : estado === 'vencida'
              ? 'bg-red-200 text-red-800'
              : 'bg-yellow-200 text-yellow-800';
          const textoMembresia = typeof alumno.membresia === 'object'
            ? `${alumno.membresia.estado} (${formatearFecha(alumno.membresia.fechaExpiracion)})`
            : alumno.membresia;

          return (
            <div key={alumno._id} className="bg-white rounded-lg shadow p-4 border">
              <p className="text-sm text-black"><span className="font-semibold text-black">Nombre:</span> {alumno.nombre}</p>
              <p className="text-sm text-black"><span className="font-semibold text-black">Email:</span> {alumno.email}</p>
              <p className={`text-sm font-semibold inline-block px-2 py-1 mt-2 rounded ${color}`}>
                {textoMembresia}
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <Link href={`/admin/editar-alumno/${alumno._id}`}>
                  <Button>Editar</Button>
                </Link>
                <Button
                  onClick={() => confirmarEliminacion(alumno._id)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          );
        })}
      </div>

    
    <Button
        onClick={() => window.location.href = '/'}
        className="bg-gray-600 hover:bg-gray-700 text-white mt-6"
      >
        Cerrar sesión
      </Button>
      {showModal && (
        <AlertModal
          title="Confirmar eliminación"
          message="¿Estás seguro de que deseas eliminar al alumno?"
          onClose={() => {
            setShowModal(false);
            setAlumnoIdSeleccionado(null);
          }}
          onConfirm={eliminarAlumno} // 👉 se activan 2 botones
        />
      )}
    </div>
    
);

}

export async function getServerSideProps() {
  const client = await clientPromise;
  const db = client.db('app_gym');

  const alumnosRaw = await db.collection('usuarios').find({}).toArray();

  const alumnos = alumnosRaw.map((alumno) => {
    let membresia: Alumno["membresia"];

    if (alumno.membresia && typeof alumno.membresia === 'object') {
      membresia = {
        estado: alumno.membresia.estado || 'sin datos',
        fechaExpiracion: alumno.membresia.fechaExpiracion || null,
      };
    } else {
      membresia = alumno.membresia || 'sin datos';
    }

    return {
      _id: alumno._id.toString(),
      nombre: alumno.nombre || '',
      email: alumno.email || '',
      membresia,
    };
  });

  return {
    props: { alumnos },
  };
}
