import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helper/jsonWebToken";
import User, { UserRole } from "../models/user";
import Store from "../models/store";
import Employee from "../models/employee";
import { TokenPayload } from "../interface/auth";

export interface AuthenticatedRequest extends Request {
  userData?: {
    id: number;
    email: string;
    role: UserRole;
    storeId: number | null;
  };
}

export const authentication = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const access = req.headers.authorization;

    if (!access) throw { name: "Invalid Token" };
    const [bearer, token] = access.split(" ");

    if (bearer !== "Bearer" || !token) throw { name: "Invalid Token" };

    const verify = verifyToken(token) as TokenPayload

    if (typeof verify === "string" || !('email' in verify)) throw { name: "Invalid Token" };

    const user = await User.findOne({
      where: { email: verify.email },
      include: [{
        model: Employee,
        as: "employee",
        attributes: ["StoreId"],
      }],
    })

    if (!user) throw { name: "invalid token" };

    req.userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      storeId: user.employee ? user.employee.StoreId : null,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeRole = (...requiredRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userData || !requiredRoles.includes(req.userData.role)) {
        throw { name: "forbidden" };
      }
      next();
    } catch (error) {
      // console.log(error);
      next(error)
    }
  };
};

// export const authorizeStoreAccess = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const store = await Store.findByPk(req.params.id);
//     if (!store) {
//       return res.status(404).json({ message: "Store not found" });
//     }

//     const userRole = req.userData.role;
//     const userId = req.userData.id;

//     if (
//       userRole === "Super Admin" ||
//       userRole === "Owner" ||
//       userRole === "Manager" ||
//       (userRole === "Admin" && store.ManagerId === userId) ||
//       userId === store.ManagerId
//     ) {
//       next();
//     } else {
//       res
//         .status(403)
//         .json({ message: "You do not have access to this store" });
//     }
//   } catch (error) {
//     next(error);
//   }
// };
