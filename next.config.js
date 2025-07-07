/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',        // Dónde se generará el service worker
  register: true,        // Registra automáticamente el service worker
  skipWaiting: true,     // Toma control sin esperar que el usuario cierre otras pestañas
});

const nextConfig = {
  reactStrictMode: true, // Puedes agregar aquí otras configuraciones en el futuro
};

module.exports = withPWA(nextConfig);

