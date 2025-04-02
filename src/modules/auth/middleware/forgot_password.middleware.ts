import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import CustomRequest from "../../../lib/custom.request";
import { decrypt } from "../../aes/aes.service";

import newPasswordSchema from "../schemas/forgot_password.schema";

class NewPasswordMiddleware {
    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            req.body =await newPasswordSchema.forgotPassword.validateAsync(req.body);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }

    async forgotPasswordVerify(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            req.query = await newPasswordSchema.forgotPasswordVerify.validateAsync(req.query);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }

    authenticateReset(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const token = req.get("Authorization")?.split(" ")[1];
            if (!token) {
                const err: any = new Error("Bad request, token missing");
                err.status = 400;
                throw err;
            }
            const payLoad: any = jwt.verify(
                decrypt(token),
                process.env.JWT_SECRET!
            );
            if (payLoad?.action != "reset_jwt") {
                const err: any = new Error("Bad request, invalid token");
                err.status = 400;
                throw err;
            }
            req.user = payLoad.user;
            return next();
        } catch (err: any) {
            err.status = err.status ?? 400;
            return next(err);
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            req.body = await newPasswordSchema.resetPassword.validateAsync(req.body);
            return next();
        } catch(err: any){
            err.status = 422;
            return next(err);
        }
    }
}

export default new NewPasswordMiddleware();
