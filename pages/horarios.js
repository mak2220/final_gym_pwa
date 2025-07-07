"use client"

import clientPromise from "../lib/mongodb";

export default function Horarios ({horarios}){
    return(
        <div className="min-h-screen bg-gray-100">
            <header className="bg-gradient-to-b from-green-700/80 to-green-300/50 text-black py-12 text-center">
                <h1 className="text-4xl font-bold">Horarios</h1>
                <p className="mt-2 text-lg">
                    Elige el que mejor se adapta a tu día
                </p>
            </header>
            <main>
                {horarios.map((horario)=>(
                    <div 
                        key={horario._id} 
                        className="overflow-x-auto sm:overflow-x-scroll"
                    >
                    <table className="table-auto border-collapse border w-full text-sm md:text-lg text-black bg-white">
                        <thead>
                            <tr className="text-center">
                                <th className="px-4 py-2 text-center break-words">Tipo</th>
                                <th className="px-4 py-2 text-center break-words">Días</th>
                                <th className="px-4 py-2 text-center break-words">Horas</th>
                                <th className="px-4 py-2 text-center break-words">Profesor</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-gray-100">
                                <td className="px-4 py-2 text-center break-words">{horario.entrenamiento[0]}</td>
                                <td className="px-4 py-2 text-center break-words">{horario.dias[0]}</td>
                                <td className="px-4 py-2 text-left break-words">{horario.horas[0]} y de {horario.horas[3]}</td>
                                <td className="px-4 py-2 text-center break-words">{horario.profesor[3]}</td>
                            </tr>
                            <tr className="hover:bg-gray-100">
                                <td className="px-4 py-2 text-center break-words">{horario.entrenamiento[1]}</td>
                                <td className="px-4 py-2 text-center break-words">{horario.dias[2]}</td>
                                <td className="px-4 py-2 text-left break-words">{horario.horas[1]}</td>
                                <td className="px-4 py-2 text-center break-words">{horario.profesor[0]}</td>
                            </tr>
                            <tr className="hover:bg-gray-100">
                                <td className="px-4 py-2 text-center break-words">{horario.entrenamiento[2]}</td>
                                <td className="px-4 py-2 text-center break-words">{horario.dias[1]}</td>
                                <td className="px-4 py-2 text-left break-words">{horario.horas[2]}</td>
                                <td className="px-4 py-2 text-center break-words">{horario.profesor[1]}</td>
                            </tr>
                            <tr className="hover:bg-gray-100">
                                <td className="px-4 py-2 text-center break-words">{horario.entrenamiento[3]}</td>
                                <td className="px-4 py-2 text-center break-words">{horario.dias[1]}</td>
                                <td className="px-4 py-2 text-left break-words">{horario.horas[0]}</td>
                                <td className="px-4 py-2 text-center break-words">{horario.profesor[2]}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                ))}
                
            </main>
        </div>
    )
}

export async function getServerSideProps() {
    try {
        const client = await clientPromise;
        const db = client.db("app_gym");

        const horarios = await db
            .collection("horarios")
            .find({})
            .sort({ _id: 1 })
            .limit(20)
            .toArray();

        return {
            props: { horarios: JSON.parse(JSON.stringify(horarios)) },
            
        };
    } catch (e) {
        console.error(e);
    }
}
