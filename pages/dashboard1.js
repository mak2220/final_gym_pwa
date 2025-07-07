"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Observaciones from "@/components/Observaciones";
import { Button } from "@/components/ui/Button";
import AlertModal from "@/components/AlertModal";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);
  const [showAlert, setShowAlert] = useState(true);
  const [alertContent, setAlertContent] = useState({ title: "", message: "" });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/user?email=${user.email}`);
        if (!res.ok) throw new Error("Error al obtener datos");
        const data = await res.json();
        setUserData(data);

        const faltanDatos =
          !data.nombre ||
          !data.membresia ||
          !data.horario ||
          !data.progreso ||
          !Array.isArray(data.rutina);

        if (faltanDatos) {
          setAlertContent({
            title: "¡Hola!",
            message:
              "Tu perfil está en proceso. Estamos preparando tu información personalizada.",
          });
        } else {
          setAlertContent({
            title: "¡Bienvenido!",
            message:
              "Aquí tus alumnos verán las rutinas que preparaste para ell@s. Si quieres las puedes modificar desde la página de inicio, en la barra de tareas haciendo click en 'Administración'. Incluso pudes mostrar videos de como realizar los ejercicios. Para salir solo haz click en 'Cerrar Sesión' al final de la página.",
          });
        }
      } catch (error) {
        console.error(error);
        setAlertContent({
          title: "Error",
          message: "No se pudo obtener tu información. Por favor, reintenta.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, router]);

  if (!user) return null;
  if (loading) return <p className="text-center mt-10 text-lg">Cargando datos...</p>;

  const datosCompletos =
    userData &&
    userData.nombre &&
    userData.membresia &&
    userData.horario &&
    userData.progreso &&
    Array.isArray(userData.rutina);

  if (!datosCompletos) {
    return (
      <>
        {showAlert && alertContent.message && (
          <AlertModal
            title={alertContent.title}
            message={alertContent.message}
            onClose={() => setShowAlert(false)}
          />
        )}

        <div className="flex flex-col items-center mt-20 mb-20 text-center space-y-16">
          <div className="text-6xl">🏋️‍♀️</div>
          <p className="text-xl font-semibold text-red-500">
            ¡Ups! No se encontraron datos del usuario.
          </p>
          <p className="text-gray-600">
            Estamos preparando tu rutina para que optimices tu entrenamiento
          </p>
          <Button
            onClick={() => router.push("/")}
            className="w-3/4 md:w-1/2 px-4 py-2 text-white text-center bg-blue-500 rounded-lg hover:bg-blue-600 mx-auto"
          >
            Ir al inicio
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      {showAlert && alertContent.message && (
        <AlertModal
          title={alertContent.title}
          message={alertContent.message}
          onClose={() => setShowAlert(false)}
        />
      )}

      <div className="bg-gray-100 p-6">
        <nav>
          <div className="bg-black w-full flex flex-col md:flex-row justify-between items-center h-auto md:h-24 px-4 text-white space-y-4 md:space-y-0">
            <h1 className="w-full text-3xl font-bold text-[#00df9a] text-center md:text-left">Gym App.</h1>
            <h2 className="text-2xl font-semibold text-white-800 text-center md:text-left">
              Bienvenid@, {userData?.nombre?.charAt(0).toUpperCase() + userData?.nombre?.slice(1)} 👋
            </h2>
            <p className="text-center md:text-left">Aquí tienes tu información personalizada.</p>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          {/* Membresía */}
          <div className="mt-6 p-4 border rounded-lg bg-blue-50">
            <h3 className="text-lg font-semibold text-blue-700">Membresía</h3>
            <p className="text-gray-600">Estado: {userData?.membresia?.estado}</p>
            <p className="text-gray-600">Válida hasta: {userData?.membresia?.fechaExpiracion}</p>
          </div>

          {/* Horario */}
          <div className="mt-6 p-4 border rounded-lg bg-green-50">
            <h3 className="text-lg font-semibold text-green-700">Horario</h3>
            <p className="text-gray-600">Días: {userData?.horario?.dias}</p>
            <p className="text-gray-600">Hora: {userData?.horario?.hora}</p>
          </div>

          {/* Progreso */}
          <div className="mt-6 p-4 border rounded-lg bg-yellow-50">
            <h3 className="text-lg font-semibold text-yellow-700">Progreso</h3>
            <p className="text-gray-600">Peso: {userData?.progreso?.peso} kg</p>
            <p className="text-gray-600">IMC: {userData?.progreso?.imc}</p>
          </div>

          {/* Rutina */}
          <div className="mt-6 p-4 border rounded-lg bg-red-50">
            <h3 className="text-lg font-semibold text-red-700">Rutina</h3>
            <ul className="text-gray-600">
              {userData.rutina.map((dia, index) => (
                <li key={index} className="mb-2 border-b border-gray-300">
                  <button
                    className="w-full text-left py-2 px-4 bg-red-100 hover:bg-red-200 rounded-md transition flex justify-between items-center"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    {`Día ${index + 1}`}
                    <span>{openIndex === index ? "▲" : "▼"}</span>
                  </button>
                  {openIndex === index &&
                    Array.isArray(dia.ejercicios) &&
                    dia.ejercicios
                      .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
                      .map((ejercicio, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-md font-semibold text-blue-600">
                              #{ejercicio.orden ?? idx + 1} — {ejercicio.nombre}
                            </h4>
                          </div>
                          <p className="mt-2 text-gray-700 text-sm">
                            <strong>Repeticiones:</strong> {ejercicio.descripcion}
                          </p>
                        </div>
                      ))}
                </li>
              ))}
            </ul>
          </div>
          {/* Ejemplos de Ejercicios */}
          <div className="mt-6 p-4 border rounded-lg bg-purple-50">
            <h3 className="text-lg font-semibold text-purple-700">Ejemplos de Ejercicios</h3>

            {Array.isArray(userData.ejemplos) && userData.ejemplos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {userData.ejemplos.map((video, idx) => (
                  <div key={idx} className="aspect-video">
                    <iframe
                      src={video.src}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded border"
                    ></iframe>
                    <p className="text-sm text-center mt-1 text-gray-700">{video.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">No hay videos cargados aún.</p>
            )}
          </div>


          {/* Observaciones */}
          <Observaciones userId={userData.email} />

          {/* Logout */}
          <button
            onClick={logout}
            className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
}
