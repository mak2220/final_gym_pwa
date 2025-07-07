import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { email } = req.query; // Recibe el email como parámetro
  if (!email) {
    return res.status(400).json({ message: "Email requerido" });
  }

  try {
    const db = await connectToDatabase();
    const usuario = await db.collection("usuarios").findOne(
      { email },
      { projection: { password: 0 } } // Excluye la contraseña
    );

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 🔹 Convertir `rutina` a array si es un string
    if (usuario.rutina && typeof usuario.rutina === "string") {
      try {
        usuario.rutina = JSON.parse(usuario.rutina);
      } catch (error) {
        console.error("Error al convertir rutina:", error);
        usuario.rutina = [];
      }
    }

    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
}

