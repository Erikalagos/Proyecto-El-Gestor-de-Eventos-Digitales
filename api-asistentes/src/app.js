import express from 'express';
import cors from 'cors';
// 1. Importa tus nuevas rutas
import eventosRoutes from './routes/eventos.routes.js';
import asistentesRoutes from './routes/asistentes.routes.js';

const app = express();
app.use(cors());

// 2. Límite de 50mb (igual que tu API)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 3. Tu configuración de CORS (exactamente la misma)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', "Content-Type, Authorization");
    if (req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});

// 4. Usa las nuevas rutas
app.use('/api', eventosRoutes);
app.use('/api', asistentesRoutes);

export default app;