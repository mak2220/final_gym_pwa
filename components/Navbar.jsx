"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { useRouter } from 'next/router';
import dynamic from "next/dynamic";

// Import dinámico para evitar errores de SSR
const InstallPWA = dynamic(() => import('@/components/InstallPWA'), { ssr: false });

const Navbar = () => {
  const router = useRouter();
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const navItems = [
    { id: 1, text: 'Inicio', route: "/" },
    { id: 2, text: 'Staff', route: "/staff" },
    { id: 3, text: 'Horarios', route: "/horarios" },
    { id: 4, text: 'Rutinas', route: "/rutinas" },
    { id: 5, text: 'Ejemplos', route: "/ejemplos" },
    { id: 6, text: 'Contacto', route: "/contacto" },
    { id: 7, text: 'Administradores', route: "/admin" },
  ];

  if (
    router.pathname === '/dashboard1' ||
    router.pathname === '/admin' ||
    router.pathname.startsWith('/admin/')
  ) {
    return null;
  }

  return (
    <div className='bg-black w-full flex justify-between items-center h-24 px-4 text-white relative z-50'>
      {/* Logo */}
      <h1 className='w-full text-3xl font-bold text-[#00df9a]'>Gym App.</h1>

      {/* Desktop Navigation */}
      <ul className='hidden md:flex items-center'>
        {navItems.map(item => (
          <li key={item.id}>
            <Link
              href={item.route}
              className='p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'
            >
              {item.text}
            </Link>
          </li>
        ))}

        {/* Botón instalar PWA en escritorio */}
        <li className="ml-4">
          <div className="rounded-xl text-white font-semibold hover:bg-[#00df9a] hover:text-black transition duration-300 cursor-pointer">
            <InstallPWA />
          </div>
        </li>
      </ul>

      {/* Mobile Navigation Icon */}
      {!nav && (
        <div onClick={handleNav} className='block md:hidden'>
          <AiOutlineMenu size={20} />
        </div>
      )}

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? 'fixed md:hidden left-0 top-0 w-auto h-auto rounded-b-lg border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500 z-50'
            : 'ease-in-out w-auto duration-500 fixed top-0 bottom-0 left-[-100%]'
        }
      >
        {/* Mobile Logo */}
        <h1 className='w-full text-3xl font-bold text-[#00df9a] m-4'>Gym App</h1>

        {/* Mobile Navigation Items */}
        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 border-b rounded-xl border-gray-600'
          >
            <Link
              href={item.route}
              className={`px-4 py-2 rounded-xl duration-300 cursor-pointer ${
                item.text === 'Administradores'
                  ? 'bg-[#00df9a] text-black font-semibold'
                  : 'hover:bg-[#00df9a] hover:text-black'
              }`}
            >
              {item.text}
            </Link>
          </li>
        ))}

        {/* Botón instalar PWA en móvil */}
        <li className='p-4 flex justify-center'>
          <div className="rounded-xl bg-white text-black font-semibold hover:bg-[#00df9a] hover:text-black transition duration-300">
            <InstallPWA />
          </div>
        </li>

        {/* Botón cerrar menú */}
        <div className="flex justify-center p-4">
          <button onClick={handleNav} aria-label="Cerrar menú">
            <AiOutlineClose size={24} className="text-white hover:text-red-500 transition-colors" />
          </button>
        </div>
      </ul>
    </div>
  );
};

export default Navbar;

