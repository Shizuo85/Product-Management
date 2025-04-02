import { Request, Response, NextFunction } from "express";

import loginService from "../services/login.service";

class LoginController {
    async emailLogin(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await loginService.emailLogin(req.body);
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }
}

export default new LoginController();
