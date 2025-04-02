import { Request, Response, NextFunction } from "express";

import signupService from "../services/signup.service";

class SignupController {
    async emailSignup(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await signupService.emailSignup(req.body);
            return res.status(201).json(user);
        } catch (err) {
            return next(err);
        }
    }
}

export default new SignupController();
