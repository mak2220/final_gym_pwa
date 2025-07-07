import { connectToDatabase } from '../../lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { email, nuevaPassword } = req.body;

  if (!email || !nuevaPassword) {
    console.log("Error: Faltan el email de usuario o la nueva contraseña.");
    return res.status(400).json({ message: 'El email y la nueva contraseña son obligatorios' });
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

    console.log("Usuario encontrado. Hasheando nueva contraseña...");
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

    const result = await db.collection('usuarios').updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount === 0) {
      console.log("No se modificó ninguna contraseña.");
      return res.status(400).json({ message: 'No se pudo actualizar la contraseña' });
    }

    console.log("Contraseña actualizada correctamente.");
    return res.status(200).json({ message: 'Contraseña actualizada correctamente' });

  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
}

