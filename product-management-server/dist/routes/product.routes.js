"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controller/product.controller");
const router = express_1.default.Router();
const controller = new product_controller_1.ProductController();
router.get("/products", controller.getAll);
router.get("/products/:id", controller.getById);
router.post("/products", controller.create);
router.put("/products/:id", controller.update);
router.delete("/products/:id", controller.delete);
exports.default = router;
//# sourceMappingURL=product.routes.js.map