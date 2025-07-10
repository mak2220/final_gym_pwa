"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react"; // Opcional, ícono (usa Lucide o cualquier otro)

const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };

    window.addEventListener("beforeinstallprompt", handler as EventListener);

    return () => {
        window.removeEventListener("beforeinstallprompt", handler as EventListener);
    };
}, []);

const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    const promptEvent = deferredPrompt as any;
    promptEvent.prompt();

    const { outcome } = await promptEvent.userChoice;
    if (outcome === "accepted") {
        console.log("✅ PWA instalada");
        } else {
            console.log("❌ Instalación cancelada");
        }
        setDeferredPrompt(null);
        setIsVisible(false);
    };
    if (!isVisible) return null;
    return (
    <div className="fixed bottom-6 right-6 z-50 bg-white border border-gray-300 rounded-2xl shadow-xl px-4 py-3 flex items-center space-x-3 animate-fade-in">
        <Download className="w-5 h-5 text-green-600" />
        <span className="text-sm text-gray-800">¿Querés instalar la app?</span>
        <button
            onClick={handleInstallClick}
            className="bg-green-600 text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-green-700 transition"
        >
        Instalar
        </button>
    </div>
    );
};

export default InstallPWA;
