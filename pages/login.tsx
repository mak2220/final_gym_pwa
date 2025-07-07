"use client"

import { useEffect, useState } from "react";
import LoginForm from "@/components/LoginForm";
import AlertModal from "@/components/AlertModal";

export default function LoginPage() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
      setShowModal(true); // Mostrar el modal siempre al cargar
    }, []);
  
    const handleCloseModal = () => {
      setShowModal(false);
    };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-600/50 to-green-100/50">
      {showModal && (
              <AlertModal
                title="¡Bienvenido a Gym App!"
                message="En esta sección los alumnos podran ingresar a su cuenta única para ver las rutinas que el profes@r establecio. Para esta prueba solo debes hacer clic en `Iniciar Sesión`"
                onClose={handleCloseModal}
              />
            )}
      <LoginForm/>
    </div>
  );
}
