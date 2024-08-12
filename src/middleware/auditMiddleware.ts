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
    const action = determineAction(req.method);
    const UserId = req.userData?.id;
    const timestamp = new Date();

    let previous_data: any = null;
    let new_data: any = null;

    if (action === "READ") {
      next();
      return;
    }

    if (action === "DELETE" || action === "UPDATE" || action === "READ ONE") {
      previous_data = await getPreviousData(entityName, req.params.id);
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
  method: string
): "CREATE" | "READ" | "DELETE" | "UPDATE" | "READ ONE" => {
  switch (method) {
    case "POST":
      return "CREATE";
    case "GET":
      return "READ";
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
      previousData = await User.findByPk(entityId);
      break;
    case "Employee":
      previousData = await Employee.findByPk(entityId);
      break;
    case "Store":
      previousData = await Store.findByPk(entityId);
      break;
    case "Payroll":
      previousData = await Payroll.findByPk(entityId);
      break;
    case "Attendance":
      previousData = await Attendance.findByPk(entityId);
      break;
    default:
      throw new Error(`Entity ${entityName} not recognized`);
  }

  return previousData ? previousData.toJSON() : null;
};
