"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("../service/product.service");
const productService = new product_service_1.ProductService();
class ProductController {
    getAll(req, res) {
        const products = productService.getAll();
        res.json(products);
    }
    getById(req, res) {
        const id = req.params.id;
        const product = productService.getById(id);
        product
            ? res.json(product)
            : res.status(404).json({ "Product not found, id: ": id });
    }
    create(req, res) {
        const { name, price, stock } = req.body;
        if (!name || !price || !stock) {
            res.status(400);
            return;
        }
        const newProduct = productService.create({ name, price, stock });
        res.status(200).json(newProduct);
    }
    update(req, res) {
        const id = req.params.id;
    }
    delete(req, res) {
        const id = req.params.id;
        const deleted = productService.delete(id);
        deleted
            ? res.sendStatus(200)
            : res.status(404).json({ "Product cant be deleted, id: ": id });
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map