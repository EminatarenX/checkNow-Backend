
import {Router} from "express"
import plazasController from "../controllers/plazas.js"

const router = Router()

router.get("/", plazasController.obtenerplazas)
router.post("crear/", plazasController.crearPlaza)
router.put("editar/:id", plazasController.actualizarPlaza)
router.delete("eliminar/:id", plazasController.eliminarPlaza)


export default router
