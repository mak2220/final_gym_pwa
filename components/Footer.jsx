"use client"

import React from 'react';
import Link from "next/link";
import { FaInstagramSquare, FaFacebook, FaGithub } from "react-icons/fa";

const Footer = () => (
    <footer className="bg-white dark:bg-gray-900">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
            <div className="md:flex md:justify-between">
                <div className="mb-6 md:mb-0">
                    <a href="https://flowbite.com/" className="flex items-center">
                        <img src="/images/logo.PNG" className="h-12 w-12 me-3" alt="Gym App Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Gym App</span>
                    </a>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                    <div>
                        <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
                        <ul className="text-gray-500 dark:text-gray-400 font-medium">
                            <li className="mb-4">
                                <a href="https://flowbite.com/" className="hover:underline" target="_blank" rel="noopener noreferrer">Flowbite</a>
                            </li>
                            <li>
                                <a href="https://tailwindcss.com/" className="hover:underline" target="_blank" rel="noopener noreferrer">Tailwind CSS</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-center mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Nuestras Redes</h2>
                        <ul className="flex justify-evenly text-gray-500 dark:text-gray-400 font-medium">
                            <li className="mb-4">
                                <Link href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                                    <FaInstagramSquare size={30}/>
                                </Link>
                            </li>
                            <li>
                                <Link href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                                    <FaFacebook size={30} />
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                        <ul className="text-gray-500 dark:text-gray-400 font-medium">
                            <li>
                                <a href="/terminos_y_condiciones" className="hover:underline">Terms &amp; Conditions</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <div className="sm:flex sm:items-center sm:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024&nbsp;
                    <Link href="https://marcosberta.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Esta aplicación fue desarrollada por mak2220DevOps™ - Proyecto con fines educativos y de divulgación. No apto para uso comercial.
                    </Link>. All Rights Reserved.
                </span>
                <div className="flex mt-4 sm:justify-center sm:mt-0">
                    <Link href="https://www.github.com" target="_blank" rel="noopener noreferrer">
                        <FaGithub size={30} />
                    </Link>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;

