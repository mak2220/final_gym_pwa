import React, { useEffect, useState } from "react";

interface AlertModalProps {
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void; // opcional
}

export default function AlertModal({ title, message, onClose, onConfirm }: AlertModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleConfirm = () => {
    setVisible(false);
    setTimeout(() => {
      if (onConfirm) onConfirm();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl p-6 max-w-md w-full text-center transform transition-all duration-300 ${
          visible ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>

        {/* ✅ Mostrar uno o dos botones según el caso */}
        {onConfirm ? (
          <div className="flex justify-center gap-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Confirmar
            </button>
          </div>
        ) : (
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Aceptar
          </button>
        )}
      </div>
    </div>
  );
}
