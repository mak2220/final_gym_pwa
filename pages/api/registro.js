import { connectToDatabase } from '../../lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { nombre, email, password, preguntaSeguridad, respuestaSeguridad } = req.body;

  // Validación básica
  if (!nombre || !email || !password || !preguntaSeguridad || !respuestaSeguridad) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const db = await connectToDatabase();

    // Verificar si el nombre de usuario ya existe
    const nombreExistente = await db.collection('usuarios').findOne({ nombre });
    if (nombreExistente) {
      return res.status(409).json({ message: 'Ese nombre de usuario ya está en uso' });
    }

    // Verificar si el email ya está registrado
    const emailExistente = await db.collection('usuarios').findOne({ email });
    if (emailExistente) {
      return res.status(409).json({ message: 'Ese correo electrónico ya está registrado' });
    }

    // Hashear contraseña y respuesta de seguridad
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedRespuesta = await bcrypt.hash(respuestaSeguridad, 10);

    // Crear usuario
    await db.collection('usuarios').insertOne({
      nombre,
      email,
      password: hashedPassword,
      preguntaSeguridad,
      respuestaSeguridad: hashedRespuesta,
      createdAt: new Date()
    });

    return res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en el registro:', error);
    return res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
}
