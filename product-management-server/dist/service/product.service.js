"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const mock_products_1 = require("../data/mock-products");
const uuid_1 = require("uuid");
class ProductService {
    constructor() {
        this.products = [...mock_products_1.mockProducts];
    }
    getAll() {
        return this.products;
    }
    getById(id) {
        return this.products.find(p => p.id === id);
    }
    create(productData) {
        const newProduct = {
            id: (0, uuid_1.v4)(),
            name: productData.name,
            price: productData.price,
            stock: productData.stock,
        };
        this.products.push(newProduct);
        return newProduct;
    }
    update() {
    }
    delete(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1)
            return false;
        this.products.splice(index, 1);
        return true;
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map