"use client";

import { useEffect, useState } from "react";

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt && "prompt" in deferredPrompt) {
      // @ts-ignore
      deferredPrompt.prompt();
      // @ts-ignore
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsVisible(false);
        setDeferredPrompt(null);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleInstall}
      className="bg-white text-black font-semibold px-2 py-1 rounded-xl hover:bg-[#00df9a] hover:text-black transition duration-300"
    >
      📲 Instalar App
    </button>
  );
};

export default InstallPWA;


