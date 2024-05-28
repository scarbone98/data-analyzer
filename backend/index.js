import express from 'express';
import bodyParser from 'body-parser';
import { createServer } from 'node:http';
import cors from 'cors';
import fileRoutes from './files/route.js';
import jobRoutes from './jobs/route.js';

const app = express();
const server = createServer(app);

app.use(cors()); // Enable CORS for all routes

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/files', fileRoutes);
app.use('/jobs', jobRoutes);

const PORT = 4000;

server.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});