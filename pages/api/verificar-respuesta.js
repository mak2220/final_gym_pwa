import { connectToDatabase } from '../../lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { email, respuestaSeguridad } = req.body;

  if (!email || !respuestaSeguridad) {
    console.log("Error: Faltan el email de usuario o la respuesta de seguridad.");
    return res.status(400).json({ message: 'El email y la respuesta de seguridad son obligatorios' });
  }

  try {
    console.log("Conectando a la base de datos...");
    const db = await connectToDatabase();
    console.log("Conexión exitosa.");

    console.log(`Buscando usuario con email: ${email}`);
    const usuario = await db.collection('usuarios').findOne({ email });

    if (!usuario) {
      console.log("Error: Usuario no encontrado.");
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    console.log("Usuario encontrado. Verificando respuesta de seguridad...");
    const esCorrecta = await bcrypt.compare(respuestaSeguridad, usuario.respuestaSeguridad);

    if (!esCorrecta) {
      console.log("Error: Respuesta de seguridad incorrecta.");
      return res.status(401).json({ message: 'Respuesta incorrecta' });
    }

    console.log("Respuesta de seguridad válida.");
    return res.status(200).json({ message: 'Respuesta válida' });

  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
}
