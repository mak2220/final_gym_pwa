"use client"

import React from "react";

const Contacto = () =>{
    const whatsappNumber = '+543456407808'; 
    const message = encodeURIComponent('Hola, estoy interesado en más información sobre GymApp.');

    return(
        <div className="min-h-screen bg-gray-100">
            <header className="bg-gradient-to-b from-green-700/80 to-green-300/50 text-black py-12 text-center">
                <h1 className="text-4xl font-bold">Contacto</h1>
                <p className="mt-2 text-lg">Ponte ya mismo en contacto con nuestro equipo para lograr tus objetivos</p>
            </header>
            <main className="bg-[url('/images/bg-contacto.jpeg')] bg-cover bg-center flex flex-col items-center min-h-screen p-4">
            
                <a
                    href={`https://wa.me/${whatsappNumber}?text=${message}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 px-6 py-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                    Enviar mensaje por WhatsApp
                </a>
            </main>
        </div>
    )
}

export default Contacto;