
import {Router} from "express"
import empresasController from "../controllers/empresas.js"
import { checkAuth } from "../helpers/checkAuth.js"
import empresas from "../controllers/empresas.js";

const router = Router()

router.get("/", checkAuth, empresasController.obtenerEmpresa);
router.post("/editar", checkAuth, empresasController.actualizarDatosEmpresa);
router.delete("/:id", checkAuth, empresasController.eliminarEmpresa);
router.get("/solicitudes", checkAuth, empresasController.obtenerSolicitudes)
router.post("/solicitudes/aceptar", checkAuth, empresasController.aceptarSolicitud)
router.delete("/solicitudes/rechazar/:id", checkAuth, empresasController.rechazarSolicitud)

export default router
