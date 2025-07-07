"use client"

import clientPromise from "../lib/mongodb";

export default function Ejemplos ({ejemplos}){
    return(
        <div className="min-h-screen bg-gray-100">
            <header className="bg-gradient-to-b from-green-700/80 to-green-300/50 text-black py-12 text-center">
                <h1 className="text-4xl font-bold">Ejemplos de Ejercicios</h1>
                <p className="mt-2 text-lg">
                    Estos son algunos de los ejercicios que te enseñaremos a realizar
                </p>
            </header>
            <main>
                <ul className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                {ejemplos.map((ejemplo)=>(
                    <li 
                        key={ejemplo._id}
                        className="w-full max-w-4xl"
                    >
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">{ejemplo.ejercise}</h1>
                        <iframe
                            src={ejemplo.src}
                            className="w-full h-96 rounded-lg shadow-lg border border-gray-300"
                            allowFullScreen
                            title={ejemplo.ejercise}
                            sandbox="allow-scripts allow-same-origin allow-presentation"
                            >
                        </iframe>
                    </li>
                ))}
                </ul>
            </main>
        </div>
    )
}

export async function getServerSideProps() {
    try {
        const client = await clientPromise;
        const db = client.db("app_gym");

        const ejemplos = await db
            .collection("ejemplos")
            .find({})
            .sort({ _id: 1 })
            .limit(20)
            .toArray();

        return {
            props: { ejemplos: JSON.parse(JSON.stringify(ejemplos)) },
            
        };
    } catch (e) {
        console.error(e);
    }
}
//<iframe width="789" height="444" src="https://www.youtube.com/embed/WwHuwfuK2qM" title="Peso Muerto con Barra con PowerExplosive - HSN Guía Ejercicios" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>