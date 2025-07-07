"use client";

import { useState } from 'react';
import { useRouter } from 'next/router';

export default function RecuperarContrasena() {
  const [email, setEmail] = useState('');
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [fase, setFase] = useState(1); // 1: ingresar email, 2: responder pregunta
  const [error, setError] = useState('');
  const router = useRouter();

  const obtenerPregunta = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/recuperar-pregunta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setPregunta(data.preguntaSeguridad);
        setFase(2);
      } else {
        setError(data.mensaje);
      }
    } catch (err) {
      setError('Error al conectarse al servidor');
    }
  };

  const verificarRespuesta = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/verificar-respuesta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, respuestaSeguridad: respuesta }),
      });
      const data = await res.json();
      if (res.ok) {
        // Guardamos el email temporalmente en localStorage para el siguiente paso
        localStorage.setItem('usuarioParaReset', email);
        router.push('/restablecer');
      } else {
        setError(data.mensaje);
      }
    } catch (err) {
      setError('Error al verificar respuesta');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-fluor via-emerald-500 to-black text-black flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Recuperar Contraseña</h2>
        
        {fase === 1 && (
          <form onSubmit={obtenerPregunta} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Correo electrónico</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Buscar pregunta
            </button>
          </form>
        )}

        {fase === 2 && (
          <form onSubmit={verificarRespuesta} className="space-y-4">
            <p className="font-medium text-gray-700">{pregunta}</p>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              placeholder="Tu respuesta"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Verificar respuesta
            </button>
          </form>
        )}

        {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
}

