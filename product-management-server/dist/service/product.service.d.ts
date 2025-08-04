import { Product } from "../types/product.types";
export declare class ProductService {
    private products;
    getAll(): Product[];
    getById(id: string): Product | undefined;
    create(productData: Product): Product;
    update(): void;
    delete(id: string): boolean;
}
//# sourceMappingURL=product.service.d.ts.map