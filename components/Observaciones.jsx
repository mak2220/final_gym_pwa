"use client";

import { useEffect, useState } from "react";

export default function Observaciones({ userId }) {
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchObservaciones = async () => {
      try {
        const res = await fetch(`/api/observaciones?userId=${userId}`);
        if (!res.ok) throw new Error("No se pudo obtener las observaciones");
        const data = await res.json();
        setObservaciones(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchObservaciones();
  }, [userId]);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/observaciones?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ observaciones }),
      });

      if (!res.ok) throw new Error("No se pudo guardar las observaciones");

      alert("Observaciones guardadas con éxito!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Error al guardar observaciones");
    }
  };

  if (loading) return <p>Cargando observaciones...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="mt-6 p-4 border rounded-lg bg-purple-50">
      <h3 className="text-lg font-semibold text-purple-700">Observaciones</h3>

      {isEditing ? (
        <>
          <textarea
            className="w-full h-32 p-2 border rounded-md text-black"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={handleSave}
              className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600"
            >
              Guardar
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
            >
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <div className="flex justify-between items-start">
          <p className="w-full text-gray-700 p-2 border rounded-md bg-purple-100 whitespace-pre-wrap">
            {observaciones || "No hay observaciones."}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Editar
          </button>
        </div>
      )}
    </div>
  );
}
