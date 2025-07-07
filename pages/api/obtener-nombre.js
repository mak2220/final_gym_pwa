// /pages/api/obtener-nombre.js
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'El email es obligatorio' });
  }

  try {
    const db = await connectToDatabase();
    const usuario = await db.collection('usuarios').findOne({ email });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ nombre: usuario.nombre }); // Esto se mostrará en la UI
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
