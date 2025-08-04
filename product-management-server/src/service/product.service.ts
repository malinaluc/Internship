import { Product } from "../types/product.types";
import { mockProducts } from "../data/mock-products";
import { v4 as uuidv4 } from "uuid";

export class ProductService {
    private products: Product[] = [...mockProducts];

    public getAll(): Product[] {
        return this.products;
    }

    public getById(id: string): Product | undefined {
        return this.products.find(p => p.id === id);
    }

    public create(productData: Product): Product {
        const newProduct: Product = {
            id: uuidv4(),
            name: productData.name,
            price: productData.price,
            stock: productData.stock,
        };
        this.products.push(newProduct);
        return newProduct;
    }

    public update(): void {

    }

    public delete(id: string): boolean {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return false;

        this.products.splice(index, 1);
        return true;
    }
}