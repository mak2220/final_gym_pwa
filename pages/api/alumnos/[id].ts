// pages/api/alumnos/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
    body,
  } = req;

  if (!ObjectId.isValid(id as string)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  const client = await clientPromise;
  const db = client.db('app_gym');
  const collection = db.collection('usuarios');

  switch (method) {
    case 'GET':
      try {
        const alumno = await collection.findOne(
          { _id: new ObjectId(id as string) },
          { projection: { password: 0, createdAt: 0 } }
        );

        if (!alumno) {
          return res.status(404).json({ message: 'Alumno no encontrado' });
        }

        return res.status(200).json(alumno);
      } catch (error) {
        console.error('Error al obtener alumno:', error);
        return res.status(500).json({ message: 'Error al obtener alumno', error });
      }

    case 'PUT':
      try {
        const data = typeof body === 'string' ? JSON.parse(body) : body;

        if (!data || typeof data !== 'object') {
          return res.status(400).json({ message: 'Datos inválidos para actualizar' });
        }

        delete data._id;
        if ('password' in data) delete data.password;

        const result = await collection.updateOne(
          { _id: new ObjectId(id as string) },
          { $set: data }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Alumno no encontrado' });
        }

        return res.status(200).json({ message: 'Alumno actualizado correctamente' });
      } catch (error) {
        console.error('Error al actualizar alumno:', error);
        return res.status(500).json({ message: 'Error al actualizar alumno', error });
      }

    // 👇 NUEVO CASO DELETE
    case 'DELETE':
      try {
        const result = await collection.deleteOne({ _id: new ObjectId(id as string) });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Alumno no encontrado o ya eliminado' });
        }

        return res.status(200).json({ message: 'Alumno eliminado correctamente' });
      } catch (error) {
        console.error('Error al eliminar alumno:', error);
        return res.status(500).json({ message: 'Error al eliminar alumno', error });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Método ${method} no permitido`);
  }
}
