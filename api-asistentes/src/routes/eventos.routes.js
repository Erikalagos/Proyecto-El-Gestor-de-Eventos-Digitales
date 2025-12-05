import { Router } from 'express';
import { 
    getEventos, 
    getEventoById, 
    createEvento,
    deleteEvento,
    updateEvento
} from '../controllers/eventos.controller.js';

const router = Router();

router.get('/eventos', getEventos);
router.get('/eventos/:id', getEventoById);
router.post('/eventos', createEvento);
router.delete('/eventos/:id', deleteEvento);
router.put('/eventos/:id', updateEvento);
// (Puedes agregar PUT y DELETE si los necesitas)

export default router;