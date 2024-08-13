import { Request, Response, NextFunction } from "express";
import AuditLog from "../models/auditlog";
import { AuthenticatedRequest } from "./authMiddleware";
import User from "../models/user";
import Employee from "../models/employee";
import Store from "../models/store";
import Payroll from "../models/payroll";
import Attendance from "../models/attendance";

export const auditMiddleware = (entityName: string) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const action = determineAction(req.method, req.params.id);
    const UserId = req.userData?.id;
    const timestamp = new Date();

    let previous_data: any = null;
    let new_data: any = null;

    if (req.params.id && isNaN(Number(req.params.id))) {
      return res.status(400).json({
        message: "Invalid ID parameter, it must be a number",
      });
    }

    if (action === "DELETE" || action === "UPDATE" || action === "READ ONE") {
      if(req.params.id) {
        previous_data = await getPreviousData(entityName, req.params.id);
      }
    }
    
    res.on("finish", async () => {
      if (action === "CREATE" || action === "UPDATE") {
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

const determineAction = (
  method: string,
  entityId: string | undefined
): "CREATE" | "READ" | "DELETE" | "UPDATE" | "READ ONE" => {
  switch (method) {
    case "POST":
      return "CREATE";
    case "GET":
      return entityId ? "READ ONE" : "READ";
    case "DELETE":
      return "DELETE";
    case "PUT":
    case "PATCH":
      return "UPDATE";
    default:
      throw { name: "Invalid Action Type" };
  }
};

const getPreviousData = async (entityName: string, entityId: string) => {
  let previousData: any = null;

  switch (entityName) {
    case "User":
      previousData = await User.findByPk(parseInt(entityId));
      break;
    case "Employee":
      previousData = await Employee.findByPk(parseInt(entityId));
      break;
    case "Store":
      previousData = await Store.findByPk(parseInt(entityId));
      break;
    case "Payroll":
      previousData = await Payroll.findByPk(parseInt(entityId));
      break;
    case "Attendance":
      previousData = await Attendance.findByPk(parseInt(entityId));
      break;
    default:
      throw new Error(`Entity ${entityName} not recognized`);
  }

  return previousData ? previousData.toJSON() : null;
};
