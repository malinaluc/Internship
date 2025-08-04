import express, {Request, Response} from 'express';
import productRoutes from './routes/product.routes'

const app = express();

const port = 3000;

app.use(express.json());

app.use('/', productRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript + Node.js + Express!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});