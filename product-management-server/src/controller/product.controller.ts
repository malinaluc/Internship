import { Request, Response } from "express";
import {ProductService} from "../service/product.service";

const productService = new ProductService();

export class ProductController {
    public getAll(req: Request, res: Response): void {
        const products = productService.getAll();
        res.json(products);
    }

    public getById(req: Request, res: Response): void {
        const id = req.params.id;
        const product = productService.getById(id!);

        product
            ? res.json(product)
            : res.status(404).json({"Product not found, id: ": id});
    }

    public create(req: Request, res: Response): void {
        const { name, price, stock } = req.body;

        if (!name || !price || !stock) {
            res.status(400);
            return;
        }

        const newProduct = productService.create({ name, price, stock });
        res.status(200).json(newProduct);
    }

    public update(req: Request, res: Response): void {
        const id = req.params.id;

    }

    public delete(req: Request, res: Response): void {
        const id = req.params.id;
        const deleted = productService.delete(id!);

        deleted
            ? res.sendStatus(200)
            : res.status(404).json({"Product cant be deleted, id: ": id});
    }
}