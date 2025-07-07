"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";
import axios from "axios";

// Definimos el tipo del contexto
interface AuthContextType {
  user: { nombre: string; email: string } | null;
  login: (email: string, password: string, nombre: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ nombre: string; email: string } | null>(null);
  const router = useRouter();

  // Login con validación del usuario
  const login = async (email: string, password: string, nombre: string): Promise<boolean> => {
    try {
      const response = await axios.post("/api/login", { email, password, nombre }, { withCredentials: true });
      
      if (response.data.user) {
        console.log("Usuario autenticado:", response.data.user);
        // Guardamos tanto el nombre como el email en el estado del usuario
        setUser({ nombre: response.data.user.nombre, email: response.data.user.email });
        return true; // Si el login fue exitoso
      } else {
        console.error("No se recibió un usuario en la respuesta");
        return false; // Si no se recibe el usuario
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return false; // Si ocurre algún error
    }
  };

  // Logout para borrar el estado del usuario
  const logout = () => {
    setUser(null);
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // Borra la cookie
    router.push("/login"); // Redirige al login después del cierre de sesión
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

// Hook para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
