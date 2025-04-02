import { Request, Response, NextFunction } from "express";

import generalSchema from "../schemas/general.schema";

class GeneralMiddleware {
    async sanitizeParams(req: Request, res: Response, next: NextFunction){
        try{
            req.params = await generalSchema.paramsId.validateAsync(req.params);
            return next();
        }catch(err: any){
            err.status = 422;
            return next(err);
        }
    }
}

export default new GeneralMiddleware();