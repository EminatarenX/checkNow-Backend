import { Router } from 'express'
import checksController from '../controllers/check.js'
import { checkAuth } from '../helpers/checkAuth.js'

const router = Router()

router.get('/empresa', checkAuth, checksController.obtenerChecks)
router.get("/empleado", checkAuth, checksController.obtenerChecksUsuario)
router.post("/", checkAuth, checksController.registrarCheckUsuario)
router.get("/salida", checkAuth, checksController.registrarSalidaUsuario)

export default router