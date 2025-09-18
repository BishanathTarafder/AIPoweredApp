import express from 'express';
import dotenv from 'dotenv';
import { setupRoutes } from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Setup routes
setupRoutes(app);

app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
});
