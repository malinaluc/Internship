import express from "express";
import {ProductController} from "../controller/product.controller";

const router = express.Router();
const controller = new ProductController();

router.get("/products", controller.getAll);
router.get("/products/:id", controller.getById);
router.post("/products", controller.create);
router.put("/products/:id", controller.update);
router.delete("/products/:id", controller.delete);

export default router;