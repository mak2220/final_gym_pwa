"use client";

import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Registro() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    preguntaSeguridad: '',
    respuestaSeguridad: ''
  });

  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Limpiar el error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/login');
      } else if (res.status === 409) {
        const data = await res.json();
        setError(data.message); // Mensaje específico desde el backend
      } else {
        setError('Ocurrió un error al registrar el usuario.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-xl">
        <h2 className="text-2xl font-bold text-center text-gray-700">Registro</h2>

        {error && (
          <div className="p-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600">Nombre</label>
            <input 
              type="text" 
              name="nombre"
              className="w-full px-4 py-2 mt-1 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Tu nombre" 
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Correo Electrónico</label>
            <input 
              type="email" 
              name="email"
              className="w-full px-4 py-2 mt-1 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="tuemail@example.com" 
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Contraseña</label>
            <input 
              type="password" 
              name="password"
              className="w-full px-4 py-2 mt-1 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="********" 
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Pregunta de seguridad</label>
            <input
              type="text"
              name="preguntaSeguridad"
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ej: ¿Cuál es el nombre de tu primer mascota?"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Respuesta</label>
            <input
              type="text"
              name="respuestaSeguridad"
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ingresa tu respuesta"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
