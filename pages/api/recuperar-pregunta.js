import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { email } = req.body;

  if (!email) {
    console.log("Error: Falta el email.");
    return res.status(400).json({ message: 'El email es obligatorio' });
  }

  try {
    console.log("Conectando a la base de datos...");
    const db = await connectToDatabase();
    console.log("Conexión exitosa a MongoDB");

    console.log(`Buscando usuario con email: ${email}`);
    const usuario = await db.collection('usuarios').findOne({ email });

    if (!usuario) {
      console.log("Error: Usuario no encontrado.");
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    console.log("Usuario encontrado. Pregunta de seguridad:", usuario.preguntaSeguridad);

    return res.status(200).json({ preguntaSeguridad: usuario.preguntaSeguridad });

  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
}
