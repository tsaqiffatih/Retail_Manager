import { Request, Response, NextFunction } from 'express';
import AuditLog from '../models/auditlog';
import { AuthenticatedRequest } from './authMiddleware';


export const auditMiddleware = (entityName: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const action = determineAction(req.method);
    const UserId = req.userData?.id;
    const timestamp = new Date();

    let previous_data: any = null;
    let new_data: any = null;

    if (action === 'READ') {
      next();
      return;
    }

    if (action === 'DELETE' || action === 'UPDATE' || action === 'READ ONE') {
      previous_data = await getPreviousData(entityName, req.params.id); // Implementasikan fungsi untuk mendapatkan data sebelumnya
    }

    res.on('finish', async () => {
      if (action === 'CREATE' || action === 'UPDATE') {
        new_data = req.body;
      }

      if (UserId) {
        await AuditLog.createLog({
          action,
          entity_name: entityName,
          entity_id: req.params.id ? parseInt(req.params.id, 10) : undefined,
          previous_data,
          new_data,
          timestamp,
          UserId,
        });
      }
    });

    next();
  };
};

const determineAction = (method: string): "CREATE" | "READ" | "DELETE" | "UPDATE" | "READ ONE" => {
  switch (method) {
    case 'POST':
      return 'CREATE';
    case 'GET':
      return 'READ';
    case 'DELETE':
      return 'DELETE';
    case 'PUT':
    case 'PATCH':
      return 'UPDATE';
    default:
      throw new Error('Invalid method');
  }
};

const getPreviousData = async (entityName: string, entityId: string) => {
  // Implementasikan logika untuk mendapatkan data sebelumnya berdasarkan entityName dan entityId
  return null;
};
