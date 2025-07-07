import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  const db  = await connectToDatabase();
  const { userId } = req.query;  // userId ahora corresponde al email

  if (!userId) {
    return res.status(400).json({ message: 'Falta el email de usuario' });
  }

  switch (req.method) {
    case 'GET':
      try {
        // Modificado para buscar por email en lugar de id
        const user = await db.collection('usuarios').findOne({ email: userId });

        if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(user?.observaciones || '');
      } catch (error) {
        console.error('Error al obtener observaciones:', error);
        res.status(500).json({ message: 'Error al obtener observaciones', error: error.message });
      }
      break;

    case 'POST':
      try {
        const { observaciones } = req.body;
        // Modificado para actualizar las observaciones usando email en lugar de id
        const result = await db.collection('usuarios').updateOne(
          { email: userId },  // Usamos email para identificar al usuario
          { $set: { observaciones } },
          { upsert: true }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Usuario no encontrado para actualizar observaciones' });
        }

        res.status(200).json({ message: 'Observaciones actualizadas' });
      } catch (error) {
        console.error('Error al guardar observaciones:', error);
        res.status(500).json({ message: 'Error al guardar observaciones', error: error.message });
      }
      break;

    case 'DELETE':
      try {
        // Modificado para eliminar las observaciones usando email en lugar de id
        const result = await db.collection('usuarios').updateOne(
          { email: userId },  // Usamos email para identificar al usuario
          { $unset: { observaciones: '' } }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Usuario no encontrado para eliminar observaciones' });
        }

        res.status(200).json({ message: 'Observaciones eliminadas' });
      } catch (error) {
        console.error('Error al eliminar observaciones:', error);
        res.status(500).json({ message: 'Error al eliminar observaciones', error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Método ${req.method} no permitido`);
      break;
  }
}
