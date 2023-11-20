import { Router } from 'express';
import nominaController from '../controllers/nomina.js';
import { checkAuth } from '../helpers/checkAuth.js';

const router = Router();

router.post('/', checkAuth, nominaController.generarNomina)
router.get('/', checkAuth, nominaController.getNominasEmpresa)
router.delete('/delete/:id', checkAuth, nominaController.eliminarDocumento)

export default router;