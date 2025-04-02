import { Router } from 'express';

import productController from '../modules/product/controllers/product.controller';
import productMiddleware from '../modules/product/middleware/product.middleware';

import generalMiddleware from '../modules/general/middleware/general.middleware';
import authMiddleware from "../modules/user/middleware/auth.middleware";

const productRouter = Router();

productRouter.post(
    '/create',
    authMiddleware,
    productMiddleware.createProduct,
    productController.createProduct
);

productRouter.get(
    '/all',
    authMiddleware,
    productMiddleware.fetchProducts,
    productController.fetchProducts
);

productRouter.patch(
    '/edit/:id',
    authMiddleware,
    generalMiddleware.sanitizeParams,
    productMiddleware.editProduct,
    productController.editProduct
);

productRouter.delete(
    '/delete/:id',
    authMiddleware,
    generalMiddleware.sanitizeParams,
    productController.deleteProduct
);

export default productRouter;
