'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PasswordInput from '@/components/PasswordInput'; // Asegurate que la ruta sea correcta

export default function RestablecerContrasena() {
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [usuarioEmail, setUsuarioEmail] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const router = useRouter();

  useEffect(() => {
    const emailGuardado = localStorage.getItem('usuarioParaReset');
    if (!emailGuardado) {
      router.push('/recuperar');
    } else {
      setUsuarioEmail(emailGuardado);
      // Obtener el nombre asociado
      fetch('/api/obtener-nombre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailGuardado }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.nombre) setNombreUsuario(data.nombre);
        });
    }
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  if (nuevaPassword.length < 6) {
    setError('La contraseña debe tener al menos 6 caracteres');
    return;
  }

  if (nuevaPassword !== confirmarPassword) {
    setError('Las contraseñas no coinciden');
    return;
  }

  try {
    const res = await fetch('/api/restablecer-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: usuarioEmail, nuevaPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      setSuccess('Contraseña actualizada correctamente');
      localStorage.removeItem('usuarioParaReset');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      setError(data.mensaje || 'Error al actualizar la contraseña');
    }
  } catch (err) {
    setError('Error al conectar con el servidor');
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-xl">
        <h2 className="text-2xl font-bold text-center mb-4">Restablecer Contraseña</h2>

        {nombreUsuario && (
          <p className="mb-4 text-center text-gray-700">
            Cambiando contraseña para: <strong>{nombreUsuario}</strong>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordInput
            label="Nueva Contraseña"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
          />
          <PasswordInput
            label="Confirmar Contraseña"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            error={error && nuevaPassword !== confirmarPassword ? error : undefined}
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Actualizar Contraseña
          </button>
        </form>

        {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="mt-4 text-green-500 text-sm text-center">{success}</p>}
      </div>
    </div>
  );
}
