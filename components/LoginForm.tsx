"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput"; 

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("demo@cliente.com");
  const [password, setPassword] = useState("pruebaCliente2");
  const [nombre, setNombre] = useState("Cliente Demo"); 
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState(""); 

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPasswordError("");

    
    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      const success = await login(email, password, nombre);
      if (success) {
        router.push("/dashboard1");
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error: any) {
      setError(error.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-xl">
        <h2 className="text-2xl font-bold text-center text-gray-700">Iniciar Sesión</h2>

        {error && <div className="text-red-500 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Nombre de Usuario</label>
            <input
              type="text"
              className="text-black w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Correo Electrónico</label>
            <input
              type="email"
              className="text-black w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* 👇 Campo de contraseña reutilizable con validación visual */}
          <PasswordInput
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            required
          />

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="text-sm text-center text-gray-600">
          <p>
            ¿Olvidaste tu{" "}
            <Link href="/recuperar" className="text-blue-500 hover:underline">
              usuario o contraseña
            </Link>
            ?
          </p>
          <p>
            ¿No tienes una cuenta?{" "}
            <Link href="/registro" className="text-blue-500 hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
