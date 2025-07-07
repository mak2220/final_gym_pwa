'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string; // Mensaje de error
}

export default function PasswordInput({
    label = 'Contraseña',
    error,
    className = '',
    ...rest
}: PasswordInputProps) {
    const [visible, setVisible] = useState(false);  
    const baseStyle =
        'w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 text-black pr-10';
    const errorStyle = error
        ? 'border-red-500 focus:ring-red-400'
        : 'border-gray-300 focus:ring-blue-400';

return (
    <div>
        {label && <label className="block text-sm font-medium text-gray-600">{label}</label>}
        <div className="relative">
            <input
                type={visible ? 'text' : 'password'}
                className={`${baseStyle} ${errorStyle} ${className}`}
                {...rest}
            />
            <button
                type="button"
                onClick={() => setVisible(!visible)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
            {visible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
);
}
