import { connectToDatabase } from '../../lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Error: Falta el email o la contraseña.");
    return res.status(400).json({ message: 'El correo y la contraseña son obligatorios' });
  }

  try {
    console.log("Conectando a la base de datos...");
    const db = await connectToDatabase();
    console.log("Conexión exitosa.");

    const user = await db.collection('usuarios').findOne({ email });

    if (!user) {
      console.log("Error: El correo no está registrado.");
      return res.status(400).json({ message: 'El correo no está registrado' });
    }

    console.log("Usuario encontrado:", { email: user.email, passwordHash: user.password, nombre: user.nombre });

    // Verificamos si la contraseña ingresada coincide con la encriptada en la base de datos
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Error: Contraseña incorrecta.");
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    if (!process.env.JWT_SECRET) {
      console.error("ERROR: JWT_SECRET no está definido en .env.local");
      return res.status(500).json({ message: "Error del servidor: configuración incorrecta" });
    }

    // Crear un JWT (JSON Web Token)
    const token = jwt.sign(
      { userId: user._id, email: user.email, nombre: user.nombre }, // Incluimos 'nombre' en el JWT
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    console.log("Token generado correctamente:", token);

    // Configurar cookie segura
    const serializedCookie = serialize('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 3600, // 1 hora
    });

    res.setHeader('Set-Cookie', serializedCookie);

    console.log("Inicio de sesión exitoso para:", user.email);

    return res.status(200).json({ 
      message: 'Inicio de sesión exitoso', 
      user: { id: user._id, email: user.email, nombre: user.nombre } // Devolvemos 'nombre' en la respuesta
    });

  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
}


