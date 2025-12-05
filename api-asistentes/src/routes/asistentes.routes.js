import { Router } from 'express';
import { 
    getAsistentesByEvento,
    createAsistente,
    deleteAsistente,
    updateAsistente,
    getReporteAsistentes // <-- NUEVA FUNCIÓN IMPORTADA
} from '../controllers/asistentes.controller.js';

const router = Router();

router.get('/asistentes/:eventoId', getAsistentesByEvento);

router.post('/asistentes', createAsistente);
router.delete('/asistentes/:id', deleteAsistente);
router.put('/asistentes/:id', updateAsistente);

// RUTA NUEVA: Ruta para descargar el reporte PDF
router.get('/asistentes/reporte/:eventoId', getReporteAsistentes); 

export default router;