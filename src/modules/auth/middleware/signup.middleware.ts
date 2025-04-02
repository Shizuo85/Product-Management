import { Request, Response, NextFunction } from 'express';

import signupSchema from '../schemas/signup.schema';
class SignupMiddleware {
    async emailSignup(req: Request, res: Response, next: NextFunction) {
        try {
            req.body = await signupSchema.emailSignup.validateAsync(req.body);
            return next();
        } catch (err: any) {
            err.status = 422;
            return next(err);
        }
    }
}

export default new SignupMiddleware();


