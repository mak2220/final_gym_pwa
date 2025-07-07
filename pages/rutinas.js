"use client";

import { useState } from "react";
import clientPromise from "../lib/mongodb";

export default function Rutinas({ rutinas }) {
    return (
    <div className="min-h-screen bg-gray-100">
            <header className="bg-gradient-to-b from-green-700/80 to-green-300/50 text-black py-12 text-center">
                <h1 className="text-4xl font-bold">Conoce a Nuestras Rutinas Especializadas</h1>
                <p className="mt-2 text-lg">
                    Estos son algunos de los ejercicios que podrás realizar, todos adaptados de forma personalizada
                </p>
            </header>
            <main className="relative z-10 py-12 px-6 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {rutinas.map((rutina) => (
                <RutinaCard key={rutina._id} rutina={rutina} />
                ))}
            </main>
            <div className="text-center">
                    <h2 className="text-black text-4xl font-bold">Notas</h2>
                        <p className="text-gray-600 mt-4"><strong>RIR (Repeticiones en Reserva):</strong> Ajusta el peso para que las repeticiones marcadas sean desafiantes pero te dejen la cantidad indicada de repeticiones en reserva.
                        </p>
                        <p  className="text-gray-600 mt-4"><strong>Supersets:</strong> Realiza los ejercicios indicados consecutivamente sin descanso entre ellos; descansa 60-90 segundos después de cada superset.
                        </p>
                        <p  className="text-gray-600 mt-4"><strong>Cardio:</strong> Prioriza la intensidad moderada/alta para mantener un ritmo constante y mejorar la capacidad cardiovascular
                        </p>
            </div>
        </div>
    );
}

function RutinaCard({ rutina }) {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible((prev) => !prev);
    return (
        <div className="rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="p-6">
            <h2 className="text-center text-xl font-bold text-gray-800">{rutina.name}</h2>
            <p className="mt-2 text-gray-700 font-semibold">Entrenador: {rutina.coach}</p>
            <p className="mt-2 text-gray-700 font-semibold">Duración: {rutina.duration}</p>
            <p
                className="mt-2 text-gray-700 font-semibold cursor-pointer hover:text-gray-800"
                onClick={toggleVisibility}
            >
            Descripción: {isVisible ? "(-)" : "(+)"}
            </p>
            {isVisible && (
            <div>
                {Object.entries(rutina.description).map(([day, details]) => (
                    <div key={day} className="mt-4">
                    <h3 className="font-semibold text-gray-800">
                    {day.replace("_", " ").toUpperCase()}
                    </h3>
                    <p className="text-gray-600">Grupo: {details.group}</p>
                    <ul className="list-disc pl-5">
                    {Object.entries(details)
                    .filter(([key]) => key.startsWith("ex_"))
                    .map(([key, exercise]) => (
                        <li key={key} className="text-gray-600">
                        <strong>{exercise.title}:</strong> {exercise.serie}{" "}
                        {exercise.RIR ? `(RIR: ${exercise.RIR})` : ""}
                        </li>
                    ))}
                </ul>
            </div>
            ))}
            </div>
            )}
        </div>
    </div>
    );
}
export async function getServerSideProps() {
    try {
        const client = await clientPromise;
        const db = client.db("app_gym");

        const rutinas = await db
            .collection("rutinas")
            .find({})
            .sort({ _id: 1 })
            .limit(20)
            .toArray();

        return {
            props: { rutinas: JSON.parse(JSON.stringify(rutinas)) },
            
        };
    } catch (e) {
        console.error(e);
    }
}

