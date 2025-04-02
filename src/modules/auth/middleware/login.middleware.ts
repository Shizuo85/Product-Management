import { Request, Response, NextFunction } from 'express';

import loginSchema from '../schemas/login.schema';

class LoginMiddleware {
    async emailLogin(req: Request, res: Response, next: NextFunction) {
        try {
            req.body = await loginSchema.emailLogin.validateAsync(req.body);
            let x: string | string[] =
                req?.headers['x-forwarded-for'] ||
                req?.ip?.split(':').pop() ||
                '';
            req.body.ip = typeof x == 'string' ? x.split(',')[0] : '1';
            return next();
        } catch (err: any) {
            err.status = 422;
            return next(err);
        }
    }
}

export default new LoginMiddleware();
