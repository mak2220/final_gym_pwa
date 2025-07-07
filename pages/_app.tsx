import "@/styles/globals.css";
import "@/styles/normalize.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Head>
          <meta charSet="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Gym App - Tu plataforma para entrenamientos personalizados, rutinas y progreso físico." />
          <meta name="keywords" content="gym, fitness, entrenamientos, rutinas, salud, deporte" />
          <meta name="author" content="mak2220DevOps" />
          <meta property="og:title" content="Gym App" />
          <meta property="og:description" content="Entrenamientos y rutinas personalizadas para todos los niveles." />
          <meta property="og:url" content="https://final-gym-app.vercel.app/" />
          <meta property="og:type" content="website" />
          <title>Gym App</title>
        </Head>

        <Navbar />

        <main className="flex-grow">
          <Component {...pageProps} />
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}
