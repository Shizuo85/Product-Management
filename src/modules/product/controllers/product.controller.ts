import { Response, NextFunction } from 'express';

import CustomRequest from '../../../lib/custom.request';
import productService from '../services/product.service';

class ProductController {
    async createProduct(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await productService.createProduct({
                ...req.body,
                creator: req.user,
            });
            return res.status(201).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async fetchProducts(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await productService.fetchProducts({
                ...req.query,
                user: req.user,
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async editProduct(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await productService.editProduct({
                ...req.params,
                ...req.body,
                user: req.user,
            });
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    async deleteProduct(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await productService.deleteProduct({
                ...req.params,
                user: req.user,
            });
            return res.status(204).json(user);
        } catch (err) {
            return next(err);
        }
    }
}

export default new ProductController();
